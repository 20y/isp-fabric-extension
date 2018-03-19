'use strict';

const utils = {
	geometry: require('./../../index.js').utils.geometry
};

module.exports = {

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


	/**
	 * Вернуть ширину в указанных размерах
	 *
	 * @return {Number}
	 * */
	ispGetWidth(arg = {}) {
		let { units = 'px' } = arg;

		return this.ispSizeConvert(this.getScaledWidth(), 'px', units);
	},


	/**
	 * Вернуть высоту в указанных размерах
	 *
	 * @return {Number}
	 * */
	ispGetHeight(arg = {}) {
		let { units = 'px' } = arg;

		return this.ispSizeConvert(this.getScaledHeight(), 'px', units);
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


	ispGetRect(arg = {}) {
		return {
			height: this.ispGetHeight(arg),
			width: this.ispGetWidth(arg)
		};
	},


	ispSetRect(rect, arg = {}) {
		this.ispSetWidth(rect.width, arg);
		this.ispSetHeight(rect.height, arg);
	},


	/**
	 * Описать в размеры
	 *
	 * @param  {Object} fromRect
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
	 * @param fromRect.width
	 * @param fromRect.height
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
