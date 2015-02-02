var Metric = require('./metric');
var Int64 = require('int64-native');

exports = module.exports = Metric.extend({
	init: function( obj ){
		this.int64 = new Int64(obj.value || 0);
		delete obj.value;
		this._super(obj);
	},
	add: function( num ) {
		if (Int64(0).compare(num) < 0) {
			throw new Error('Cannot decrease the value of a counter');
		}
		this.int64.add( Int64(num) );
	},
	inc: function() {
		this.int64.add(1);
	}
});