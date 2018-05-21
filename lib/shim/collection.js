'use strict';

const
	{ ispShimExtends } = require('./utils.js');

const _extends = {
	collection: require('./../interfaces/collection.js')
};


module.exports = {

	init(fabric) {
		ispShimExtends(fabric.Collection, _extends.collection);
	}

};