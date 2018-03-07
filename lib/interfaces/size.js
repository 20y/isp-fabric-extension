'use strict';

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
	}

};
