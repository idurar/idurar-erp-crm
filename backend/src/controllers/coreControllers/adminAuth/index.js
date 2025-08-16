const createAuthMiddleware = require('@/controllers/middlewaresControllers/createAuthMiddleware');

// ADDED THIS LINE - Import register function
const register = require('@/controllers/middlewaresControllers/createAuthMiddleware/register');

module.exports = createAuthMiddleware('Admin');

// ADDED THIS LINE - Export register function
module.exports.register = (req, res) => register(req, res, { userModel: 'Admin' });