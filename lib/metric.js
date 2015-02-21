var CoreObject = require('core-object');
var Joi = require('joi');
var Util = require('util');
var through2 = require('through2');
var utils = require('./utils');

var internals = {};


exports = module.exports = CoreObject.extend({

	init: function(opts){
		opts = opts || {};
		opts.type = opts.type || 'Metric';
		var res;
		if (opts.labels || opts.constLabels) {
			res = Joi.validate(opts, utils.vectorMetricSchema);
			if (opts.labels) {
				this.isVector = true;
			} else {
				this.isVector = false;
			}
		} else {
			res = Joi.validate(opts, utils.metricSchema);
			this.isVector = false;
		}
		if (res.error) {
			throw res.error;
		} else {

			this.fqn = utils.createFQN(res.value.name, res.value.namespace, res.value.subSystem);
			var keys = Object.keys(res.value);
			var values = res.value;
			for (var i = 0; i < keys.length; i++) {
				this[keys[i]] = values[keys[i]];
			}
			if (this.isVector) {
				this._const = !!res.value.constLabels;
				this._length = (res.value._labels || res.value.constLabels ).length;
				this.stream = through2.obj();
			} else {
				this.stream = through2();
				this.stream.setEncoding('ascii');
			}
			
			
		}
	},
	labelCheck: function(labels) {
		return Util.isArray(labels) && labels.length === this._length;
	}
});