var Metric = require('./metric');
var Map = require("collections/map");
var Int64 = require('node-int64');
var Joi = require('joi');

var labelSchema = Joi.array(Joi.string().regex(/^[a-zA-Z_][a-zA-Z0-9_]*/)).min(1);

exports = module.exports = Metric.extend({
 	init: function(obj) {
 		this._map = new Map();
 		obj.labels = obj.labels || []; // force validation to fail if undefined
 		this._length = obj.labels.length;
 		this._super(obj);
 	},
 	incLabel: function(label) {
 		if (this.labelCheck(label, this._length)) {
 			this.addLabel(label, 1);
 		} else {
 			throw new Error('invalid label');
 		}
 	},
 	incOrCreateLabel: function(label) {
 		if (this.labelCheck(label, this._length)) {
 			this.addOrCreateLabel(label, 1);
 		} else {
 			throw new Error('invalid label');
 		}
 	},
 	getLabel: function(label){
 		
 		if (this.labelCheck(label, this._length)) {
 			return {
 				inc : function(){
 					this.addLabel(label, 1);
 				},
 				add: function(amt) {
 					this.addLabel(label, amt);

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
 			this._map.set(label, item.add(amt));
 		}
 	},
 	addOrCreateLabel: function(label, amt) {

 		if (this.labelCheck(label, this._length)) {
 			throw new Error('invalid label');
 		}

 		if (!this.isNumber(amt)) {
 			throw new Error('Invalid value to add');
 		}
 		if (amt < 0) {
 			throw new Error('Cannot decrease the value of a counter');
 		}
 		
 		var validate = this.isValidLabelArray(label);
 		if (validate.err) {
 			throw err;
 		}
 		var item = this._map.get(label) || new Int64(0);
 		this._map.set(label, item.add(amt));
 	},

});