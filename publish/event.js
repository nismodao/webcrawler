var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var PubSub = function () {
};

util.inherits(PubSub, EventEmitter);

PubSub.prototype.send = function (value) {
  this.emit('url', value);
}

PubSub.prototype.subscribe = function (cb) {
  this.on('url', cb);
}

var pubsub = new PubSub();

module.exports = pubsub;

