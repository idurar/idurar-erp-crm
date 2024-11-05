const util = require('util');
const Stream = require('stream');

function readStart() {}
exports.readStart = readStart;

function readStop() {}
exports.readStop = readStop;

function IncomingMessage() {
    Stream.Readable.call(this);

    this.httpVersionMajor = null;
    this.httpVersionMinor = null;
    this.httpVersion = null;
    this.complete = false;
    this.headers = {};
    this.rawHeaders = [];
    this.trailers = {};
    this.rawTrailers = [];

    this.readable = true;

    this._pendings = [];
    this._pendingIndex = 0;
    this.upgrade = null;

    this.url = '';
    this.method = null;

    this.statusCode = null;
    this.statusMessage = null;

    this._consuming = false;

    this._dumped = false;
}
util.inherits(IncomingMessage, Stream.Readable);

exports.IncomingMessage = IncomingMessage;

IncomingMessage.prototype.read = () => {};
IncomingMessage.prototype._read = () => {};
IncomingMessage.prototype.destroy = () => {};

IncomingMessage.prototype.setTimeout = function setTimeout(msecs, callback) {
    if (callback) {
        setTimeout(callback, msecs);
    }
};

IncomingMessage.prototype._addHeaderLines = function _addHeaderLines(headers, n) {
    if (headers && headers.length) {
        let raw;
        let dest;
        if (this.complete) {
            raw = this.rawTrailers;
            dest = this.trailers;
        } else {
            raw = this.rawHeaders;
            dest = this.headers;
        }

        for (let i = 0; i < n; i += 2) {
            const k = headers[i];
            const v = headers[i + 1];
            raw.push(k);
            raw.push(v);
            this._addHeaderLine(k, v, dest);
        }
    }
};

IncomingMessage.prototype._addHeaderLine = function _addHeaderLine(field, value, dest) {
    const fieldName = field.toLowerCase();
    switch (fieldName) {
        // Array headers:
        case 'set-cookie':
            if (!util.isUndefined(dest[fieldName])) {
                // eslint-disable-next-line no-param-reassign
                dest[fieldName].push(value);
            } else {
                // eslint-disable-next-line no-param-reassign
                dest[fieldName] = [value];
            }
            break;

        case 'content-type':
        case 'content-length':
        case 'user-agent':
        case 'referer':
        case 'host':
        case 'authorization':
        case 'proxy-authorization':
        case 'if-modified-since':
        case 'if-unmodified-since':
        case 'from':
        case 'location':
        case 'max-forwards':
            if (util.isUndefined(dest[fieldName])) {
                // eslint-disable-next-line no-param-reassign
                dest[fieldName] = value;
            }
            break;

        default:
            if (!util.isUndefined(dest[fieldName])) {
                // eslint-disable-next-line no-param-reassign
                dest[fieldName] += `, ${value}`;
            } else {
                // eslint-disable-next-line no-param-reassign
                dest[fieldName] = value;
            }
    }
};

IncomingMessage.prototype._dump = function _dump() {
    if (!this._dumped) {
        this._dumped = true;
    }
};
