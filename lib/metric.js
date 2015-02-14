var CoreObject = require('core-object');
var Joi = require('joi');
var memoize = require('memoizee');
var Util = require('util');
var utils = require('./utils');


var internals = {};


exports = module.exports = CoreObject.extend({

	init: function(opts){
		opts = opts || {};
		opts.type = opts.type || 'Metric';
		var res = Joi.validate(opts, utils.metricSchema);
		if (res.error) {
			throw res.error;
		} else {

			this.fqn = utils.createFQN(res.value.name, res.value.namespace, res.value.subSystem);
			var keys = Object.keys(res.value);
			var values = res.value;
			for (var i = 0; i < keys.length; i++) {
				this[keys[i]] = values[keys[i]];
			}
		}
	},
	isNumber: memoize(utils.isNumber)
});