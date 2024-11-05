/*
 * http://nodejs.org/api/events.html
 */

function EventEmitter() {}

EventEmitter.prototype.addListener = () => {};
EventEmitter.prototype.on = () => {};
EventEmitter.prototype.once = () => {};
EventEmitter.prototype.removeListener = () => {};
EventEmitter.prototype.removeAllListeners = () => {};
// EventEmitter.prototype.removeAllListeners = function([event])
EventEmitter.prototype.setMaxListeners = () => {};
EventEmitter.prototype.listeners = () => {};
EventEmitter.prototype.emit = () => {};
EventEmitter.prototype.prependListener = () => {};
// EventEmitter.prototype.emit = function(event, [arg1], [arg2], [...]){}

module.exports = EventEmitter;
