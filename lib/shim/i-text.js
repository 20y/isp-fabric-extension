'use strict';

module.exports = {

	init(fabric) {
		let _init = fabric.IText.prototype.initialize;

		fabric.util.object.extend(fabric.IText.prototype, {

			initialize(...arg) {
				_init.apply(this, arg);

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
			}

		});
	}

};