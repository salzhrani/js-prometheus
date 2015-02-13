var Transform = require('stream').Writeable;
var Util = require('util');
var Estimator = require('./estimator');

var internals = {};
exports = module.exports = internals.ObservationStream = function(options){
	this.fqn = fqn;
	this.estimator = new Estimator();
	Writeable.call(this, options);
};


Util.inherits(internals.ObservationStream, Writeable); 

internals.ObservationStream.prototype._write = function(chunk, enc, next) {

};