'use strict';

module.exports = {

	/**
	 * Сдвинуть объект на указанное расстояние
	 *
	 * @param offsetX - смещение по оси X (горизонтальное смещение)
	 * @param offsetY - смещенеи по оси Y (вертикальное смещение)
	 * */
	padding: 8,

	borderColor: '#ddd',

	cornerColor: '#00abdc',

	cornerStrokeColor: '#00abdc',

	cornerSize: 11,

	transparentCorners: false,

	ispCornerStyle: {
		mtr: (() => {
			if (typeof Image == 'undefined')
				return;

			var img = new Image();

			img.src = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIGQ9Ik01MTIsMTkySDMyMGw3MS43NjYtNzEuNzY1QzM1NS41LDgzLjk3MiwzMDcuMjg1LDY0LDI1Niw2NHMtOTkuNSwxOS45NzItMTM1Ljc2NSw1Ni4yMzVDODMuOTcyLDE1Ni41LDY0LDIwNC43MTUsNjQsMjU2ICAgczE5Ljk3Miw5OS41LDU2LjIzNSwxMzUuNzY2QzE1Ni41LDQyOC4wMjgsMjA0LjcxNSw0NDgsMjU2LDQ0OHM5OS41LTE5Ljk3MiwxMzUuNzY0LTU2LjIzNmMzLjAyOS0zLjAyNyw1LjkzMi02LjE0Niw4LjcyOS05LjMzNCAgIGw0OC4xNiw0Mi4xNDNDNDAxLjcyOSw0NzguMTU0LDMzMi44Miw1MTIsMjU2LDUxMkMxMTQuNjE1LDUxMiwwLDM5Ny4zODUsMCwyNTZTMTE0LjYxNSwwLDI1NiwwICAgYzcwLjY5MywwLDEzNC42ODQsMjguNjYzLDE4MS4wMDgsNzQuOTkyTDUxMiwwVjE5MnoiIGZpbGw9IiNGRkZGRkYiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K';

			return img;
		})()
	}

};
