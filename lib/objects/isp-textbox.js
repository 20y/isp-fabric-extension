'use strict';

const
	fabric = require('./../../index.js').getFabric();

const ISPTextbox = fabric.util.createClass(
	fabric.Textbox,
	{
		initialize(...args) {
			args.unshift('initialize');

			this.callSuper.apply(this, args);

			this.setControlsVisibility({
				mt: false,
				mb: false
			});
		}
	}
);


ISPTextbox.fromObject = function(object, callback) {
	return fabric.Object._fromObject('ISPTextbox', object, callback, 'text');
};


module.exports = ISPTextbox;
