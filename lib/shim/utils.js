'use strict';

module.exports = {

	ispShimExtends(_proto, ..._extends) {
		_proto._ispFabricNativeProps = _proto._ispFabricNativeProps || {};

		_extends.forEach(_extend => {
			Object.keys(_extend).forEach(k => {
				if ('init' == k)
					return;

				if (_proto[k] && _proto[k] != _extend[k])
					_proto._ispFabricNativeProps[k] = _proto[k];

				_proto[k] = _extend[k];
			});
		});
	},


	/**
	 * Рассчитать угол между двумя прямыми (в градусах)
	 *
	 * @param {fabric.Point} lineAStartPoint
	 * @param {fabric.Point} lineAEndPoint
	 * @param {fabric.Point} lineBStartPoint
	 * @param {fabric.Point} lineBEndPoint
	 *
	 * @return {Number} - угол в градусах
	 * */
	ispCalcLinesAngleDeg(
		lineAStartPoint,
		lineAEndPoint,
		lineBStartPoint,
		lineBEndPoint
	) {
		let angle1 = Math.atan2(
			lineAStartPoint.y - lineAEndPoint.y,
			lineAStartPoint.x - lineAEndPoint.x
		);

		let angle2 = Math.atan2(
			lineBStartPoint.y - lineBEndPoint.y,
			lineBStartPoint.x - lineBEndPoint.x
		);

		let angle = angle1 - angle2;

		angle = angle * 180 / Math.PI;

		if (angle < 0)
			angle = -angle;

		if (360 - angle < angle)
			angle = 360 - angle;

		return angle;
	},


	init(fabric) {
		fabric.util.ispCalcLinesAngle = this.ispCalcLinesAngle;
	}

};