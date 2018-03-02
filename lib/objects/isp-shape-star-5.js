'use strict';

const
	fabric = require('./../../index.js').getFabric();

const ISPShapeStar5 = fabric.util.createClass(
	fabric.Polygon,
	{
		initialize(opts) {
			this.callSuper(
				'initialize',
				[
					{x:75.01,y:28.55},
					{x:56.26,y:47.62},
					{x:60.68,y:74.61},
					{x:37.5,y:61.83},
					{x:14.32,y:74.53},
					{x:18.75,y:47.56},
					{x:0,y:28.41},
					{x:25.92,y:24.53},
					{x:37.51,y:0},
					{x:49.1,y:24.57}
				],
				opts
			);
		},

		shape: 'isp-shape-star-5'
	}
);


ISPShapeStar5.fromObject = function(object, callback) {
	return fabric.Object._fromObject('ISPShapeStar5', object, callback);
};


module.exports = ISPShapeStar5;
