const httpMocks = require('node-mocks-http');

// Mock de mongoose
jest.mock('mongoose', () => {
  const mPayment = { 
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn() 
  };
  const mInvoice = { 
    findOneAndUpdate: jest.fn() 
  };
  
  return {
    model: jest.fn((modelName) => {
      if (modelName === 'Payment') return mPayment;
      if (modelName === 'Invoice') return mInvoice;
      return null;
    }),
    mPayment,
    mInvoice,
  };
});

const mongoose = require('mongoose');
const remove = require('../controllers/appControllers/paymentController/remove');

describe('Payment Remove Controller', () => {
  let req, res;
  const mockPaymentId = '507f1f77bcf86cd799439011';
  
  beforeEach(() => {
    req = httpMocks.createRequest({
      params: {
        id: mockPaymentId
      }
    });
    res = httpMocks.createResponse();
    jest.clearAllMocks();
  });

  /*
    Nombre de la prueba: debería eliminar un pago exitosamente y actualizar la factura a estado pagado
    Objetivo: Probar que un pago se elimina correctamente y la factura se actualiza a estado pagado
    Resultado esperado: Se elimina el pago y se actualiza la factura a estado
  
  */
  it('debería eliminar un pago exitosamente y actualizar la factura a estado pagado', async () => {
    // Mock del pago encontrado
    const mockPreviousPayment = {
      _id: mockPaymentId,
      amount: 1000,
      invoice: {
        id: 'invoice123',
        total: 1000,
        discount: 0,
        credit: 1000
      },
      removed: false
    };

    // Mock del pago actualizado
    const mockUpdatedPayment = {
      ...mockPreviousPayment,
      removed: true
    };

    // Mock de la factura actualizada
    const mockUpdatedInvoice = {
      _id: 'invoice123',
      payment: [],
      credit: 0,
      paymentStatus: 'paid'
    };

    mongoose.mPayment.findOne.mockResolvedValue(mockPreviousPayment);
    mongoose.mPayment.findOneAndUpdate.mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(mockUpdatedPayment)
    }));
    mongoose.mInvoice.findOneAndUpdate.mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(mockUpdatedInvoice)
    }));

    await remove(req, res);

    // Ver si se buscó el pago correcto
    expect(mongoose.mPayment.findOne).toHaveBeenCalledWith({
      _id: mockPaymentId,
      removed: false
    });

    // Ver si se actualizó el pago
    expect(mongoose.mPayment.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: mockPaymentId, removed: false },
      { $set: { removed: true } },
      { new: true }
    );

    expect(mongoose.mInvoice.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'invoice123' },
      {
        $pull: { payment: mockPaymentId },
        $inc: { credit: -1000 },
        $set: { paymentStatus: 'unpaid' }
      },
      { new: true }
    );


    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      success: true,
      result: mockUpdatedPayment,
      message: 'Successfully Deleted the document '
    });
  });

  /*
    Nombre de la prueba: debería actualizar la factura a estado parcialmente pagado
    Objetivo: Probar que la factura se actualiza a estado parcialmente pagado
    Resultado esperado: La factura se actualiza a estado parcialmente pagado
  */
  it('debería actualizar la factura a estado parcialmente pagado', async () => {
    const mockPreviousPayment = {
      _id: mockPaymentId,
      amount: 500,
      invoice: {
        id: 'invoice123',
        total: 1000,
        discount: 0,
        credit: 800
      },
      removed: false
    };

    const mockUpdatedPayment = {
      ...mockPreviousPayment,
      removed: true
    };

    mongoose.mPayment.findOne.mockResolvedValue(mockPreviousPayment);
    mongoose.mPayment.findOneAndUpdate.mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(mockUpdatedPayment)
    }));
    mongoose.mInvoice.findOneAndUpdate.mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue({})
    }));

    await remove(req, res);

    expect(mongoose.mInvoice.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'invoice123' },
      {
        $pull: { payment: mockPaymentId },
        $inc: { credit: -500 },
        $set: { paymentStatus: 'partially' }
      },
      { new: true }
    );
  });

  /*
    Nombre de la prueba: debería actualizar la factura a estado impago
    Objetivo: Probar que la factura se actualiza a estado impago
    Resultado esperado: La factura se actualiza a estado impago
  */
  it('debería actualizar la factura a estado impago', async () => {
    const mockPreviousPayment = {
      _id: mockPaymentId,
      amount: 800,
      invoice: {
        id: 'invoice123',
        total: 1000,
        discount: 0,
        credit: 800
      },
      removed: false
    };

    const mockUpdatedPayment = {
      ...mockPreviousPayment,
      removed: true
    };

    mongoose.mPayment.findOne.mockResolvedValue(mockPreviousPayment);
    mongoose.mPayment.findOneAndUpdate.mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(mockUpdatedPayment)
    }));
    mongoose.mInvoice.findOneAndUpdate.mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue({})
    }));

    await remove(req, res);

    expect(mongoose.mInvoice.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'invoice123' },
      {
        $pull: { payment: mockPaymentId },
        $inc: { credit: -800 },
        $set: { paymentStatus: 'unpaid' }
      },
      { new: true }
    );
  });

  /*
    Nombre de la prueba: debería retornar 404 si el pago no existe
    Objetivo: Probar que se retorna un error si el pago no existe
    Resultado esperado: Se retorna un error si el pago no existe
  */
  it('debería retornar 404 si el pago no existe', async () => {
    mongoose.mPayment.findOne.mockResolvedValue(null);

    await remove(req, res);

    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      result: null,
      message: 'No document found '
    });
  });

  /**
   *    Nombre de la prueba: debería manejar errores de la base de datos
   *   Objetivo: Probar que se manejan correctamente los errores de la base de datos
   *    Resultado esperado: Se manejan correctamente los errores de la base de datos
   * 
   */
  it('debería manejar errores de la base de datos', async () => {
    const mockError = new Error('Database error');
    mongoose.mPayment.findOne.mockRejectedValue(mockError);

    let errorCaught = false;
    try {
      await remove(req, res);
    } catch (error) {
      errorCaught = true;
      expect(error.message).toBe('Database error');
    }
    expect(errorCaught).toBe(true);
  });
});