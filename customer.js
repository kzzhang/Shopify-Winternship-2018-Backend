'use strict';

var __ = require('lodash/core');

module.exports = class customer {
	constructor(argMap) {
		for (var key in argMap) {
			this[key] = argMap[key];
		}
	}

	// Check if customer is valid or not
	// Returns empty object if valid, otherwise, returns invalid object in form of: {
	//     'id': '',
	//     'invalid_fields': []
	//}
	validate(argMap) {
		var invalidFields = [];

		for (var i = 0; i<argMap.length; i++) {
			var ruleObject = argMap[i];

			// get field name
			for (var key in ruleObject) {
				var rule = ruleObject[key];

				var required = false;
				var type = undefined;
				var length = {
					'min': undefined,
					'max': undefined
				}

				if (__.has(rule, 'required')) {
					required = rule['required'];
				}
				if (__.has(rule, 'type')) {
					type = rule['type'];
				}
				if (__.has(rule, 'length')) {
					var ruleLength = rule['length'];
					if (__.has(length, 'min')) {
						length['min'] = ruleLength['min'];
					}
					if (__.has(length, 'max')) {
						length['max'] = ruleLength['max'];
					}
				}

				// Check if required field is present
				if (required && !__.has(this, key)) {
					invalidFields.push(key);
				} else if (__.has(this, key)) {
					// If present, check for correct type
					var field = this[key];
					if (field != null && field != undefined) {
						if (type != undefined && typeof(field) != type) {
							invalidFields.push(key);
						} else if (length['min'] != undefined || length['max'] != undefined) {
							// If present, check for correct length
							if (typeof(length['min'])=='number' && field.length < length['min']) {
								invalidFields.push(key);
							} else if (typeof(length['max'])=='number' && field.length > length['max']) {
								invalidFields.push(key);
							}
						}
					} else if (field == null) {
						invalidFields.push(key);
					}
				}
			}
		}

		if (invalidFields.length > 0) {
			return {
				'id': this.id,
				'invalid_fields': invalidFields
			};
		} 
		return {};
	}
}