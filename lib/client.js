var Http = require('http');
var Url = require('url');
var Metric = require('./metric');
var VectorMetric = require('./vector-metric');
var internals = {};
var Map = require('collections/map');



exports = module.exports = internals.Client = function(options) {

	if (this.constructor !== internals.Client) {
		throw new Error('Please use new when instantiating the client');
	}
};

internals.map = new Map();

// constants 
internals.Client.prototype.APIVersion = '0.0.4';
internals.Client.prototype.TextTelemetryContentType = 'text/plain; version=' + internals.Client.prototype.APIVersion;
internals.Client.prototype.MaxAge = 10 * 60 * 60;
internals.Client.prototype.CacheSize = 500;

internals.Client.prototype.connect = function(options) {

	this.options = options || {}; //TODO: validation
	if (this.listener) {
		return;
	}
	this.listener = Http.createServer();
	this.listener.on('request', this._handleRequest);
	this.listener.listen( options.port || 8080);
};

internals.Client.prototype._handleRequest = function(request, response) {


	if (Url.parse(request.url).pathname === '/metrics') {
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end('Hello World\n');
	} else {
		response.writeHead(404);
		response.end();
	}
	
};

internals.Client.prototype.addMetric = function(metric) {
	if (!(metric instanceof Metric) && !(metric instanceof VectorMetric)) {
		throw new Error('unknown Metric, please use an object that is an instace of Client.Metric or Client.VectorMetric');
	}
	var key = {fqn: metric.fqn};
	if (metric.constLabels) {
		key.constLabels = metric.constLabels;
	}
	// var record = internals.map.get(key);
	// if (!record) {
	// 	record = [];
	// 	internals.map.set(key, record);
	// }

	metric.stream.on('readable', function(){
		var val = metric.stream.read();
		if (val) {
			console.log('adding',val, 'to', key);
			internals.map.set(key, [val]);
			console.log(internals.map.get(key));
		}
	});

};