'use strict';

const
	{ ispShimExtends } = require('./utils.js');

module.exports = {

	initialize(...arg) {
		arg.unshift('initialize');

		this.ispCallNative.apply(this, arg);

		this._ispApplyEvents();
	},


	_ispApplyEvents() {
		this.on('scaling', this._ispOnScaling);
	},


	_ispOnScaling() {
		this.fontSize *= this.scaleY;

		this.width *= this.scaleX;
		this.height *= this.scaleY;

		this.scaleX = this.scaleY = 1;
	},


	init(fabric) {
		ispShimExtends(fabric.IText.prototype, this);
	}

};