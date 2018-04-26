'use strict';

const
	fabric = require('./../../index.js').getFabric(),
	ISPFabricPage = require('./isp-fabric-page.js'),

	utils = {
		geometry: require('isp-geometry').utils.geometry
	},

	_ = {
		get: require('lodash/get'),
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


	preserveObjectStacking: true,


	ispDev: {

		// Показывать сетку + линейку
		grid: 0

	},


	/**
	 * Направляющие
	 * */
	ispGuidelines: {
		// Показывать статичные направляющие
		'static': true,

		// Динамические, магнитные
		smart: {
			// Модель рамки
			boxModel: 'bounding-box',

			// Цвет направляющих
			strokeStyle: '#ff4aff', // розовый

			// Падиус действия
			tolerance: 10,

			// Включить направляющие относительно вершин:
			vertex: [
				'tl',   // top-left
				'tr',   // top-right
				'c',    // center
				'bl',   // bottom-left
				'br'    // bottom-right
			],

			// Включить направляющие" относительно:
			snapTo: {
				page: true, // холста
				objects: true // объектов
			}
		}
	},


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
		this.ispPostRenderObjects = [];
		this._ispPostRenderGuideLines = [];

		this._ispInitEvents();

		this.ispClipByPageFn = this.ispClipByPageFn.bind(this);
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
		this.on('object:rotating', this._ispOnObjectRotating);
		this.on('object:scaling', this._ispOnObjectScaling);
		this.on('before:render', this._ispOnBeforeRender);
		this.on('after:render', this._ispOnAfterRender);
		this.on('after:render', this._ispOnAfterRenderPostRenderObjects);
		this.on('after:render', this._ispOnAfterRenderDevGrid);
		this.on('after:render', this._ispOnAfterRenderDrawSmartGuideLines);
	},


	_ispOnObjectRotating(obj) {
		if (obj.e.shiftKey)
			obj.target.angle = Math.round(obj.target.angle / 15) * 15;
	},


	_ispOnObjectMoving(e) {
		this._ispApplyGuidelines(e.target, _.get(this, 'ispGuidelines.smart'));
	},


	_ispOnObjectScaling() {
		return null;
	},


	_ispOnBeforeRender() {
		this.clearContext(this.contextTop);

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


	_ispOnAfterRenderPostRenderObjects() {
		let obj,
		    ctx = this.getContext();

		while (obj = this.ispPostRenderObjects.shift()) {
			obj.render(ctx);
			obj._ispPostRenderAwait = void 0;
		}
	},


	_ispRenderDevGrid() {
		let x = 0,
			y = 0,
			i = 0,
			fontSize = 12,
			fontFamily = 'serif',
			_vpt = this.viewportTransform,
			ctx = this.getContext(),
			c = this,
			font = fontSize + ' ' + fontFamily,
			z = _vpt[0],
			step = 20 * z,
			ox = _vpt[4],
			oy = _vpt[5];

		ctx.save();

		// рулетка "ширина"
		while (i < c.width) {
			x = i + ox;

			ctx.strokeStyle = 'black';
			ctx.moveTo(x, 0);
			ctx.lineTo(x, 10);

			ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
			ctx.moveTo(x, 30);
			ctx.lineTo(x, c.height);


			ctx.rotate(Math.PI / 2);
			ctx.font = font;
			ctx.fillText(+((x - ox).toFixed(2)), 20, -x);
			ctx.rotate(-Math.PI / 2);

			i += step;
		}

		i = 0;

		// рулетка "высота"
		while (i < c.height) {
			y = i + oy;

			ctx.strokeStyle = 'black';
			ctx.moveTo(0, y);
			ctx.lineTo(10, y);

			ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
			ctx.moveTo(60, y);
			ctx.lineTo(c.width, y);

			ctx.font = font;
			ctx.fillText(+((y - oy).toFixed(2)), 20, y);

			i += step;
		}

		ctx.stroke();
		ctx.restore();
	},


	_ispOnAfterRenderDrawSmartGuideLines: _.debounce(function() {
		let obj;

		while (obj = this._ispPostRenderGuideLines.shift()) {
			this._ispDrawSmartGuideLine(obj.line[0], obj.line[1]);
			this._ispDrawSmartGuideLine(obj.line[1], obj.point);
		}
	}, 50),


	_ispOnAfterRenderDevGrid() {
		this.ispDev.grid && this._ispRenderDevGrid();
	},


	ispAddPostRenderObject(obj) {
		obj._ispPostRenderAwait = 1;

		this.ispPostRenderObjects.push(obj);
	},


	ispIsPostRenderObject(obj) {
		return !!obj._ispPostRenderAwait;
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


	ispClipByPageFn(ctx) {
		let { left, top, width, height } = this.ispGetPageRect();

		ctx.rect(left, top, width, height);
	},


	ispClipByPage(active) {
		if (!active)
			return this.set({ clipTo: null });

		this.set({
			clipTo: this.ispClipByPageFn
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
		let _obj = this.ispGetObjects(arg);

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

		let ctx = obj.getMeasuringContext();

		ctx.font = `${obj.fontSize}px ${obj.fontFamily}`;

		let line = obj.text.split('\n').reduce((prevLine, nextLine) => {
			return nextLine.length > prevLine.length ? nextLine : prevLine;
		});

		obj.width = ctx.measureText(line).width;

		this.renderAll();
	}, 500),


	_renderOverlay(e) {
		let t = this.ispGetPage();

		if (!t)
			return null;

		let n = this.getWidth(),
		    r = this.getHeight(),
		    o = "rgba(0, 0, 0, 0.45)";

		e.save();
		e.globalCompositeOperation = "source-atop";
		e.beginPath();
		e.moveTo(-2, -2);
		e.lineTo(n + 2, -2);
		e.lineTo(n + 2, r + 2);
		e.lineTo(-2, r + 2);
		e.lineTo(-2, -2);
		e.transform.apply(e, this.viewportTransform);
		e.moveTo(0, 0);
		e.lineTo(0, t.ispGetHeight());
		e.lineTo(t.ispGetWidth(), t.ispGetHeight());
		e.lineTo(t.ispGetWidth(), 0);
		e.closePath();
		e.fillStyle = o;
		e.fill();
		e.restore();
	},


	_ispDrawSmartGuideLine: function(p1, p2) {
		let ctx = this.contextTop,
		    vpt = this.viewportTransform,
		    z = vpt[0];

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, vpt[4], vpt[5]);
		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.strokeStyle = _.get(this, 'ispGuidelines.smart.strokeStyle') || 'pink';
		ctx.strokeWidth = _.get(this, 'ispGuidelines.smart.strokeWidth') || 1;
		ctx.moveTo(p1.x * z, p1.y * z);
		ctx.lineTo(p2.x * z, p2.y * z);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	},


	_ispApplyGuidelines(obj, opt = {}) {
		let gl = this._ispPostRenderGuideLines,
		    _static = _.get(this, 'ispGuidelines.static'),
		    _smart = _.get(this, 'ispGuidelines.smart'),
		    page = this.ispGetPage();

		gl.splice(0, gl.length);

		if (_.get(_smart, 'snapTo.page'))
			gl.push.apply(gl, obj.ispSmartGuideToObject(page, opt));

		this.getObjects().forEach(o => {
			if (obj == o)
				return;

			if ('activeSelection' == obj.type) {
				if (obj.getObjects().some(o2 => o2 == o))
					return;

			} else if ('ISPFabricGuideline' == o.type) {
				if (!_static)
					return;

			} else if (!_.get(_smart, 'snapTo.objects')) {
				return;
			}

			gl.push.apply(gl, obj.ispSmartGuideToObject(o, opt));
		});
	}

});


module.exports = ISPFabricCanvas;
