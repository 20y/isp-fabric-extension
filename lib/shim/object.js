'use strict';

const
	_size   = require('../methods/size.js'),
	_move   = require('../methods/move.js'),
	_common = require('../methods/common.js');

module.exports = {

	init(fabric) {
		fabric.util.object.extend(fabric.Object.prototype, _size);
		fabric.util.object.extend(fabric.Object.prototype, _move);
		fabric.util.object.extend(fabric.Object.prototype, _common);

		fabric.Object.prototype._renderStroke = function(ctx) {
			if (!this.stroke || this.strokeWidth === 0)
				return;

			if (this.shadow && !this.shadow.affectStroke)
				this._removeShadow(ctx);

			ctx.save();
			ctx.scale(1 / this.scaleX, 1 / this.scaleY);

			this._setLineDash(ctx, this.strokeDashArray, this._renderDashedStroke);
			this._applyPatternGradientTransform(ctx, this.stroke);

			ctx.stroke();

			ctx.restore();
		};

		fabric.Object.prototype.originX = 'center';
		fabric.Object.prototype.originY = 'center';

		fabric.Object.NUM_FRACTION_DIGITS = 8;
	}

};