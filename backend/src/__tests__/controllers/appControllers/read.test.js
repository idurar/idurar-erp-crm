const read = require('../../../controllers/appControllers/clientController/read');
const {migrate} = require('../../../controllers/appControllers/clientController/migrate');

jest.mock('../../../controllers/appControllers/clientController/migrate.js');


describe('read function', () => {
    let mockFindOne;
    let mockRes;
    let mockExec;


    beforeEach(()=> {
        mockFindOne = jest.fn();
        mockRes = {status: jest.fn().mockReturnThis(), json: jest.fn()};
        mockExec = jest.fn();


        migrate.mockImplementation((x) => x);

        const Model = {
            findOne: mockFindOne.mockReturnThis(),
            exec: mockExec,
        }

        global.Model = Model;
    })

    it('should return status 404, if no results found', async()=> {
        mockExec.mockResolvedValue(null);

        const req = {params:{id:1}}

        await read(Model,req,mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'No document found ',
    });
    })


    it('should return documents if client is people', async ()=> {
       const mockData = { _id: '123', data: 'sample' };
       mockExec.mockResolvedValue(mockData);

       const req = {params:{id:'123'}};

       await read(Model,req,mockRes);

       expect(mockRes.status).toHaveBeenCalledWith(200);
       expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        result: mockData, 
        message: 'we found this document ',
      });
      expect(migrate).toHaveBeenCalledWith(mockData);
    })


    it('should handle errors gracefully', async () => {
        mockExec.mockRejectedValue(new Error('Database Error'));
    
        const req = { params: { id: 'errorId' } };
    
        await expect(read(Model, req, mockRes)).rejects.toThrow('Database Error');

      });

})