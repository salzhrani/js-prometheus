// A port of Matt T. Proud python/ruby Library
// Please refer to https://github.com/matttproud/ruby_quantile_estimation/blob/master/LICENSE for license information


var internals = {};
exports = module.exports = internals.Estimator = function(options){
	options = options || {};
	var quantiles = options.quantiles || {'0.5': 0.05, '0.9': 0.01, '0.99': 0.001};
	var keys = Object.keys(quantiles);
	this._quantiles = [];
	for (var i = 0, l = keys.length; i < l; i++) {
		this._quantiles.push(new Quantile(keys[i], quantiles[keys[i]]));
	}
	this._buffer = [];
	this._head = null;
	this._observations = 0;
	this._sum = 0;
	this._MaxBufferSize = options._MaxBufferSize || 512;
};

var Quantile = function(quantile, inaccuracy) {
	this._quantile = parseFloat(quantile);
	this._inaccuracy = inaccuracy;
	this._coeff1 = (2.0 * inaccuracy) / (1.0 - quantile);
	this._coeff2 = 2.0 * inaccuracy / quantile;
};
Quantile.prototype._delta = function(rank, n) {
	if (rank <= Math.floor(this._quantile * n)) {
		return this._coeff1 * (n - rank);
	} else {
		return this._coeff2 * rank;
	}
};


var Sample = function(value, rank, delta, successor){
	this._value = value;
	this._rank = rank;
	this._delta = delta;
	this._successor = successor;
};


internals.Estimator.prototype._write = function(chunk, enc, next) {

};
internals.Estimator.prototype.observe = function(val){
	this._buffer.push(val);
	if (this._buffer.length >= this._MaxBufferSize) {
		this._flush();
	}
	this._observations++;
	this._sum += val;
};

internals.Estimator.prototype.query = function(rankParam) {

	this._flush();
	var current = this._head;
	if (!current) {
		return 0;
	}
	var midRank = Math.floor(rankParam * this._observations);
	var maxRank = midRank + Math.floor( this._invariant(midRank, this._observations / 2.0));
	var rank = 0;
	while (current._successor) {
		rank += current._rank;
		if (rank + current._successor._rank + current._successor._delta > maxRank) {
			return current._value;
		}
		current = current._successor;
	}
	return current._value;
};

internals.Estimator.prototype._flush = function() {
	if (this._buffer.length) {
		this._buffer.sort();
		this._replace_batch();
		this._buffer = [];
		this._compress();
	}
	
};

internals.Estimator.prototype._replace_batch = function() {
	if (!this._head) {
		this._head = this._record(this._buffer[0], 1, 0, null);
		this._buffer.shift();
	}

	var rank = 0;
	var current = this._head;
	var val;
	for (var i = 0, l = this._buffer.length; i < l; i++) {
		val = this._buffer[i];
		if (val < this._head._value) {
			this._head = this._record(val, 1, 0, this._head);
		}
		while(current._successor && current._value < val){
			rank += current._rank;
			current = current._successor;
		}

		if (!current._successor) {
			current._successor = this._record(val, 1, 0, null);
		}
		current._successor = this._record(val, 1, this._invariant(rank, this._observations) - 1, current._successor);
	}
};

internals.Estimator.prototype._record = function(value, rank, delta, successor) {
	return new Sample(value, rank, delta, successor);
};


internals.Estimator.prototype._invariant = function(rank, n){
	var minimum = n + 1;
	for (var i = this._quantiles.length - 1; i >= 0; i--) {
		var delta = this._quantiles[i]._delta(rank, n);
		if (delta < minimum) {
			minimum = delta;
		}
	}
	return Math.floor(minimum);
};

internals.Estimator.prototype._compress = function() {
	var rank = 0;
	var current = this._head;

	while (current && current._successor) {
		if (current._rank + current._successor._rank + current._successor._delta <=
			this._invariant(rank, this._observations)) {
			var removed = current._successor;
			current._value = removed._value;
			current._rank += removed._rank;
			current._delta = removed._delta;
			current._successor = removed._successor;
		}
		rank += current._rank;
		current = current._successor;
	}
};
