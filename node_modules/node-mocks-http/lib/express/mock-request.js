const accepts = require('accepts');
const typeis = require('type-is');
const parseRange = require('range-parser');
const parse = require('parseurl');
const { isIP } = require('net');
const fresh = require('fresh');

const http = require('http');
const defineGetter = require('./utils/define-getter');

const req = {
    __proto__: http.IncomingMessage.prototype
};

req.header = function header(name) {
    const headerName = name.toLowerCase();
    switch (headerName) {
        case 'referer':
        case 'referrer':
            return this.headers.referrer || this.headers.referer;
        default:
            return this.headers[headerName];
    }
};

req.get = req.header;

req.accepts = function acceptTypes(...args) {
    const accept = accepts(this);
    return accept.types(...args);
};

req.acceptsEncodings = function acceptsEncodings(...args) {
    const accept = accepts(this);
    return accept.encodings(...args);
};

req.acceptsEncoding = req.acceptsEncodings;

req.acceptsCharsets = function acceptsCharsets(...args) {
    const accept = accepts(this);
    return accept.charsets(...args);
};

req.acceptsCharset = req.acceptsCharsets;

req.acceptsLanguages = function acceptsLanguages(...args) {
    const accept = accepts(this);
    return accept.languages(...args);
};

req.acceptsLanguage = req.acceptsLanguages;

req.range = function getRange(size) {
    const range = this.get('Range');
    if (!range) {
        return undefined;
    }
    return parseRange(size, range);
};

req.param = function param(name, defaultValue) {
    const params = this.params || {};
    const body = this.body || {};
    const query = this.query || {};

    if (params[name] !== null && {}.hasOwnProperty.call(params, name)) {
        return params[name];
    }
    if (body[name] !== null) {
        return body[name];
    }
    if (query[name] !== null) {
        return query[name];
    }

    return defaultValue;
};

req.is = function is(...args) {
    let types = args;

    if (Array.isArray(args[0])) {
        types = args[0];
    }

    return typeis(this, types);
};

defineGetter(req, 'protocol', function protocol() {
    let { proto } = this.options;
    proto = this.get('X-Forwarded-Proto') || proto;
    return proto.split(/\s*,\s*/)[0];
});

defineGetter(req, 'secure', function secure() {
    return this.protocol === 'https';
});

defineGetter(req, 'ip', function ip() {
    return this.options.ip || '127.0.0.1';
});

defineGetter(req, 'ips', function ips() {
    return [this.ip];
});

defineGetter(req, 'subdomains', function subdomains() {
    const { hostname } = this;

    if (!hostname) {
        return [];
    }

    const offset = this.app.get('subdomain offset');
    const domains = !isIP(hostname) ? hostname.split('.').reverse() : [hostname];

    return domains.slice(offset);
});

defineGetter(req, 'path', function path() {
    return parse(this).pathname;
});

defineGetter(req, 'hostname', function hostname() {
    let host = this.get('X-Forwarded-Host');

    if (!host) {
        host = this.get('Host');
    }

    if (!host) {
        return undefined;
    }

    const offset = host[0] === '[' ? host.indexOf(']') + 1 : 0;
    const index = host.indexOf(':', offset);

    return index < 0 ? host.substring(0, index) : host;
});

defineGetter(req, 'host', function host() {
    return this.hostname;
});

defineGetter(req, 'fresh', function isFresh() {
    const { method } = this;
    const { statusCode } = this.res;

    if (method !== 'GET' && method !== 'HEAD') {
        return false;
    }

    if ((statusCode >= 200 && statusCode < 300) || statusCode === 304) {
        return fresh(this.headers, this.res._headers || {});
    }

    return false;
});

defineGetter(req, 'stale', function stale() {
    return !this.fresh;
});

defineGetter(req, 'xhr', function xhr() {
    const val = this.get('X-Requested-With') || '';
    return val.toLowerCase() === 'xmlhttprequest';
});

module.exports = req;
