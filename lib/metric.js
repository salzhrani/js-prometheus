var CoreObject = require('core-object');
var Joi = require('joi');


var internals = {};
internals.labelRegex = /^[a-zA-Z_][a-zA-Z0-9_]/;
internals.schema = Joi.object().keys({
		namespace: Joi.string().regex(internals.labelRegex),
		subSystem: Joi.string().regex(internals.labelRegex),
		name: Joi.string().regex(internals.labelRegex).required().allow(''),
	});

exports = module.exports = CoreObject.extend({
	init: function(opts){
		var res = Joi.validate(opts || {}, internals.schema);
		console.log('res', res);
		if (res.error) {
			throw res.error;
		} else {
			this.fqn = '';
			if (res.value.name !== '') {
				if (res.value.namespace !== '' && res.value.subSystem !== '') {
					this.fqn = [res.value.namespace, res.value.subSystem, res.value.name].join('_');
				} else if (res.value.namespace !== '') {
					this.fqn = [res.value.namespace, res.value.name].join('_');
				} else if (res.value.subSystem !== '') {
					this.fqn = [res.value.subSystem, res.value.name].join('_');
				}
			}
			this._super(res.value);
		}
	}
});