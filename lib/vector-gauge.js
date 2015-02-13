var VectorMetric = require('./vector-metric');
var Map = require("collections/map");
var Int64 = require('node-int64');
var Joi = require('joi');

exports = module.exports = VectorMetric.extend({
 	incLabel: function(label) {
 	 	this.addLabel(label, 1);
 	},
 	incOrCreateLabel: function(label) {
 		this.addOrCreateLabel(label, 1);
 	},
 	decLabel: function(label){
 		this.addLabel(label, -1);
 	},
 	getLabel: function(label){
 		
 		if (this.labelCheck(label, this._length)) {
 			var addLabel = this.addLabel;
 			var setLabel = this.setLabel;
 			return {
 				inc : function(){
 					addLabel(label, 1);
 				},
 				dec : function(){
 					addLabel(label, -1);
 				},
 				add: function(amt) {
 					addLabel(label, amt);
 				},
 				set: function(val) {
 					setLabel(val);
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
 		var item = this._map.get(label);
 		if (item === undefined) {
 			throw new Error('Label not found');
 		} else {
 			item.add(amt);
 			// this._map.set(label, item.add(amt));
 		}
 	},
 	setLabel : function(label, val) {

 		if (!this.isNumber(val)) {
 			throw new Error('Invalid value to add');
 		}
 		var item = this._map.get(label);
 		if (item === undefined) {
 			throw new Error('Label not found');
 		} else {
 			this._map.set(label, new Int64(val));
 		}
 	},
 	addOrCreateLabel: function(label, amt) {

 		if (this.labelCheck(label, this._length)) {
 			throw new Error('invalid label');
 		}

 		if (!this.isNumber(amt)) {
 			throw new Error('Invalid value to add');
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
 	},
 	setOrCreateLabel: function(label, amt) {

 		if (this.labelCheck(label, this._length)) {
 			throw new Error('invalid label');
 		}

 		if (!this.isNumber(amt)) {
 			throw new Error('Invalid value to add');
 		}
 		
 		if (this.labelCheck(label)) {
 			this._map.get(label, new Int64(amt));
 		} else {
			throw new Error('invalid label');
		}	
 	}
});