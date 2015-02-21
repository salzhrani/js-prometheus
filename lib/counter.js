var Metric = require('./metric');
var utils = require('./utils');
var Map = require('collections/map');

var counters = {};

exports = module.exports = Metric.extend({
	init: function( obj ){
		obj.type = 'counter';
		this._super(obj);
		if (this.isVector) {
			var mapKey = utils.getHash(this.labels);
			if (counters[mapKey]) {
				this.map = counters[mapKey];
			} else {

			}
			this.map = counters[mapKey] = {};
		} else {
			this.val = 0;
		}
	},
	checkValue: function( val ) {
		return utils.isNumber(val) && val > 0;
	},
	add: function( num ) {

		if (this.isVector) {
			throw new Error('Unspeicied label values');
		}

		if (!this.checkValue(num)) {
			throw new Error('invalid amount');
		}

		this.val += num;
		this.stream.write(this.val.toString());
	},

	inc: function() {
		if (this.isVector) {
			throw new Error('Unspeicied label values');
		}
		this.add(1);
	},

	labels : function(labelValues){
		if (!this.labelCheck(labelValues)) {
			throw new Error('Invalid label values');
		}
		var key = utils.getHash(labelValues);
		var item = this.map[key];
		if (!item) {
			item = 0;
		}
		var metric = this;
		return {
			inc : function(){
				var val = item + 1;
				metric.map[key] = val;
				metric.stream.write({key: key, value: val});
			},
			add: function(amt) {
				if (metric.checkValue(amt)) {
					var val = item + amt;
					metric.map[key] = val;
					metric.stream.write({key: key, value: val});
				} else {
					throw new Error('Invalid amount');
				}
			}
		};
	},
});