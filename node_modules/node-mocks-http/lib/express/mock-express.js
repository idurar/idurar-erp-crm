const { EventEmitter } = require('events');

const mixin = require('merge-descriptors');

const application = require('./mock-application');
const request = require('./mock-request');
const response = require('../mockResponse');

const expressResponse = {
    createResponse: response.createResponse
};

function createApplication() {
    const app = function () {};

    mixin(app, EventEmitter.prototype, false);
    mixin(app, application, false);

    app.request = {
        __proto__: request,
        app
    };
    app.response = {
        __proto__: expressResponse.createResponse(),
        app
    };
    app.init();
    return app;
}

module.exports = createApplication;

module.exports.application = application;
module.exports.request = request;
module.exports.response = expressResponse;
