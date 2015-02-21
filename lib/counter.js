var Metric = require('./metric');
var Int64 = require('node-int64');
var zero = new Int64(0);
var through2 = require('through2');

exports = module.exports = Metric.extend({
	init: function( obj ){
		obj.type = 'counter';
		this._super(obj);
		this.val = new Int64(0);
	},
	add: function( num ) {

		if (!this.isNumber(num)) {

			throw new Error('Invalid amount');
		}

		if (num < 0) {
			throw new Error('Cannot decrease the value of a counter');
		}
		this.val += num;
		this.stream.write(this.val.toString());
	},
	inc: function() {
		this.add(1);
	}
});