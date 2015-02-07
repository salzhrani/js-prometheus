var CoreObject = require('core-object');
var Joi = require('joi');
var memoize = require('memoizee');
var Util = require('util');

var internals = {};
internals.labelRegex = /^[a-zA-Z_][a-zA-Z0-9_]*/;
internals.labelCheck = function(labels, length) {
	return Util.isArray(labels) && labels.length === length;
};
internals.isNumber =  function(amt) {
	return Object.prototype.toString.call(amt) === '[object Number]' && amt === +amt;
};
internals.isValidLabelArray = function(arr) {
	return Joi.validate(arr, Joi.array().min(1).includes(Joi.string().regex(internals.labelRegex)));
};

internals.schema = Joi.object().keys({
	namespace: Joi.string().regex(internals.labelRegex),
	subSystem: Joi.string().regex(internals.labelRegex),
	help: Joi.string(),
	name: Joi.string().regex(internals.labelRegex).required().allow(''),
	labels: Joi.array().min(1).includes(Joi.string().regex(internals.labelRegex)),
	constLabels: Joi.object().min(1).pattern(internals.labelRegex, Joi.alternatives().try(Joi.number(), Joi.string())),
	type: Joi.string().required()
}).nand('labels', 'constLabels');

internals._createFQN = memoize(function(name, namespace, subSystem) {
	
	// namespace = namespace || '';
	// subSystem = subSystem || '';

	var rval = '';
	if (name !== '') {
		if ( namespace && subSystem) {
			
			rval = [namespace, subSystem, name].join('_');
		} else if (namespace) {

			rval = [namespace, name].join('_');
		} else if (subSystem) {

			rval = [subSystem, name].join('_');
		} else {

			rval = name;
		}
	}
	return rval;
});

exports = module.exports = CoreObject.extend({

	init: function(opts){

		var res = Joi.validate(opts || {}, internals.schema);
		if (res.error) {
			throw res.error;
		} else {

			this.fqn = internals._createFQN(res.value.name, res.value.namespace, res.value.subSystem);

			var keys = Object.keys(res.value);
			var values = res.value;
			for (var i = 0; i < keys.length; i++) {
				this[keys[i]] = values[keys[i]];
			}
		}
	},
	labelCheck: function(labels, length) {
		return Util.isArray(labels) && labels.length === length;
	},
	isNumber: memoize(internals.isNumber),
	isValidLabelArray: memoize(internals.isValidLabelArray)
});