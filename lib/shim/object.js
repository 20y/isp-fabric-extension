'use strict';

const
	_size   = require('../interfaces/size.js'),
	_move   = require('../interfaces/move.js'),
	_common = require('../interfaces/common.js'),
	_style  = require('../interfaces/style.js');

module.exports = {

	_drawControl(control, ctx, methodName, left, top, styleOverride) {
		var rotateLeft,
		    rotateTop,
		    wh = this._calculateCurrentDimensions(),
		    width = wh.x,
		    height = wh.y,
		    size = this.cornerSize,
		    style = this.ispCornerStyle[control];

		if (!this.isControlVisible(control))
			return;

		if (style instanceof Image) {
			rotateLeft = left;
			rotateTop = top;

			ctx.beginPath();

			ctx.arc(
				left + size / 2,
				top + size / 2,
				size * 0.75,
				0,
				2 * Math.PI,
				false
			);

			ctx.fill();

			return ctx.drawImage(
				style,
				rotateLeft,
				rotateTop,
				size,
				size
			);
		}

		this._superDrawControl(control, ctx, methodName, left, top, styleOverride);
	},


	init(fabric) {
		fabric.util.object.extend(fabric.Object.prototype, _size);
		fabric.util.object.extend(fabric.Object.prototype, _move);
		fabric.util.object.extend(fabric.Object.prototype, _common);
		fabric.util.object.extend(fabric.Object.prototype, _style);

		if (!fabric.Object.prototype._superDrawControl)
			fabric.Object.prototype._superDrawControl = fabric.Object.prototype._drawControl;

		fabric.Object.prototype._drawControl = this._drawControl;

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
