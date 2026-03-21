const mongoose = require('mongoose');
const moment = require('moment');
const Invoice = require('../../../models/appModels/Invoice')
const summary = require('../../../controllers/appControllers/clientController/summary');



jest.mock('moment', () => () => ({
  clone: jest.fn().mockReturnThis(),
  startOf: jest.fn().mockReturnThis(),
  endOf: jest.fn().mockReturnThis(),
  toDate: jest.fn(),
}));

describe('summary function', () => {
  let mockReq;
  let mockRes;
  let mockAggregate;

  beforeEach(() => {
    mockReq = { query: {} };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockAggregate = jest.fn();


    const Model = {
        aggregate: mockAggregate.mockResolvedValue([{
            totalClients: [{ count: 10 }],
            newClients: [{ count: 3 }],
            activeClients: [{ count: 5 }],
          }])
    }
    
    global.Model = Model;
  });
  

  it('should successfully return summary for the default type (month)', async () => {
    const mockAggregationResult = [{
      totalClients: [{ count: 10 }],
      newClients: [{ count: 3 }],
      activeClients: [{ count: 5 }],
    }];

    mockAggregate.mockResolvedValue(mockAggregationResult);

    await summary(Model, mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      result: {
        new: 30, // 3 new clients out of 10, rounded to 30%
        active: 50, // 5 active clients out of 10, rounded to 50%
      },
      message: 'Successfully get summary of new clients',
    }));
  });

  it('should handle invalid summary type by returning 400 status', async () => {
    mockReq.query.type = 'invalidType';

    await summary(Model, mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      result: null,
      message: 'Invalid type',
    });
  });

});
