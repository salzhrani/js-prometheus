var Http = require('http');
var Url = require('url');
var internals = {};

exports = module.exports = internals.Client = function(options) {

	if (this.constructor !== internals.Client) {
		throw new Error('Please use new when instantiating the client');
	}
};

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