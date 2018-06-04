'use strict';

const fabric = require('./../../index.js').getFabric();


module.exports = {

	ispCreateCollectionAggregator(setterFunc, initAggr) {
		return function(collection, aggr) {
			aggr = aggr || (initAggr ? initAggr() : []);

			collection.getObjects().forEach((obj, idx) => {
				setterFunc(aggr, obj, idx, collection);
			});

			return aggr;
		};
	},


	ispCreateCollectionFilterAggregator(filterFn, initAggr, params) {
		params = params || {};

		let setterFunc = (aggr, obj, idx, collection) => {
			// рекурсивный поиск
			if (params.recursive && this.ispIsCollectionObject(obj))
				aggrFunc(obj, aggr);

			if (!filterFn(aggr, obj, idx, collection))
				return;

			aggr.push(obj);
		};

		let aggrFunc = this.ispCreateCollectionAggregator(setterFunc, initAggr);

		return aggrFunc;
	},


	/**
	 * Проверить: является ли переданный объект коллекцией
	 *
	 * @param {fabric.Object} obj
	 *
	 * @return {Boolean}
	 * */
	ispIsCollectionObject(obj) {
		// Проверить только наличие ключей
		// На случай если методы коллекции были переопределены на уровне класса
		return Object.keys(fabric.Collection).every(k => obj[k]);
	},


	/**
	 * Вернуть объекты на холсте
	 *
	 * @param {fabric.Object | Object | Array} arg - поля объекта, либо fabric.Object, либо массив из перечисленных
	 * @param {Object=} params - параметры поиска
	 * @param {Boolean=false} params.recursive - рекурсивный поиск в группах и других коллекциях
	 *
	 * @return {Array}
	 * */
	ispGetObjects(arg = {}, params = {}) {
		arg = [].concat(arg || []);

		return arg.reduce((arr, _arg) => {
			let obj;

			if (_arg instanceof fabric.Object)
				obj = this.ispGetObjectsByInstance(_arg, params);

			else if (typeof _arg == 'function')
				obj = this.ispGetObjectsByConstructor(_arg, params);

			else
				obj = this.ispGetObjectsByFields(_arg, params);

			arr.push.apply(arr, obj);

			return arr;
		}, []);
	},


	/**
	 * Вернуть объекты на холсте. Свойства объекта как параметр поиска
	 *
	 * @param {Object} props - свойства объекта
	 * @param {Object=} params
	 * @param {Boolean=false} params.recursive
	 *
	 * @return {Array}
	 * */
	ispGetObjectsByFields(props = {}, params) {
		let func = this.ispCreateCollectionFilterAggregator((a, obj) => {
			return Object.keys(props).every(key => props[key] == obj[key]);
		}, null, params);

		return func(this);
	},


	/**
	 * Вернуть объекты на холсте. Экземпляр объекта как параметр поиска
	 *
	 * @param {Object} _instance - объект
	 * @param {Object=} params
	 * @param {Boolean=false} params.recursive
	 *
	 * @return {Array}
	 * */
	ispGetObjectsByInstance(_instance, params) {
		let func = this.ispCreateCollectionFilterAggregator((a, obj) => {
			return obj == _instance;
		}, null, params);

		return func(this);
	},


	/**
	 * Вернуть объекты на холсте. Конструктор как параметр поиска
	 *
	 * @param _constructor - конструктор
	 * @param {Object=} params
	 * @param {Boolean=false} params.recursive
	 *
	 * @return {Array}
	 * */
	ispGetObjectsByConstructor(_constructor, params) {
		let func = this.ispCreateCollectionFilterAggregator((a, obj) => {
			return obj instanceof _constructor;
		}, null, params);

		return func(this);
	},


	/**
	 * Удалить объекты из холста. Вернуть удаленные
	 *
	 * @param {Object} arg - объект
	 * @param {Object=} params
	 * @param {Boolean=false} params.recursive
	 *
	 * @return {ISPFabricCanvas}
	 * */
	ispShiftObjects(arg = {}, params) {
		params = params || {};

		let _obj = this.ispGetObjects(arg, params);

		_obj.forEach(obj => {
			let c = obj.canvas;

			// объект в фокусе - снять фокус
			// сфокусированный объект после удаления из группы вызывает ошибки в рендере холста
			if (c && c.getActiveObject() == obj)
				c.discardActiveObject();

			// рекурсивное удаление - удалить из контекста текущей коллекции и контекста внутри других коллекций
			if (params.recursive && obj.group) {
				obj.group.remove(obj);

				c && c.requestRenderAll();
			}

			this.remove(obj);
		});

		return _obj;
	},


	/**
	 * Удалить объекты из холста
	 *
	 * @param {Object} arg - объект
	 * @param {Object=} params
	 * @param {Boolean=} params.recursive
	 *
	 * @return {ISPFabricCanvas}
	 * */
	ispRmObjects(arg, params) {
		this.ispShiftObjects(arg, params);

		this.trigger('isp-rm-objects');

		return this;
	},

};