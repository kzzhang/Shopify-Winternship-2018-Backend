'use strict'

var request = require('request');
var __ = require('lodash/core');
var baseUrl = 'https://backend-challenge-winter-2017.herokuapp.com/customers.json';

// gets raw page json from shopify site
function fetchPage(index, callback) {
	var url = baseUrl + '?page=' + index;
	request({url: url, encoding: null}, function(error, response, body) {
  		if (error) {
  			throw error;
  		}
  		callback(index, JSON.parse(body.toString()));
	});
}

// parses raw page json to return the highest page index
function findMaxPages(inputPage) {
	// default to 1 since this was the page already requested
	var pages = 1;
	if (__.has(inputPage, 'pagination')) {
		var pagination = inputPage['pagination'];
		if (__.has(pagination, 'per_page') && __.has(pagination, 'total')) {
			var perPage = pagination['per_page'];
			var total = pagination['total'];
			pages = Math.ceil(total / perPage);
		}
	}
	return pages;
}

// parses raw page json to return validations; throws error if not found
function getValidations(inputPage) {
	if (__.has(inputPage, 'validations')) {
		return inputPage['validations'];
	} else {
		throw new Error('No validations found');
	}
}

// prases raw page json to return customers array; returns empty array if not found
function getCustomers(inputPage) {
	if (__.has(inputPage, 'customers')) {
		return inputPage['customers'];
	} else {
		return [];
	}
}

module.exports = {
	fetchPage: fetchPage,
	getMaxPages: findMaxPages,
	getValidations: getValidations,
	getCustomers: getCustomers
};