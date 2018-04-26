'use strict';

const utils = {
	geometry: require('./../../index.js').utils.geometry
};

const
	{ originOffset } = require('./../consts.js'),
	fabric = require('./../../index.js').getFabric();


module.exports = {

	/**
	 * Вернуть координаты точек для boundingRect
	 *
	 * @abs
	 * @calc
	 *
	 * @return {Object}
	 * */
	ispGetBoundingRectCoords(abs, calc) {
		let rect = this.getBoundingRect(abs, calc);

		return {
			tl: new fabric.Point(rect.left, rect.top),
			tr: new fabric.Point(rect.left + rect.width, rect.top),
			bl: new fabric.Point(rect.left, rect.top + rect.height),
			br: new fabric.Point(rect.left + rect.width, rect.top + rect.height)
		};
	},


	/**
	 * translateToGivenOrigin для boundingRect
	 * @see translateToGivenOrigin
	 * */
	ispTranslateToGivenBoundingRectOrigin(point, fromOriginX, fromOriginY, toOriginX, toOriginY) {
		let x = point.x,
		    y = point.y,
		    rect;

		let offset = this.ispGetOriginOffset(fromOriginX, fromOriginY, toOriginX, toOriginY);

		if (offset.x || offset.y) {
			rect = this.getBoundingRect(1, 1);

			x = point.x + offset.x * rect.width;
			y = point.y + offset.y * rect.height;
		}

		return new fabric.Point(x, y);
	},


	/**
	 * translateToCenterPoint для boundingRect
	 * @see translateToCenterPoint
	 * */
	ispTranslateToBoundingRectCenterPoint: function(point, originX, originY) {
		return this.ispTranslateToGivenBoundingRectOrigin(point, originX, originY, 'center', 'center');
	},


	/**
	 * translateToOriginPoint для boundingRect
	 * @see translateToOriginPoint
	 * */
	translateToBoundingRectOriginPoint: function(center, originX, originY) {
		return this.ispTranslateToGivenBoundingRectOrigin(center, 'center', 'center', originX, originY);
	},


	/**
	 * Вернуть множитель для смещения фигуры из одного origin в другой
	 *
	 * @param fromOffsetX
	 * @param fromOffsetY
	 * @param toOffsetX
	 * @param toOffsetY
	 *
	 * @return {Object} - { x, y }
	 * */
	ispGetOriginOffset(fromOffsetX, fromOffsetY, toOffsetX, toOffsetY) {
		let x = originOffset.x[toOffsetX] - originOffset.x[fromOffsetX],
		    y = originOffset.y[toOffsetY] - originOffset.y[fromOffsetY];

		return { x, y };
	},


	/**
	 * setPositionByOrigin для boundingRect
	 * @see setPositionByOrigin
	 *
	 * @param {fabric.Point} point
	 * @param {String} originX
	 * @param {String} originY
	 * */
	ispSetPositionByBoundingRectOrigin(point, originX, originY) {
		let center = this.ispTranslateToBoundingRectCenterPoint(point, originX, originY),
		    position = this.translateToBoundingRectOriginPoint(center, this.originX, this.originY);

		this.set('left', position.x);
		this.set('top', position.y);
	},


	/**
	 * getPointByOrigin для boundingRect
	 *
	 * @return {fabric.Point}
	 * */
	ispGetPointByBoundingRectOrigin(originX, originY) {
		let center = this.getCenterPoint();

		return this.translateToBoundingRectOriginPoint(center, originX, originY);
	},


	/**
	 * Конвертировать размеры
	 *
	 * @param {Number} val - значение
	 * @param {String} from - исходная ед. измерения
	 * @param {String} to - конечная ед. измерения
	 *
	 * @return {Number}
	 * */
	ispSizeConvert(val, from, to) {
		let _pixelsPer = {
			px: 1,
			mm: this.ispGetPxPerMM()
		};

		_pixelsPer.cm = _pixelsPer.mm * 10;
		_pixelsPer.m = _pixelsPer.cm * 100;

		return val * _pixelsPer[from] / _pixelsPer[to];
	},


	/**
	 * Координаты центра по X и Y у объекта
	 *
	 * @return {Object}
	 * */
	ispGetCenterPoint() {
		let p = new fabric.Point(this.left, this.top);

		return this.translateToCenterPoint(p, this.originX, this.originY)
	},


	/**
	 * Вернуть количестов пикселей на миллиметр
	 *
	 * @return {Number}
	 * */
	ispGetPxPerMM() {
		return this.get('canvas').get('dpi') / 25.4;
	},


	_ispSizeValTransform(val, arg = {}) {
		let z = 1;

		let {
			units = 'px',
			vpt = false
		} = arg;

		if (vpt && units == 'px' && this.canvas)
			z = this.canvas.getZoom();

		return this.ispSizeConvert(val, 'px', units) * z;
	},


	/**
	 * Вернуть координаты по оси X
	 *
	 * @param {Object} arg
	 * @param arg.units - ед. измерения
	 *
	 * @return {Number}
	 * */
	ispGetLeft(arg = {}) {
		let ox = arg.originX || this.originX,
			oy = arg.originY || this.originY,
			p = this.getPointByOrigin(ox, oy),
			x = this._ispSizeValTransform(p.x, arg);

		if (arg.vpt)
			x += this.getViewportTransform()[4];

		return x;
	},


	/**
	 * Вернуть координаты по оси Y
	 *
	 * @param {Object} arg
	 * @param arg.units - ед. измерения
	 *
	 * @return {Number}
	 * */
	ispGetTop(arg = {}) {
		let ox = arg.originX || this.originX,
			oy = arg.originY || this.originY,
			p = this.getPointByOrigin(ox, oy),
			y = this._ispSizeValTransform(p.y, arg);

		if (arg.vpt)
			y += this.getViewportTransform()[5];

		return y;
	},


	ispSetLeft(val, arg = {}) {
		// TODO неправильно считает с arg.vpt = 1
		let z = 1,
			ox = arg.originX || this.originX,
			oy = arg.originY || this.originY,
			p = this.getPointByOrigin(ox, oy);

		val = this.ispSizeConvert(val, arg.units || 'px', 'px');

		if (arg.vpt && this.canvas && arg.units == 'px')
			z = this.canvas.getZoom();

		if (arg.vpt)
			val -= this.getViewportTransform()[4];

		p.x = val;

		this.setPositionByOrigin(p, ox, oy);
	},


	ispSetTop(val, arg = {}) {
		// TODO неправильно считает с arg.vpt = 1
		let z = 1,
			ox = arg.originX || this.originX,
			oy = arg.originY || this.originY,
			p = this.getPointByOrigin(ox, oy);

		val = this.ispSizeConvert(val, arg.units || 'px', 'px');

		if (arg.vpt && this.canvas && arg.units == 'px')
			z = this.canvas.getZoom();

		if (arg.vpt)
			val -= this.getViewportTransform()[5];

		p.y = val;

		this.setPositionByOrigin(p, ox, oy);
	},


	/**
	 * Вернуть ширину в указанных размерах
	 *
	 * @param {Object} arg
	 * @param arg.units - ед. измерения
	 *
	 * @return {Number}
	 * */
	ispGetWidth(arg = {}) {
		return this._ispSizeValTransform(this.getScaledWidth(), arg);
	},


	/**
	 * Вернуть высоту в указанных размерах
	 *
	 * @param {Object} arg
	 * @param arg.units - ед. измерения
	 *
	 * @return {Number}
	 * */
	ispGetHeight(arg = {}) {
		return this._ispSizeValTransform(this.getScaledHeight(), arg);
	},


	/**
	 * Установить высоту объекта
	 *
	 * @param {Number} val - значение высоты
	 * @param {Object} arg
	 * @param {String} arg.units
	 * */
	ispSetHeight(val, arg = {}) {
		let { units = 'px' } = arg;

		this.scaleY = this.ispSizeConvert(val, units, 'px') / (this.get('height') + this.strokeWidth);
	},


	/**
	 * Установить ширину объекта
	 *
	 * @param {Number} val - значение ширины
	 * @param {Object} arg
	 * @param {String} arg.units
	 * */
	ispSetWidth(val, arg = {}) {
		let { units = 'px' } = arg;

		this.scaleX = this.ispSizeConvert(val, units, 'px') / (this.get('width') + this.strokeWidth);
	},


	/**
	 * Вернуть длинную сторону
	 *
	 * @param {Object} arg
	 * @param arg.units - ед. измерения
	 *
	 * @return {Number}
	 * */
	ispGetLong(arg = {}) {
		let h = this.ispGetHeight(arg),
		    w = this.ispGetWidth(arg);

		return w > h ? w : h;
	},


	/**
	 * Вернуть короткую сторону
	 *
	 * @param {Object} arg
	 * @param arg.units - ед. измерения
	 *
	 * @return {Number}
	 * */
	ispGetShort(arg = {}) {
		let h = this.ispGetHeight(arg),
		    w = this.ispGetWidth(arg);

		return w < h ? w : h;
	},


	ispResetScaleXToWidth() {
		this._ispResetScaleXToWidth();
	},


	ispResetScaleYToHeight() {
		this._ispResetScaleYToHeight();
	},


	_ispResetScaleXToWidth() {
		this.width *= this.scaleX;
		this.scaleX = 1;
	},


	_ispResetScaleYToHeight() {
		this.height *= this.scaleY;
		this.scaleY = 1;
	},


	/**
	 * Вернуть ориентацию листа
	 *
	 * @return {String}
	 * */
	ispGetOrientation() {
		return this.ispGetWidth() > this.ispGetHeight()
			? 'landscape'
			: 'portrait';
	},


	/**
	 * Изменить ориентацию листа
	 *
	 * @param {String} orient - landscape, portrait
	 * */
	ispSetOrientation(orient) {
		if (this.ispGetOrientation() == orient)
			return;

		let short = this.ispGetShort(),
		    long = this.ispGetLong();

		if ('landscape' == orient) {
			this.ispSetWidth(long);
			this.ispSetHeight(short);

		} else if ('portrait' == orient) {
			this.ispSetWidth(short);
			this.ispSetHeight(long);
		}
	},


	/**
	 * Вернуть размеры и координаты объекта.
	 * getBoundingRect с учетом scaleX, scaleY, единиц измерения
	 *
	 * @param {Object} arg
	 *
	 * @return {Object}
	 * */
	ispGetRect(arg) {
		arg = Object.assign({}, arg, { originX: 'left', originY: 'top' });

		return {
			width: this.ispGetWidth(arg),
			height: this.ispGetHeight(arg),
			left: this.ispGetLeft(arg),
			top: this.ispGetTop(arg),
			right: this.ispGetLeft(arg) + this.ispGetWidth(arg),
			bottom: this.ispGetTop(arg) + this.ispGetHeight(arg),
			center: {
				x: this.ispGetLeft(arg, { originX: 'center' }),
				y: this.ispGetTop(arg, { originY: 'center' })
			}
		};
	},


	ispSetRect(rect, arg = {}) {
		Object.keys(rect).forEach(k => {
			if ('width' == k)
				this.ispSetWidth(rect[k], arg);

			else if ('height' == k)
				this.ispSetHeight(rect[k], arg);

			else if ('left' == k)
				this.ispSetLeft(rect[k], arg);

			else if ('top' == k)
				this.ispSetTop(rect[k], arg);

			else if ('center' == k) {
				Object.keys(rect.center).forEach(k => {
					if ('x' == k)
						this.ispSetLeft(rect.center[k], { originX: 'center' });

					else if ('y' == k)
						this.ispSetTop(rect.center[k], { originY: 'center' });
				});
			}
		});
	},


	/**
	 * Описать в размеры
	 *
	 * @param  {Object} toRect
	 *
	 * @return {Object}
	 */
	ispCoverToRect(toRect) {
		this.ispSetRect(
			utils.geometry.coverToRect(
				this.ispGetRect(),
				toRect
			)
		);
	},


	/**
	 * Вписать в размеры
	 *
	 * @param toRect.width
	 * @param toRect.height
	 *
	 * @return {Object}
	 * */
	ispContainToRect(toRect) {
		this.ispSetRect(
			utils.geometry.containToRect(
				this.ispGetRect(),
				toRect
			)
		);
	}

};
