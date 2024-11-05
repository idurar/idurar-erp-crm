/**
 * Module: http-mock
 *
 *   The interface for this entire module that just exposes the exported
 *   functions from the other libraries.
 */

const request = require('./mockRequest');
const response = require('./mockResponse');
const express = require('./express/mock-express');

/**
 * Creates linked req and res objects. Enables using methods that require both
 * objects to interact, for example res.format.
 *
 * @param  {Object} reqOpts Options for req creation, see
 *                          @mockRequest.createRequest
 * @param  {Object} resOpts Options for res creation, see
 *                          @mockResponse.createResponse
 * @return {Object}         Object with both mocks: { req, res }
 */
const createRequestResponse = function (reqOpts, resOpts) {
    const req = request.createRequest(reqOpts);
    const res = response.createResponse({ ...resOpts, req });

    return { req, res };
};

exports.createRequest = request.createRequest;
exports.createResponse = response.createResponse;
exports.createMocks = createRequestResponse;
exports.express = express;
