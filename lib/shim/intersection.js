'use strict';

const
	{ ispShimExtends } = require('./utils.js');

module.exports = {

	/**
	 * Найти ближайшую точку на прямой
	 *
	 * @param {fabric.Point} point - точка на расстоянии от которой необходимо искать ближ точку на прямой
	 * @param {fabric.Point} lineStartPoint - точка для построения прямой
	 * @param {fabric.Point} lineEndPoint - точка для построения прямой
	 *
	 * @return {fabric.Point}
	 * */
	ispNearestIntersectionPointLine(point, lineStartPoint, lineEndPoint) {
		if (lineEndPoint.x == lineStartPoint.x)
			return new fabric.Point(lineEndPoint.x, point.y);

		if (lineEndPoint.y == lineStartPoint.y)
			return new fabric.Point(point.x, lineEndPoint.y);

		let mAC = (lineEndPoint.y - lineStartPoint.y) / (lineEndPoint.x - lineStartPoint.x),
		    mBD = -1 / mAC,
		    bBD = point.y - mBD * point.x;

		// Пересечение прямой AB с осью Y
		let bAC = this.ispIntersectLineLine(
			new fabric.Point(0, 0),
			new fabric.Point(0, 100),
			lineStartPoint,
			lineEndPoint
		).points[0].y;

		let x = (-bAC + bBD) / (mAC + -mBD),
		    y = mAC * x + bAC;

		return new fabric.Point(x, y);
	},


	/**
	 * Вернуть точку пересечения прямых
	 *
	 * @param {fabric.Point} lineAStartPoint
	 * @param {fabric.Point} lineAEndPoint
	 * @param {fabric.Point} lineBStartPoint
	 * @param {fabric.Point} lineBEndPoint
	 *
	 * @return {fabric.Intersection}
	 * */
	ispIntersectLineLine(
		lineAStartPoint,
		lineAEndPoint,
		lineBStartPoint,
		lineBEndPoint
	) {
		let a,
		    b,
		    numerator1,
		    numerator2,
		    denominator,
		    res = new fabric.Intersection();

		res.lines = {};

		denominator
			= ((lineBEndPoint.y - lineBStartPoint.y) * (lineAEndPoint.x - lineAStartPoint.x))
			- ((lineBEndPoint.x - lineBStartPoint.x) * (lineAEndPoint.y - lineAStartPoint.y));

		if (denominator == 0)
			return res;

		a = lineAStartPoint.y - lineBStartPoint.y;
		b = lineAStartPoint.x - lineBStartPoint.x;

		numerator1
			= ((lineBEndPoint.x - lineBStartPoint.x) * a)
			- ((lineBEndPoint.y - lineBStartPoint.y) * b);

		numerator2
			= ((lineAEndPoint.x - lineAStartPoint.x) * a)
			- ((lineAEndPoint.y - lineAStartPoint.y) * b);

		a = numerator1 / denominator;
		b = numerator2 / denominator;

		res.appendPoint(
			new fabric.Point(
				lineAStartPoint.x + (a * (lineAEndPoint.x - lineAStartPoint.x)),
				lineAStartPoint.y + (a * (lineAEndPoint.y - lineAStartPoint.y))
			)
		);

		if (a > 0 && a < 1)
			res.lines[0] = [lineAStartPoint, lineAEndPoint];

		if (b > 0 && b < 1)
			res.lines[1] = [lineBStartPoint, lineBEndPoint];

		return res;
	},


	init(fabric) {
		ispShimExtends(fabric.Intersection, this);
	}

};