'use strict'

var pageUtils = require('./page_utils.js');
var fs = require('fs');
var customer = require('./customer.js');
var __ = require('lodash/core');

var destination = './output.json';
var count = 0;
var maxPages = undefined;
var invalidCustomers = {};
var output = {
	'invalid_customers': []
}

function generateOutput() {
	pageUtils.fetchPage(1, function(temp, page) {
		maxPages = pageUtils.getMaxPages(page);

		for (var i = 1; i <= maxPages; i++) {
			pageUtils.fetchPage(i.toString(), function(index, retrievedPage){
				parsePage(index, retrievedPage);
			});
		}
	});
}

// Parse an individual page for invalid customers and populate the according property in invalidCustomers object
function parsePage(index, page) {
	var validations = pageUtils.getValidations(page);
	var customers = pageUtils.getCustomers(page);

	customers.forEach(function(personJson) {
		var person = new customer(personJson);
		var parsedOutput = person.validate(validations);
		if (Object.keys(parsedOutput).length > 0) {
			if (!__.has(invalidCustomers, index)) {
				invalidCustomers[index] = [];
			}
			invalidCustomers[index].push(parsedOutput);
		}
	});

	count++;

	if (count == maxPages) {
		print();
	}
}

// Prints combined output, in order, from invalidCustomers object
function print() {
	for (var i = 1; i <= maxPages; i++) {
		var object = invalidCustomers[i];
		if (object != undefined) {
			for (var j = 0; j < object.length; j++) {
				output['invalid_customers'].push(object[j]);
			}
		}
	}
	fs.writeFile(destination, JSON.stringify(output), 'utf8', function() {
			console.log("Write done.");
	});
}

generateOutput();