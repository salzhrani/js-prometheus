var memoize = require('memoizee');
var Util = require('util');
var Joi = require('joi');

var labelSchema = Joi.array().min(1).includes(Joi.string().regex(/^[a-zA-Z_][a-zA-Z0-9_]*/));
var labelCheck = memoize(function(arr) {
	return Joi.validate(arr, labelSchema);
});
var stub = [
	['a', 'b'],
	['d', 'd'],
	['a', 'b'],
	['f', 'b'],
	['b', 'g'],
	['h', 'b'],
	['a', 'b'],
	['a', 'b'],
];

var t = new Date();
var length = 2;
var val;
for (var i = 50000; i >= 0; i--) {
	val = Joi.validate(stub[8 % i], labelSchema);
}

console.log('not memoized',new Date() - t);
t = new Date();
for (var i = 50000; i >= 0; i--) {
	val = labelCheck(stub[8 % i]);
}
console.log('memoized', new Date() - t);