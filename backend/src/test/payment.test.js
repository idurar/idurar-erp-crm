/*
    Para estos casos se utiliza un mock de mongoose para simular la DB y 
    los modelos de mongoose.
    Siguen siendo prueba unitarias ya que se prueban funciones específicas
    de un controlador.
*/

const { create } = require('@/controllers/appControllers/paymentController');

const mongoose = require('mongoose');

jest.mock('mongoose', () => ({
  model: jest.fn().mockReturnValue({
    findOne: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
  }),
}));

const req = {
  body: { amount: 300, invoice: '123' },
  admin: { _id: 'admin123' },
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('create', () => {
  let mockCalculate;
  beforeEach(() => {
    mockCalculate = {
      sub: jest.fn((a, b) => a - b),
      add: jest.fn((a, b) => a + b),
    };
  });

  /*
    Nombre de la prueba: debería retornar un error si el monto es 0
    Objetivo: Probar que el monto no puede ser 0
    Resultado esperado: Se retorna un error si el monto es 0
  */
  it('debe retornar un error si el monto es 0', async () => {
    req.body.amount = 0;

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: "The Minimum Amount couldn't be 0",
    });
  });

  /*
    Nombre de la prueba: debería retornar un error si el monto excede el máximo permitido
    Objetivo: Probar que el monto no puede exceder el máximo permitido
    Resultado esperado: Se retorna un error si el monto excede el máximo permitido
  */
  it('debe retornar un error si el monto excede el máximo permitido', async () => {
    //
    req.body.amount = 300;
    mongoose.model('Invoice').findOne.mockResolvedValue({
      total: 500,
      discount: 50,
      credit: 200,
    });

    await create(req, res);
    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: `The Max Amount you can add is 250`,
    });
  });
 
});
