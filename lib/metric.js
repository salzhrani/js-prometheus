var CoreObject = require('core-object');
var Joi = require('joi');


var internals = {};
internals.labelRegex = /^[a-zA-Z_][a-zA-Z0-9_]*/;
internals.schema = Joi.object().keys({
		namespace: Joi.string().regex(internals.labelRegex),
		subSystem: Joi.string().regex(internals.labelRegex),
		help: Joi.string(),
		name: Joi.string().regex(internals.labelRegex).required().allow(''),
		labels: Joi.array().includes(Joi.object().length(1).pattern(internals.labelRegex, Joi.alternatives().try(Joi.number(), Joi.string())))
	});

exports = module.exports = CoreObject.extend({

	init: function(opts){

		var res = Joi.validate(opts || {}, internals.schema);
		if (res.error) {
			throw res.error;
		} else {
			this.fqn = '';
			var values = res.value;
			if (values.name !== '') {
				if ( values.namespace && values.subSystem) {
					this.fqn = [values.namespace, values.subSystem, values.name].join('_');
				} else if (values.namespace) {
					this.fqn = [values.namespace, values.name].join('_');
				} else if (values.subSystem) {
					this.fqn = [values.subSystem, values.name].join('_');
				} else {
					this.fqn = values.name;
				}
			}
			var keys = Object.keys(res.value);

			for (var i = 0; i < keys.length; i++) {
				this[keys[i]] = values[keys[i]];
			}
		}
	}
});