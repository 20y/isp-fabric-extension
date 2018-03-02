'use strict';

const
	fabric = require('./../../index.js').getFabric();

const ISPShapeBookmark = fabric.util.createClass(
	fabric.Path,
	{
		initialize(opts) {
			this.callSuper(
				'initialize',
				'M, 61.310869565217395, 0 \
				H, 17.517391304347825 \
				C, 12.700108695652174, 0, 8.758695652173913, 3.941413043478261, 8.758695652173913, 8.758695652173913 \
				v, 70.0695652173913 \
				l, 30.655434782608697, -13.13804347826087 \
				L, 70.0695652173913, 78.82826086956523 \
				V, 8.758695652173913 \
				C, 70.0695652173913, 3.941413043478261, 66.12815217391305, 0, 61.310869565217395, 0 \
				z ',
				opts
			);
		},

		shape: 'isp-shape-bookmark'
	}
);


ISPShapeBookmark.fromObject = function(object, callback) {
	return fabric.Object._fromObject('ISPShapeBookmark', object, callback);
};


module.exports = ISPShapeBookmark;
