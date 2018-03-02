'use strict';

module.exports = {

	/**
	 * Создать и вернуть уникальный идентификатор объекта
	 *
	 * @return {String}
	 * */
	ispCreateUniqueId() {
		return (this.type + '').toUpperCase() + '_' + Math.random().toString().replace('0.', '');
	}

};