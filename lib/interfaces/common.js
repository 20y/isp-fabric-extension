'use strict';

module.exports = {

	/**
	 * Вернуть оригинальные свойства, которые были перезаписаны шимом
	 *
	 * @param {String} key
	 *
	 * @return {*}
	 * */
	ispGetNativeProp(key) {
		return this._ispFabricNativeProps[key];
	},


	/**
	 * Вызвать оригинальный метод, который был перезаписан шимом
	 *
	 * @param {String} key - название метода
	 * @param {Array} args
	 *
	 * @return {*}
	 * */
	ispCallNative(key, ...args) {
		return this._ispFabricNativeProps[key].apply(this, args);
	},


	/**
	 * Создать и вернуть уникальный идентификатор объекта
	 *
	 * @return {String}
	 * */
	ispCreateUniqueId() {
		return (this.type + '').toUpperCase() + '_' + Math.random().toString().replace('0.', '');
	},


	ispSetActiveObject(isAct) {
		let actObjs = this.canvas.getActiveObjects() || [];

		isAct // isChecked
			? actObjs.push(this)
			: (actObjs = actObjs.filter(a => a != this));

		return this.canvas.ispSetActiveObjects(actObjs);
	},


	ispIsActive() {
		return this.canvas.ispSomeActiveObjects([this]);
	},

	/**
	 * Развернуть объект вокруг точки вращения
	 *
	 * @param {Number} angle - в грудусах
	 * @param origin
	 *
	 * @return {fabric.Object} - this
	 */
	ispRotateAroundOrigin(angle, origin) {
		let p = this.getPointByOrigin('center', 'center'),
			r = fabric.util.rotatePoint(p, origin, fabric.util.degreesToRadians(angle));

		this.setPositionByOrigin(r, 'center', 'center');
		this.set('angle', this.get('angle') + angle);

		this.canvas.requestRenderAll();

		return this;
	}

};
