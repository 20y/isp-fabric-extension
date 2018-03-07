'use strict';

const
	fabric = require('./../../index.js').getFabric(),
	_size = require('../interfaces/size.js');


const ISPFabricPage = fabric.util.createClass(fabric.Rect, Object.assign({}, _size, {

	type: 'ISPFabricPage',


	fill: 'white',

}));


ISPFabricPage.fromObject = function(object, callback) {
	return fabric.Object._fromObject('ISPFabricPage', object, callback);
};


module.exports = ISPFabricPage;