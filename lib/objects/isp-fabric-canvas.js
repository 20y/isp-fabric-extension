'use strict';

const
	fabric = require('./../../index.js').getFabric(),
	ISPFabricPage = require('./isp-fabric-page.js'),

	utils = {
		geometry: require('isp-geometry').utils.geometry
	},

	_ = {
		debounce: require('lodash/debounce')
	};

require('../shim/object.js');
require('../shim/image.js');
//require('./polyfills/i-text.js');
require('./isp-textbox.js');
require('./isp-shape-star-5.js');
require('./isp-shape-certificate.js');
require('./isp-shape-bookmark.js');
require('./isp-shape-heart.js');
require('./isp-shape-bubble.js');
require('./isp-shape-bubble-round.js');


const ISPFabricCanvas = fabric.util.createClass(fabric.Canvas, {

	type: 'ISPFabricCanvas',


	controlsAboveOverlay: true,


	guidelinesSnapToCorners: true,


	preserveObjectStacking: true,


	/**
	 * Поднять текст на передний план
	 * */
	ispBringTextToFront: false,


	// TODO: MOV-288485. По неизвестынм причинам на мобильных устройствах нарушаются пропорции экрана
	enableRetinaScaling: false,


	_ispObjectCachingFalseObjTypes: {
		'i-text': 1,
		text: 1
	},


	_ispObjectCachingTrueObjTypes: {
		image: 1
	},


	initialize(el, options) {
		this.callSuper('initialize', el, options);

		this.setBackgroundColor('#cccccc');
		this.dpi = 300;

		this._ispInitEvents();
		// this.ispClipByPage(true);
	},


	ispSomeActiveObjects(objs) {
		return this.getActiveObjects().some(obj => {
			return !!~objs.indexOf(obj);
		});
	},


	ispEveryActiveObjects(objs) {
		return this.getActiveObjects().every(obj => {
			return !!~objs.indexOf(obj);
		});
	},


	ispSetActiveObjects(objs) {
		let sel;

		this.discardActiveObject();

		if (!objs.length)
			return this.requestRenderAll();

		if (objs.length == 1) {
			sel = objs[0];

		} else {
			sel = new fabric.ActiveSelection(objs, { canvas: this });
		}

		this.setActiveObject(sel);
		this.requestRenderAll();
	},


	_ispInitEvents() {
		this.on('object:added', this._ispOnObjectAdded);
		this.on('text:changed', this._ispOnTextChanged);
		this.on('text:editing:exited', this._ispOnTextEditingExited);
		this.on('object:moving', this._ispOnObjectMoving);
		this.on('object:scaling', this._ispOnObjectScaling);
		this.on('before:render', this._ispOnBeforeRender);
		this.on('after:render', this._ispOnAfterRender);
	},


	_ispOnObjectMoving(e) {
		this._ispApplyGuidelines(e.target);
	},


	_ispOnObjectScaling() {
		return null;
	},


	_ispOnBeforeRender() {
		this.ispBeforeRenderObjects = null;

		if (this.ispBringTextToFront)
			this.ispBringToFrontTextHandler();
	},


	_ispOnAfterRender() {
		this._objects = this.ispBeforeRenderObjects || this._objects;
	},


	/**
	 * Обработчик. Подключается по усмотрению. Поднять текстовые слои на передний план
	 * */
	ispBringToFrontTextHandler() {
		this.ispBeforeRenderObjects = this.getObjects().slice(0);

		this.ispBringToFront([
			{ type: fabric.ISPTextbox.prototype.type },
			{ type: fabric.IText.prototype.type },
			{ type: fabric.Text.prototype.type },
		]);
	},


	_ispOnObjectAdded(e) {
		let obj = e.target;

		// this._ispSetDefaultOrigin(obj);

		this._ispApplyIdToObj(obj);

		this.lockCanvasObject(obj, this.isObjectLocked(obj));

		if (this._ispObjectCachingFalseObjTypes[obj.type])
			obj.set('objectCaching', false);

		if (this._ispObjectCachingTrueObjTypes[obj.type])
			obj.set('objectCaching', true);

		this.lockCanvasObject(obj, obj.locked);
	},


	_ispOnTextChanged(e) {
		this._measureText(e.target);
	},


	_ispOnTextEditingExited(e) {
		setTimeout(() => !e.target.text && this.ispRmObjects(e.target), 0);
	},


	/**
	 * Вернуть обработчики событий
	 *
	 * @param eventName - название события
	 *
	 * @return {Array}
	 * */
	ispGetEventListeners(eventName) {
		return this.__eventListeners[eventName] || [];
	},


	/**
	 * Поднять указанные объекты на передний план
	 *
	 * @param arg - параметры для ispGetObjects
	 * */
	ispBringToFront(arg) {
		this.ispGetObjects(arg).reduceRight((arr, obj) => this.bringToFront(obj), null);
	},


	/**
	 * Костыль. Нужен для того, чтобы указать экземпляр холста в котором работает backgroundImage
	 * */
	__setBgOverlay(property, value, loaded, callback) {
		return this.callSuper('__setBgOverlay', property, value, loaded, () => {
			if ('backgroundImage' == property && value)
				this.ispSetPage(value);

			callback && callback();
		});
	},


	toObject(props) {
		if (!props)
			props = [];

		props.push.apply(props, ['id', 'dpi', 'objectCaching', 'ispBackgroundImage', 'ispBringTextToFront']);

		return this.callSuper('toObject', props);
	},


	/**
	 * Установить печатную область
	 *
	 * @param {ISPFabricPage} page
	 *
	 * @return {ISPFabricCanvas}
	 * */
	ispSetPage(page) {
		if (!(page instanceof ISPFabricPage))
			page = new ISPFabricPage(page);

		page.canvas = page.canvas || this;

		return this.setBackgroundImage(page);
	},


	ispGetPageRect() {
		let page = this.ispGetPage(),
			scrollCoords = this.ispGetScrollCoord(),
			z = this.getZoom();

		if (!page) {
			return {
				left: 0,
				top: 0,
				width: 0,
				height: 0
			}
		}

		return {
			left: scrollCoords.x,
			top: scrollCoords.y,
			width: page.ispGetWidth() * z,
			height: page.ispGetHeight() * z
		}
	},


	ispClipByPage(active) {
		if (!active)
			return this.set({ clipTo: null });

		this.set({
			clipTo: ctx => {
				let { left, top, width, height } = this.ispGetPageRect();

				ctx.rect(left, top, width, height);
			}
		});
	},


	ispSetAutoZoom() {
		let page = this.ispGetPage();

		if (!page) return;

		let pageSize = {
			width: this.ispGetPage().ispGetWidth(),
			height: this.ispGetPage().ispGetHeight()
		};

		let canvasSize = {
			height: this.getHeight(),
			width: this.getWidth()
		};

		let res = utils.geometry.containToRect(pageSize, canvasSize);

		this.setZoom((res.width / pageSize.width) * 0.8);
	},


	/**
	 * Сместить положение прокрутки на холсте
	 *
	 * @param stepX - смещение по горизонтали
	 * @param stepY - смещение по вертиткали
	 *
	 * @return {ISPFabricCanvas}
	 * */
	ispScrollBy(stepX, stepY) {
		let vpt = this.get('viewportTransform'),
			page = this.ispGetPage();

		if (!page) return;

		vpt[4] += stepX;
		vpt[5] += stepY;

		return this.setViewportTransform(vpt);
	},


	/**
	 * Установить положение прокрутки на указанные координаты
	 *
	 * @param xCoord - смещение по горизонтали
	 * @param yCoord - смещение по вертиткали
	 *
	 * @return {ISPFabricCanvas}
	 * */
	ispScrollTo(xCoord, yCoord) {
		let vpt = this.get('viewportTransform'),
			page = this.ispGetPage();

		if (!page) return;

		vpt[4] = xCoord;
		vpt[5] = yCoord;

		return this.setViewportTransform(vpt);
	},


	/**
	 * Вернуть текущее смещение холста (прокрутки)
	 *
	 * @return {Object} - { x, y }
	 * */
	ispGetScrollCoord() {
		let vpt = this.get('viewportTransform');

		return {
			x: vpt[4],
			y: vpt[5]
		};
	},


	/**
	 * Вмещается ли печатная область в видимую рабочую область
	 *
	 * @return {Boolean}
	 * */
	ispIsPageFitToCanvasViewport() {
		let z = this.getZoom(),
			page = this.ispGetPage();

		if (!page) return;

		return (
			   this.getWidth() - (page.ispGetWidth() * z) > 0
			&& this.getHeight() - (page.ispGetHeight() * z) > 0
		)
	},


	/**
	 * Центрировать печатную область по горизонтали
	 * */
	ispPageAlignToCenterH() {
		let vpt = this.get('viewportTransform'),
			page = this.ispGetPage();

		if (!page) return;

		vpt[4] = this.getCenter().left - (page.get('width') * this.getZoom() / 2);

		this.setViewportTransform(vpt);

		return this;
	},


	/**
	 * Центрировать печатную область по вертикали
	 * */
	ispPageAlignToCenterV() {
		let vpt = this.get('viewportTransform'),
			page = this.ispGetPage();

		if (!page) return;

		vpt[5] = this.getCenter().top - (page.get('height') * this.getZoom() / 2);

		this.setViewportTransform(vpt);

		return this;
	},


	/**
	 * Вернуть печатную область
	 *
	 * @return {ISPFabricPage}
	 * */
	ispGetPage() {
		return this.backgroundImage;
	},


	_ispApplyIdToObj(obj) {
		obj.id = obj.id || obj.ispCreateUniqueId();
	},


	_ispSetDefaultOrigin(obj) {
		obj.set({
			originX: 'center',
			originY: 'center',
			left: obj.left + obj.width / 2,
			top: obj.top + obj.height / 2
		});
	},


	/**
	 * Вернуть объекты на холсте
	 *
	 * @param {fabric.Object | Object | Array} arg - поля объекта, либо fabric.Object, либо массив из перечисленных
	 *
	 * @return {Array}
	 * */
	ispGetObjects(arg = {}) {
		arg = [].concat(arg || []);

		return arg.reduce((arr, _arg) => {
			let obj;

			if (_arg instanceof fabric.Object)
				obj = this.ispGetObjectsByInstance(_arg);

			else if (typeof _arg == 'function')
				obj = this.ispGetObjectsByConstructor(_arg);

			else
				obj = this.ispGetObjectsByFields(_arg);

			arr.push.apply(arr, obj);

			return arr;
		}, []);
	},


	/**
	 * Вернуть объекты на холсте. Свойства объекта как параметр поиска
	 *
	 * @param {Object} props - свойства объекта
	 *
	 * @return {Array}
	 * */
	ispGetObjectsByFields(props = {}) {
		return this.getObjects().filter(obj => {
			return Object.keys(props).every(key => props[key] == obj[key]);
		});
	},


	/**
	 * Вернуть объекты на холсте. Экземпляр объекта как параметр поиска
	 *
	 * @param {Object} _instance - объект
	 *
	 * @return {Array}
	 * */
	ispGetObjectsByInstance(_instance) {
		return this.getObjects().filter(obj => obj == _instance);
	},


	/**
	 * Вернуть объекты на холсте. Конструктор как параметр поиска
	 *
	 * @param _constructor - конструктор
	 *
	 * @return {Array}
	 * */
	ispGetObjectsByConstructor(_constructor) {
		return this.getObjects().filter(obj => obj instanceof _constructor);
	},


	/**
	 * Удалить объекты из холста. Вернуть удаленные
	 *
	 * @param {Object} arg - объект
	 *
	 * @return {ISPFabricCanvas}
	 * */
	ispShiftObjects(arg) {
		var _obj = this.ispGetObjects(arg);

		_obj.forEach(obj => this.remove(obj));

		this.trigger('isp-rm-objects');

		return _obj;
	},


	/**
	 * Удалить объекты из холста
	 *
	 * @param {Object} arg - объект
	 *
	 * @return {ISPFabricCanvas}
	 * */
	ispRmObjects(arg) {
		this.ispShiftObjects(arg);

		return this;
	},


	/**
	 * Заблокировать объект
	 *
	 * @param {fabric.Object} obj - объект из холста
	 * @param {Boolean} lock - состояние блокировки
	 *
	 * @return {ISPFabricCanvas}
	 * */
	lockCanvasObject(obj, lock) {
		obj.set({
			lockMovementX: lock,
			lockMovementY: lock,
			lockScalingX: lock,
			lockScalingY: lock,
			lockUniScaling: lock,
			lockRotation: lock,
			selectable: !lock,
			hasControls: !lock,
			hasBorders: !lock,
			editable: !lock
		});

		obj.locked = lock;

		return this;
	},


	/**
	 * Проверить состояние блокировки объекта
	 *
	 * @param {Object} obj
	 *
	 * @return {Boolean}
	 * */
	isObjectLocked(obj) {
		return obj.locked || false;
	},


	/**
	 * Пересчитать размер текста
	 * */
	_measureText: _.debounce(function(obj) {
		if (!('i-text' == obj.type || 'text' == obj.type))
			return;

		obj.ctx.font = `${obj.fontSize}px ${obj.fontFamily}`;

		let line = obj.text.split('\n').reduce((prevLine, nextLine) => {
			return nextLine.length > prevLine.length ? nextLine : prevLine;
		});

		obj.width = obj.ctx.measureText(line).width;

		this.renderAll();
	}, 500),


	_renderOverlay(e) {
		var t = this.ispGetPage();

		if (!t)
			return null;

		var n = this.getWidth(),
			r = this.getHeight(),
			o = "rgba(0, 0, 0, 0.45)";

		e.save(),
		e.globalCompositeOperation = "source-atop",
		e.beginPath(),
		e.moveTo(-2, -2),
		e.lineTo(n + 2, -2),
		e.lineTo(n + 2, r + 2),
		e.lineTo(-2, r + 2),
		e.lineTo(-2, -2),
		e.transform.apply(e, this.viewportTransform),
		e.moveTo(0, 0),
		e.lineTo(0, t.ispGetHeight()),
		e.lineTo(t.ispGetWidth(), t.ispGetHeight()),
		e.lineTo(t.ispGetWidth(), 0),
		e.closePath(),
		e.fillStyle = o,
		e.fill(),
		e.restore();
		// this.renderCanvasBorders()
	},


	_ispApplyGuidelines(obj, options = {}) {
		let left        = obj.getBoundingRect(true, true).left,
			top         = obj.getBoundingRect(true, true).top,
			center		= obj.ispGetCenterPoint(),
			width       = obj.getBoundingRect(true, true).width,
			height      = obj.getBoundingRect(true, true).height,
			page 		= this.ispGetPage(),
			pageCenter  = page.ispGetCenterPoint(),
			clearance   = options.clearance || 10;

		if (!this.guidelinesSnapToCorners)
			return;

		if (Math.abs(center.x - pageCenter.x) < clearance)
			obj.set('left', pageCenter.x);

		if (Math.abs(center.y - pageCenter.y) < clearance)
			obj.set('top', pageCenter.y);

		// left - left
		if (Math.abs(page.left - left) < clearance)
			obj.set('left', page.left  + (width / 2));
		// right - right
		else if (Math.abs((page.left + page.ispGetWidth({ units: 'px' })) - (left + width)) < clearance)
			obj.set('left', (page.left + page.ispGetWidth({ units: 'px' })) - width / 2);

		// top - top
		if (Math.abs(page.top - top) < clearance)
			obj.set('top', page.top  + height / 2);
		// bottom - bottom
		else if (Math.abs((page.top + page.ispGetHeight({ units: 'px' })) - (top + height)) < clearance)
			obj.set('top', (page.top + page.ispGetHeight({ units: 'px' })) - height / 2);


		this.getObjects().forEach(o => {
			if (obj == o)
				return;

			if ('activeSelection' == obj.type) {
				if (obj.getObjects().some(o2 => o2 == o))
					return;
			}

			let nLeft = o.getBoundingRect(true, true).left,
				nTop = o.getBoundingRect(true, true).top,
				nCenter = o.ispGetCenterPoint(),
				nWidth = o.getBoundingRect(true, true).width,
				nHeight = o.getBoundingRect(true, true).height;

			// left - left
			if (Math.abs(nLeft - left) < clearance)
				obj.set('left', nLeft + width / 2);
			// right - right
			else if (Math.abs((nLeft + nWidth) - (left + width)) < clearance)
				obj.set('left', (nLeft + nWidth) - width / 2);

			// left - right
			if (Math.abs((nLeft + nWidth) - left) < clearance)
				obj.set('left', nLeft + nWidth + width / 2);
			// right - left
			else if (Math.abs(nLeft - (left + width)) < clearance)
				obj.set('left', (nLeft - width) + width / 2);

			// top - top
			if (Math.abs(nTop - top) < clearance)
				obj.set('top', nTop + height / 2);
			// bottom - bottom
			else if (Math.abs((nTop + nHeight) - (top + height)) < clearance)
				obj.set('top', (nTop + nHeight) - height / 2);

			// top - bottom
			if (Math.abs((nTop + nHeight) - top) < clearance)
				obj.set('top', (nTop + nHeight) + height / 2);
			// bottom - top
			else if (Math.abs(nTop - (top + height)) < clearance)
				obj.set('top', (nTop - height) + height / 2);

			// center x - center x
			if (Math.abs(center.x - nCenter.x) < clearance)
				obj.set('left', nCenter.x);

			// center x - left
			if (Math.abs(center.x - nLeft) < clearance)
				obj.set('left', nLeft);

			// center x - right
			if (Math.abs(center.x - (nLeft + nWidth)) < clearance)
				obj.set('left', nLeft + nWidth);

			// center y - center y
			if (Math.abs(center.y - nCenter.y) < clearance)
				obj.set('top', nCenter.y);

			// center y - top
			if (Math.abs(center.y - nTop) < clearance)
				obj.set('top', nTop);

			// center y - bottom
			if (Math.abs(center.y - (nTop + nHeight)) < clearance)
				obj.set('top', nTop + nHeight);
		});
	}

});


module.exports = ISPFabricCanvas;
