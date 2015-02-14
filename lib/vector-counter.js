var Metric = require('./metric');
var Map = require("collections/map");
var Int64 = require('node-int64');
var VectorMetric = require('./vector-metric');

exports = module.exports = VectorMetric.extend({
 	incLabel: function(label) {
 		this.addLabel(label, 1);
 	},
 	incOrCreateLabel: function(label) {
 		this.addOrCreateLabel(label, 1);
 	},
 	getLabel: function(label){
 		
 		if (this.labelCheck(label)) {
 			var addLabel = this.addLabel;
 			return {
 				inc : function(){
 					addLabel(label, 1);
 				},
 				add: function(amt) {
 					addLabel(label, amt);
 				}
 			};
 		} else {
 			throw new Error('invalid label');
 		}
 	},
 	addLabel : function(label, amt) {

 		if (!this.isNumber(amt)) {
 			throw new Error('Invalid value to add');
 		}
 		if (amt < 0) {
 			throw new Error('Cannot decrease the value of a counter');
 		}
 		var item = this._map.get(label);
 		if (item === undefined) {
 			throw new Error('Label not found');
 		} else {
 			item.add(amt);
 			// this._map.set(label, item.add(amt));
 		}
 	},
 	addOrCreateLabel: function(label, amt) {

 		if (this.labelCheck(label)) {
 			throw new Error('invalid label');
 		}

 		if (!this.isNumber(amt)) {
 			throw new Error('Invalid value to add');
 		}
 		if (amt < 0) {
 			throw new Error('Cannot decrease the value of a counter');
 		}
 		
 		if (this.labelCheck(label)) {
 			var item = this._map.get(label);
 			if (item === undefined) {
 				item = new Int64(0);
 				this._map.set(label, item);
 			}
 			item.add(amt);
 		} else {
			throw new Error('invalid label');
		}	
 	}
});