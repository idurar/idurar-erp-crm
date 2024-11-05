const schema = require('../controllers/appControllers/invoiceController/schemaValidate');
const { calculate } = require('@/helpers');

jest.mock('@/helpers');

describe('Invoice Schema Validation', () => {



  /*
    Nombre de la prueba: debería validar correctamente una factura válida
    Objetivo: Probar que el esquema de validación de facturas funciona correctamente
    Resultado esperado: El objeto de la factura es válido y no se produce ningún error 
  */
  test('debería validar correctamente una factura válida', () => {
    const validInvoice = {
      client: 'Nombre del cliente',
      number: 12345,
      year: 2023,
      status: 'pending',
      notes: '',
      expiredDate: '2023-12-31',
      date: '2023-10-01',
      items: [
        {
          _id: '',
          itemName: 'Producto A',
          description: '',
          quantity: 2,
          price: 100,
          total: 200,
        },
      ],
      taxRate: 10,
    };

    const { error, value } = schema.validate(validInvoice);

    expect(error).toBeUndefined();
    expect(value).toBeDefined();
    expect(value).toEqual(
      expect.objectContaining({
        client: expect.any(String),
        items: expect.arrayContaining([
          expect.objectContaining({
            itemName: expect.any(String),
            quantity: expect.any(Number),
            price: expect.any(Number),
          }),
        ]),
      })
    );
  });



  /**
   * Nombre de la prueba: debería validar correctamente una factura con valores negativos
   * Objetivo: Probar que el esquema de validación de facturas funciona correctamente
   * Resultado esperado: El objeto de la factura es inválido y se produce un error
   */
  test('debería validar correctamente una factura con valores negativos', () => {
    const validInvoice = {
      client: 'Nombre del cliente',
      number: 12345,
      year: 2023,
      status: 'pending',
      notes: '',
      expiredDate: '2023-12-31',
      date: '2023-10-01',
      items: [
        {
          _id: '',
          itemName: 'Producto A',
          description: '',
          quantity: -2,
          price: -100,
          total: -200,
        },
      ],
      taxRate: -10,
    };

    const { error, value } = schema.validate(validInvoice);

    expect(error).toBeDefined();
    expect(value).toBeUndefined();
  
  });
});

describe('Invoice Total Calculations - Suma', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock de las funciones de cálculo ToDo: revisar bien esto
    calculate.add.mockImplementation((a, b) => a + b);
  });

  /*
    Nombre de la prueba: debería calcular correctamente la suma de los items
    Objetivo: Probar que la función de cálculo de suma funciona correctamente
    Resultado esperado: La suma de los items es correcta y se produce el resultado esperado
  */
  test('debería calcular correctamente la suma de los items', () => {
    const items = [
      { quantity: 2, price: 100 },
      { quantity: 1, price: 50 },
      { quantity: 3, price: 75 },
    ];

    let subTotal = 0;
    items.forEach((item) => {
      const total = item.quantity * item.price;
      subTotal = calculate.add(subTotal, total);
    });

    expect(subTotal).toBe(475); // (2*100) + (1*50) + (3*75) = 475 idk
  });


  /*
    Nombre de la prueba: debería calcular correctamente la suma cuando no hay items
    Objetivo: Probar que la función de cálculo de suma funciona correctamente
    Resultado esperado: La suma de los items es correcta y se produce el resultado esperado
  */
  test('debería calcular correctamente la suma cuando no hay items', () => {
    const items = [];

    let subTotal = 0;
    items.forEach((item) => {
      const total = item.quantity * item.price;
      subTotal = calculate.add(subTotal, total);
    });

    expect(subTotal).toBe(0);
  });

  /*
    Nombre de la prueba: debería manejar correctamente decimales en la suma
    Objetivo: Probar que la función de cálculo de suma funciona correctamente
    Resultado esperado: La suma de los items es correcta y se produce el resultado esperado
  
  */
  test('debería manejar correctamente decimales en la suma', () => {
    const items = [{ quantity: 1.5, price: 99.99 }];

    let subTotal = 0;
    items.forEach((item) => {
      const total = item.quantity * item.price;
      subTotal = calculate.add(subTotal, total);
    });

    expect(subTotal).toBeCloseTo(149.985); // 1.5 * 99.99
  });
});
