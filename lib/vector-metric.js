var Metric = require('./metric');
var Map = require("collections/map");
var Int64 = require('node-int64');
var Joi = require('joi');
var Util = require('util');
var utils = require('./utils');
var memoize = require('memoizee');

var labels = [];

exports = module.exports = Metric.extend({
 	init: function(opts) {
 		
 		opts = opts || {};
		opts.type = opts.type || 'Metric';
		var res = Joi.validate(opts, utils.vectorMetricSchema);
		if (res.error) {
			throw res.error;
		} else {
			this._const = !!res.value.constLabels;
			this._length = (res.value.labels || res.value.constLabels ).length;
			this.fqn = utils.createFQN(res.value.name, res.value.namespace, res.value.subSystem);
			var keys = Object.keys(res.value);
			var values = res.value;
			for (var i = 0; i < keys.length; i++) {
				this[keys[i]] = values[keys[i]];
			}
			this.isVector = true;
			this.stream = through2.obj();
			this.stream.setEncoding('ascii');
		}
 	},
 	labelCheck: function(labels) {
 		return Util.isArray(labels) && labels.length === this._length;
 	},
 	validateLabelArray: memoize(utils.validateLabelArray),
 	getLabel : function(label) {

 	}
 });