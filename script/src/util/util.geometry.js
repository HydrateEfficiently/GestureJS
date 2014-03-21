/*global _, GestureJS */
(function () {
	"use strict";

	function interpolateForSpline(startPoint, endPoint, currentPoint, resolution, tension, func_x_y_t) {
			// Tension vectors
		var t1x = (startPoint.x - endPoint.x) * tension,
			t2x = (endPoint.x - currentPoint.x) * tension,
			t1y = (startPoint.y - endPoint.y) * tension,
			t2y = (endPoint.y - currentPoint.y) * tension,

			c1, c2, c3, c4, // Cardinals
			interpolationFactor;

		for (var step = 0; step < resolution; step++) {
			interpolationFactor = step / resolution;

			c1 = 2 * Math.pow(interpolationFactor, 3) - 3 * Math.pow(interpolationFactor, 2) + 1;
			c2 = -(2 * Math.pow(interpolationFactor, 3)) + 3 * Math.pow(interpolationFactor, 2);
			c3 = Math.pow(interpolationFactor, 3)  - 2 * Math.pow(interpolationFactor, 2) + interpolationFactor;
			c4 = Math.pow(interpolationFactor, 3) - Math.pow(interpolationFactor, 2);

			func_x_y_t(
				c1 * startPoint.x + c2 * endPoint.x + c3 * t1x + c4 * t2x,
				c1 * startPoint.y + c2 * endPoint.y + c3 * t1y + c4 * t2y,
				interpolationFactor);
		}
	}

	function getDistanceBetweenPoints(a, b) {
		var deltaX = b.x - a.x,
			deltaY = b.y - a.y;
		return Math.sqrt(Math.pow(deltaX, 2), Math.pow(deltaY, 2));
	}

	GestureJS.Util.Geometry = {
		interpolateForSpline: interpolateForSpline,
		getDistanceBetweenPoints: getDistanceBetweenPoints
	};
	
} ());