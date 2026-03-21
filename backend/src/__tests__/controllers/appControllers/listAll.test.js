const listAll = require('../../../controllers/appControllers/clientController/listAll'); 
const {migrate} = require('../../../controllers/appControllers/clientController/migrate.js')



jest.mock('../../../controllers/appControllers/clientController/migrate.js'); // Mocking the migrate function

describe('listAll function', () => {
    let mockFind;
    let mockSort;
    let mockPopulate;
    let mockExec;
    let mockRes;
  
    beforeEach(() => {
      mockFind = jest.fn();
      mockSort = jest.fn();
      mockPopulate = jest.fn();
      mockExec = jest.fn();
      mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      migrate.mockImplementation((x) => x); 
  
      // Mocking Model methods
      const Model = {
        find: mockFind.mockReturnThis(),
        sort: mockSort.mockReturnThis(),
        populate: mockPopulate.mockReturnThis(),
        exec: mockExec,
      };
  
      global.Model = Model; 
    });
  
    it('should return a non-empty list', async () => {
      const mockData = [{ _id: '1', data: 'sample' }];
      mockExec.mockResolvedValue(mockData);
  
      const req = { query: { sort: '1' } };
  
      await listAll(Model, req, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        result: mockData,
        message: 'Successfully found all documents',
      });
      expect(migrate).toHaveBeenCalled();
    });
  
    it('should handle an empty collection', async () => {
      mockExec.mockResolvedValue([]);
  
      const req = { query: { sort: '1' } };
  
      await listAll(Model, req, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(203);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        result: [],
        message: 'Collection is Empty',
      });
    });
  
    it('should handle errors gracefully', async () => {
      mockExec.mockRejectedValue(new Error('Database Error'));
  
      const req = { query: { sort: '1' } };
  
      await expect(listAll(Model, req, mockRes)).rejects.toThrow('Database Error');
  
    });
  });