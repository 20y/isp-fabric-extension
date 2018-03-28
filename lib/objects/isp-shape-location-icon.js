'use strict';

const
	fabric = require('./../../index.js').getFabric();

const ISPShapeLocationIcon = fabric.util.createClass(
	fabric.Path,
	{
		initialize(opts) {
			this.callSuper(
				'initialize',
				'M,39.5,35.155 \
				c,-2.37,0,-4.345000000000001,1.975,-4.345000000000001,4.345000000000001 \
				s,1.975,4.345000000000001,4.345000000000001,4.345000000000001 \
				s,4.345000000000001,-1.975,4.345000000000001,-4.345000000000001 \
				S,41.870000000000005,35.155,39.5,35.155 \
				z \
				M,39.5,0 \
				C,17.775000000000002,0,0,17.775000000000002,0,39.5 \
				s,17.775000000000002,39.5,39.5,39.5 \
				s,39.5,-17.775000000000002,39.5,-39.5 \
				S,61.225,0,39.5,0 \
				z \
				M,48.190000000000005,48.190000000000005 \
				L,15.8,63.2 \
				l,15.010000000000002,-32.39 \
				L,63.2,15.8 \
				L,48.190000000000005,48.190000000000005 \
				z',
				opts
			);
		},

		shape: 'isp-shape-location-icon'
	}
);


ISPShapeLocationIcon.fromObject = function(object, callback) {
	return fabric.Object._fromObject('ISPShapeLocationIcon', object, callback);
};


module.exports = ISPShapeLocationIcon;
