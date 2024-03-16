const paginatedList = require('../../../controllers/appControllers/clientController/paginatedList')
const {migrate} = require('../../../controllers/appControllers/clientController/migrate.js')


jest.mock('../../../controllers/appControllers/clientController/migrate.js');


describe('paginatedList function', () => {
    let mockFind;
  let mockCountDocuments;
  let mockSkip;
  let mockLimit;
  let mockSort;
  let mockPopulate;
  let mockExec;
  let mockRes;


  beforeEach(()=> {
    mockFind = jest.fn();
    mockCountDocuments = jest.fn();
    mockSkip = jest.fn();
    mockLimit = jest.fn();
    mockSort = jest.fn();
    mockPopulate = jest.fn();
    mockExec = jest.fn();
    mockRes = {status: jest.fn().mockReturnThis(), json: jest.fn()};


    migrate.mockImplementation((x) => x);

    // Mocking Model methods
    const Model = {
        find: mockFind.mockReturnThis(),
        countDocuments: mockCountDocuments,
        skip: mockSkip.mockReturnThis(),
        limit: mockLimit.mockReturnThis(),
        sort: mockSort.mockReturnThis(),
        populate: mockPopulate.mockReturnThis(),
        exec: mockExec,
      };


      global.Model = Model;
  })


  it('should return a non-empty list with pagination', async () => {
    const mockData = [{ _id: '1', data: 'sample' }];
    const itemCount = 20; // Assuming 20 items in the database
    mockExec.mockResolvedValue(mockData);
    mockCountDocuments.mockResolvedValue(itemCount);

    const req = { query: { page: 1, items: 10 } };

    await paginatedList(Model, req, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      result: mockData,
      pagination: { page: 1, pages: 2, count: itemCount }, // 20 items, 10 per page = 2 pages
      message: 'Successfully found all documents',
    });
    expect(migrate).toHaveBeenCalled();
  });

  it('should handle an empty collection', async () => {
    mockExec.mockResolvedValue([]);
    mockCountDocuments.mockResolvedValue(0);

    const req = { query: { page: 1, items: 10 } };

    await paginatedList(Model, req, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(203);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      result: [],
      pagination: { page: 1, pages: 0, count: 0 },
      message: 'Collection is Empty',
    });
  });

  it('should handle errors gracefully', async () => {
    mockExec.mockRejectedValue(new Error('Database Error'));

    const req = { query: { page: '1', items: '10' } };

    await expect(paginatedList(Model, req, mockRes)).rejects.toThrow('Database Error');

  });


})
