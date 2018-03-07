'use strict';

module.exports = {

	/**
	 * Сдвинуть объект на указанное расстояние
	 *
	 * @param offsetX - смещение по оси X (горизонтальное смещение)
	 * @param offsetY - смещенеи по оси Y (вертикальное смещение)
	 * */
	ispMoveBy(offsetX, offsetY) {
		this.set('left', this.get('left') + offsetX);
		this.set('top', this.get('top') + offsetY);

		this.canvas.fire('object:modified', {
			target: this
		});

		this.canvas.renderAll();
	}

};
