var Joi = require('joi');
var memoize = require('memoizee');

var internals = {};


internals.labelRegex = /^[a-zA-Z_][a-zA-Z0-9_]*/;

internals.isNumber =  function(amt) {
	return Object.prototype.toString.call(amt) === '[object Number]' && amt === +amt;
};


internals.createFQN = memoize(function(name, namespace, subSystem) {
	
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

internals.metricSchema = Joi.object().keys({
	namespace: Joi.string().regex(internals.labelRegex),
	subSystem: Joi.string().regex(internals.labelRegex),
	help: Joi.string(),
	name: Joi.string().regex(internals.labelRegex).required().allow(''),
	type: Joi.string().required()
});

internals.vectorMetricSchema = internals.metricSchema.keys({
	_labels: Joi.array().min(1).includes(Joi.string().regex(internals.labelRegex)),
	constLabels: Joi.object().min(1).pattern(internals.labelRegex, Joi.number()),
}).rename('labels','_labels').nand('labels', 'constLabels');

internals.getHash = function(values) {
	return JSON.stringify(values);
};


exports = module.exports = internals;