/*
 * http://nodejs.org/api/stream.html#stream_writable_stream
 */

function WritableStream() {}

Object.defineProperty(WritableStream, 'writable', {
    configurable: true,
    enumerable: true,
    get() {
        return true;
    }
});

// WritableStream.prototype.write = function(string, [encoding], [fd]){}
// WritableStream.prototype.write = function(buffer){}
WritableStream.prototype.end = () => {};
// WritableStream.prototype.end = function(string, encoding){}
// WritableStream.prototype.end = function(buffer){}
WritableStream.prototype.destroy = () => {};
WritableStream.prototype.destroySoon = () => {};

module.exports = WritableStream;
