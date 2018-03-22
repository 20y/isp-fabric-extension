'use strict';

const
	defVertex = ['tl', 'tr', 'bl', 'br', 'c'],
	fabric = require('./../../index.js').getFabric();

const
	_ = {
		debounce: require('lodash/debounce'),
		get: require('lodash/get')
	},

	{ coordsOrigin } = require('./../consts.js');


module.exports = {


	_getSnapBoxModCoords(opt) {
		let coords = 'bounding-box' == opt.boxModel
			? this.ispGetBoundingRectCoords(1, 1)
			: this.calcCoords(1, 1);

		return Object.assign({ c: this.getCenterPoint() }, coords);
	},


	/**
	 * Рассчитать прилипание объекта в линии
	 *
	 * @param {fabric.Point} lineStartPoint
	 * @param {fabric.Point} lineEndPoint
	 * @param {Object} opt
	 * @param opt.vertex - точки-вершины на которые приходится прилипание
	 *
	 * @return {Object} - { point, vertex }
	 * */
	ispCalcSnapToLine(lineStartPoint, lineEndPoint, opt = {}) {
		let c,
		    point,
		    intersectPoint,     // точка прилипания
		    nearestIPoint,      // ближайшая точка прилипания
		    nearestAPoint,      // ближайшая к линии собственная точка (прилипающая)
		    nearestAPointName,
		    pointDistance,      // расстояние между собственной точкой и точкой прилипания
		    nearestDistance,    // ближайшее расстояние ...
		    vertex = opt.vertex,
		    coords = this._getSnapBoxModCoords(opt);

		vertex = vertex || defVertex;

		for (c = 0; c < vertex.length; c++) {
			point = coords[vertex[c]];

			intersectPoint = fabric.Intersection.ispNearestIntersectionPointLine(point, lineStartPoint, lineEndPoint);
			pointDistance = point.distanceFrom(intersectPoint);

			if (!pointDistance) {
				nearestIPoint = intersectPoint;
				nearestAPoint = point;
				nearestAPointName = vertex[c];

				break;
			}

			if (!nearestIPoint) {
				nearestIPoint = intersectPoint;
				nearestAPoint = point;
				nearestDistance = pointDistance;
				nearestAPointName = vertex[c];

				continue;
			}

			if (pointDistance < nearestDistance) {
				nearestIPoint = intersectPoint;
				nearestAPoint = point;
				nearestDistance = pointDistance;
				nearestAPointName = vertex[c];
			}
		}

		return {
			point: nearestIPoint,
			vertex: nearestAPointName
		};
	},


	/**
	 * "Умные" направляющие относительно объекта
	 *
	 * @param {fabric.Object} obj
	 * @param {Object} opt
	 * @param {Object} opt.vertex - вершины
	 * @param {Number=10} opt.tolerance - допуск (радиус действия)
	 * */
	ispSmartGuideToObject(obj, opt = {}) {
		let coords = obj._getSnapBoxModCoords(opt);

		return [
			this.ispSnapToLine(coords.tl, coords.tr, opt),
			this.ispSnapToLine(coords.tr, coords.br, opt),
			this.ispSnapToLine(coords.br, coords.bl, opt),
			this.ispSnapToLine(coords.bl, coords.tl, opt),
			this.ispSnapToLine(
				coords.c,
				coords.c.subtract(new fabric.Point(0, 1)),
				opt
			),
			this.ispSnapToLine(
				coords.c.subtract(new fabric.Point(1, 0)),
				coords.c,
				opt
			)
		].filter(a => a);
	},


	/**
	 * Притянуть объект к линии (направляющей)
	 *
	 * @param {fabric.Point} lineStartPoint - точка построения линии
	 * @param {fabric.Point} lineEndPoint - точка построения линии
	 * @param {Object} opt
	 * @param {Number=10} opt.tolerance - допуск (радиус действия)
	 * @param {Array=} opt.vertex - ['tr', 'br', 'c' ...] - точки притяжения внутри объекта
	 *
	 * @return {Boolean}
	 * */
	ispSnapToLine(lineStartPoint, lineEndPoint, opt = {}) {
		let coords  = this._getSnapBoxModCoords(opt),
		    res     = this.ispCalcSnapToLine(lineStartPoint, lineEndPoint, opt);

		res.line = [lineStartPoint, lineEndPoint];

		if (!coords[res.vertex] || !res.point)
			return false;

		if (coords[res.vertex].distanceFrom(res.point) > (opt.tolerance || 10))
			return false;

		/*
		if (_.get(this, 'canvas.ispGuidelines.smart.strokeStyle')) {
			this._ispDrawSnapLine(lineStartPoint, lineEndPoint);
			this._ispDrawSnapLine(lineEndPoint, res.point);
		}
		*/

		'bounding-box' == opt.boxModel
			? this.ispSetPositionByBoundingRectOrigin(res.point, coordsOrigin[res.vertex].x, coordsOrigin[res.vertex].y)
			: this.setPositionByOrigin(res.point, coordsOrigin[res.vertex].x, coordsOrigin[res.vertex].y);

		return res;
	}

};