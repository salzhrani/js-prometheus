var Metric = require('./metric');
var Int64 = require('node-int64');

exports = module.exports = Metric.extend({

	init: function( obj ){

		this.val = new Int64(0);
		this._super(obj);
	},
	set: function( num ) {

		if (!this.isNumber(num)) {
			throw new Error('Invalid value to add');
		}
		this.val = new Int64(num);
	},
	add: function( num ) {

		if (!this.isNumber(num) && !(num instanceof Int64)) {
			throw new Error('Invalid value to add');
		}
		this.val += num;
	},
	sub: function( num ) {

		this.add(num * -1);
	},
	inc: function() {

		this.add(1);
	},
	dec: function() {

		this.add(-1);
	}
});