
const httpMocks = require('node-mocks-http');

// Mock mongoose
jest.mock('mongoose', () => {
  const mInvoice = { 
    findOneAndUpdate: jest.fn() 
  };
  const mPayment = { 
    updateMany: jest.fn() 
  };
  
  return {
    model: jest.fn((modelName) => {
      if (modelName === 'Invoice') return mInvoice;
      if (modelName === 'Payment') return mPayment;
      return null;
    }),
    mInvoice,
    mPayment,
  };
});

const mongoose = require('mongoose');
const remove = require('../controllers/appControllers/invoiceController/remove');

describe('Invoice Remove Controller', () => {
  let req, res;
  const mockInvoiceId = '507f1f77bcf86cd799439011';
  
  beforeEach(() => {
    req = httpMocks.createRequest({
      params: {
        id: mockInvoiceId
      }
    });
    res = httpMocks.createResponse();
    jest.clearAllMocks();
  });

  /*
    Nombre de la prueba: debería eliminar una factura exitosamente y sus pagos asociados
    Objetivo: Probar que una factura se elimina correctamente y actualiza sus pagos a eliminados
    Resultado esperado: Se marca la factura como eliminada y se actualizan sus pagos
  */
  it('debería eliminar una factura exitosamente y sus pagos asociados', async () => {
    const mockDeletedInvoice = {
      _id: mockInvoiceId,
      removed: true
    };

    mongoose.mInvoice.findOneAndUpdate.mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(mockDeletedInvoice)
    }));

    mongoose.mPayment.updateMany.mockResolvedValue({ modifiedCount: 2 });

    await remove(req, res);

    expect(mongoose.mInvoice.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: mockInvoiceId, removed: false },
      { $set: { removed: true } }
    );

    expect(mongoose.mPayment.updateMany).toHaveBeenCalledWith(
      { invoice: mockInvoiceId },
      { $set: { removed: true } }
    );

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      success: true,
      result: mockDeletedInvoice,
      message: 'Invoice deleted successfully'
    });
  });

  /*
    Nombre de la prueba: debería retornar 404 si la factura no existe
    Objetivo: Probar que se retorna un error si la factura no existe o ya está eliminada
    Resultado esperado: Se retorna un error 404
  */
  it('debería retornar 404 si la factura no existe', async () => {
    mongoose.mInvoice.findOneAndUpdate.mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(null)
    }));

    await remove(req, res);

    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      result: null,
      message: 'Invoice not found'
    });
  });

  /*
    Nombre de la prueba: debería manejar errores de la base de datos
    Objetivo: Probar que se manejan correctamente los errores de la base de datos
    Resultado esperado: Se propaga el error correctamente
  */
  it('debería manejar errores de la base de datos', async () => {
    const mockError = new Error('Database error');
    mongoose.mInvoice.findOneAndUpdate.mockImplementation(() => ({
      exec: jest.fn().mockRejectedValue(mockError)
    }));

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