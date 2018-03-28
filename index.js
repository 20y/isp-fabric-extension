'use strict';

module.exports = {

	initObjects(fabric = this.getFabric()) {
		fabric.ISPFabricCanvas            = require('./lib/objects/isp-fabric-canvas.js');
		fabric.ISPFabricPage              = require('./lib/objects/isp-fabric-page.js');
		fabric.ISPShapeBookmark           = require('./lib/objects/isp-shape-bookmark.js');
		fabric.ISPShapeBubble             = require('./lib/objects/isp-shape-bubble.js');
		fabric.ISPShapeBubbleRound        = require('./lib/objects/isp-shape-bubble-round.js');
		fabric.ISPShapeCertificate        = require('./lib/objects/isp-shape-certificate.js');
		fabric.ISPShapeHeart              = require('./lib/objects/isp-shape-heart.js');
		fabric.ISPShapeStar5              = require('./lib/objects/isp-shape-star-5.js');
		fabric.ISPTextbox                 = require('./lib/objects/isp-textbox.js');
		fabric.ISPShapePhoneIcon          = require('./lib/objects/isp-shape-phone-icon.js');
		fabric.ISPShapeLocationIcon       = require('./lib/objects/isp-shape-location-icon.js');
		fabric.ISPShapeClEnvelopIcon      = require('./lib/objects/isp-shape-cl-envelop-icon.js');
		fabric.ISPShapeVkIcon             = require('./lib/objects/isp-shape-vk-icon.js');
		fabric.ISPShapeInstagramIcon      = require('./lib/objects/isp-shape-instagram-icon.js');
		fabric.ISPShapeInternetIcon       = require('./lib/objects/isp-shape-internet-icon.js');
		fabric.ISPShapeOdnoklassnikiIcon  = require('./lib/objects/isp-shape-odnoklassniki-icon.js');
		fabric.ISPShapeFbIcon             = require('./lib/objects/isp-shape-fb-icon.js');
		fabric.ISPShapePlaceholderIcon    = require('./lib/objects/isp-shape-placeholder-icon.js');

		return fabric;
	},


	initShim(fabric = this.getFabric()) {
		require('./lib/shim/i-text.js').init(fabric);
		require('./lib/shim/image.js').init(fabric);
		require('./lib/shim/object.js').init(fabric);

		return fabric;
	},


	init(fabric = this.getFabric()) {
		this.initShim(fabric);
		this.initObjects(fabric);

		return fabric;
	},


	getFabric() {
		let fabric   = require('fabric');

		// модуль по разному экспортируется для nodejs и браузера
		return fabric.fabric || fabric;
	},


	utils: {
		geometry: require('isp-geometry').utils.geometry
	}

};
