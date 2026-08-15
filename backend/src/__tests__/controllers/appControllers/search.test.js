const search = require('../../../controllers/appControllers/clientController/search');
const {migrate} = require('../../../controllers/appControllers/clientController/migrate');

jest.mock('../../../controllers/appControllers/clientController/migrate.js');

describe('search function', () => {
  let mockFind;
  let mockWhere;
  let mockLimit;
  let mockExec;
  let mockRes;

  beforeEach(() => {
    mockFind = jest.fn();
    mockWhere = jest.fn();
    mockLimit = jest.fn();
    mockExec = jest.fn();
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis(),end: jest.fn() };

    migrate.mockImplementation((x) => x); // Assuming migrate is a simple pass-through for this test

    // Mocking Model methods
    const Model = {
      find: mockFind.mockReturnThis(),
      where: mockWhere.mockReturnThis(),
      limit: mockLimit.mockReturnThis(),
      exec: mockExec,
    };

    global.Model = Model; // Make the mocked Model globally available
  });

  it('should return results for a successful search', async () => {
    const mockData = [{ _id: '1', data: 'sample' }];
    mockExec.mockResolvedValue(mockData);

    const req = { query: { q: 'sample', fields: 'name,email' } };

    await search(Model, req, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      result: mockData, // Assuming migrate function returns the same data
      message: 'Successfully found all documents',
    });
    expect(migrate).toHaveBeenCalled();
  });

  it('should return an empty array for no matching results', async () => {
    mockExec.mockResolvedValue([]);

    const req = { query: { q: 'nonexistent', fields: 'name,email' } };

    await search(Model, req, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(202);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      result: [],
      message: 'No document found by this request',
    });
  });

  it('should handle errors gracefully', async () => {
    mockExec.mockRejectedValue(new Error('Database Error'));

    const req = { query: { q: 'error', fields: 'name,email' } };

    await expect(search(Model, req, mockRes)).rejects.toThrow('Database Error');
  });
});
