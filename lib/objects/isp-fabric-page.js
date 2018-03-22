'use strict';

const
	fabric = require('./../../index.js').getFabric(),
	_size = require('../interfaces/size.js');


const ISPFabricPage = fabric.util.createClass(fabric.Rect, Object.assign({}, _size, {

	type: 'ISPFabricPage',


	fill: 'white',


	initialize(...args) {
		args.unshift('initialize');

		this.callSuper.apply(this, args);

		this.strokeWidth = 0;
	},


	/**
	 * Изменить ориентацию листа
	 *
	 * @param {String} orient - landscape, portrait
	 * */
	ispSetOrientation(orient) {
		if (this.ispGetOrientation() == orient)
			return;

		this.callSuper('ispSetOrientation', orient);

		let staticGuides = this.canvas.ispGetObjects({ type: 'ISPFabricGuideline' }),
		    group = new fabric.Group(staticGuides, { left: 0, top: 0 }),
		    center = this.getCenterPoint();

		group.rotate(90);
		group.setPositionByOrigin(center, 'center', 'center');

		staticGuides.forEach(obj => {
			if ('ISPFabricGuideline' != obj.type)
				return;

			obj.ispOrientation = obj.ispOrientation == 'vertical' ? 'horizontal' : 'vertical';
		});

		group.ungroupOnCanvas();

		this._ispResetScaleXToWidth();
		this._ispResetScaleYToHeight();

		this.setCoords();

		this.canvas.requestRenderAll();
	}

}));


ISPFabricPage.fromObject = function(object, callback) {
	return fabric.Object._fromObject('ISPFabricPage', object, callback);
};


module.exports = ISPFabricPage;