'use strict';

module.exports = {

	/**
	 * Создать и вернуть уникальный идентификатор объекта
	 *
	 * @return {String}
	 * */
	ispCreateUniqueId() {
		return (this.type + '').toUpperCase() + '_' + Math.random().toString().replace('0.', '');
	},


	ispSetActiveObject(isAct) {
		var actObjs = this.canvas.getActiveObjects() || [];

		isAct // isChecked
			? actObjs.push(this)
			: (actObjs = actObjs.filter(a => a != this));

		return this.canvas.ispSetActiveObjects(actObjs);
	}

};
