'use strict';

const
	fabric = require('./../../index.js').getFabric();


const ISPFabricGuideline = fabric.util.createClass(fabric.Object, {

	type: 'ISPFabricGuideline',


	initialize(...args) {
		args.unshift('initialize');

		this.width = 0;
		this.height = 0;
		this.fill = 'white';
		this.lineWidth = 1;
		this.strokeStyle = 'cyan';
		this.printable = false;
		this.selectable = false;
		this.objPanVis = false;
		this.lockMovementX = true;
		this.lockMovementY = true;
		this.lockRotation = true;
		this.lockScalingX = true;
		this.lockScalingY = true;
		this.lockUniScaling = true;
		this.locked = true;
		this.ispOrientation = 'vertical';

		this.callSuper.apply(this, args);
	},


	render() {
		let c = this.canvas,
		    ctx = c.getContext();

		if (
			   !c.ispGuidelines
			|| !c.ispGuidelines.static
			|| c.get('clipTo') == c.ispClipByPageFn
		) {
			return;
		}

		// отрисовать в последн. очередь, поверх всех
		if (!c.ispIsPostRenderObject(this))
			return c.ispAddPostRenderObject(this);

		// reset transform
		// idx: 0, 1, 2, 3, 4, 5
		// val: 1, 0, 0, 1, 0, 0

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.beginPath();
		ctx.lineWidth = this.lineWidth;
		ctx.strokeStyle = this.strokeStyle;

		let x = this.ispGetLeft({ vpt: 1 }),
		    y = this.ispGetTop({ vpt: 1 });

		if ('vertical' === this.ispOrientation) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, c.height);

		} else {
			ctx.moveTo(0, y);
			ctx.lineTo(c.width, y);
		}

		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	},


	toObject(props) {
		if (!props)
			props = [];

		props.push.apply(props, ['ispOrientation']);

		return this.callSuper('toObject', props);
	},

});


ISPFabricGuideline.fromObject = function(object, callback) {
	return fabric.Object._fromObject('ISPFabricGuideline', object, callback);
};


module.exports = ISPFabricGuideline;