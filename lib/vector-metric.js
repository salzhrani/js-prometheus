var Metric = require('./metric');
var Map = require("collections/map");
var Int64 = require('node-int64');

exports = module.exports = Metric.extend({
 	init: function(obj) {
 		this._map = new Map();
 		var validate = this.validateLabelArray(obj.labels);
 		if (validate.error) {
 			throw validate.error;
 		} else {
 			// store the lables length to make sure
 			// that provided values have the same length
 			this._length = obj.labels.length;
 			this._super(obj);
 		}
 	},
 });