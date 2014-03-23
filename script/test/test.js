/*jslint browser:true*/
define(function (require) {
	"use strict";

	var GestureJS = require("src/gestures/gestures.gesture"),
		PointTracker = require("src/pointtracker"),
		SmoothGesture = require("src/gestures/gestures.smoothgesture");

	return {
		init: function() {

			var STROKE_COLOR_R = 255,
				STROKE_COLOR_G = 215,
				STROKE_COLOR_B = 0,
				BASE_STROKE_OPACITY = 1;

			var canvasElement = document.getElementById("test-canvas"),

				testGesture = GestureJS.define({
					name: "test",
					time: 500,
					minPoints: 10,
					element: canvasElement,
					isMatch: function (points) {
						return false;
					}
				}),

				smoothGesture = new SmoothGesture({
					name: "spiral"
				}),

				ctx,
				width,
				height;

			ctx = canvasElement.getContext("2d");
			window.onresize = setSize;
			canvasElement.addEventListener("mousemove", updateCanvas);
			setInterval(updateCanvas, 50);
			setSize();

			function setSize() {
				var width = canvasElement.clientWidth;
				var height = canvasElement.clientHeight;
				canvasElement.setAttribute("width", width);
				canvasElement.setAttribute("height", height);
			}

			function updateCanvas() {
				var points = PointTracker.getPoints(),
					numberOfPoints = points.length,
					firstPoint = points[0],
					currentTime = new Date().getTime(),
					currentPoint;

				canvasElement.width = canvasElement.width; // Clear old path.
				ctx.lineWidth = 2;

				if (firstPoint) {
					ctx.beginPath();
					ctx.moveTo(firstPoint.x, firstPoint.y);

					for (var i = 1; i < numberOfPoints - 1; i++) {
						currentPoint = points[i];
						setStrokeColor(ctx, currentPoint, currentTime);
						ctx.lineTo(currentPoint.x, currentPoint.y);
						ctx.stroke();
					}
				}
			}

			function setStrokeColor(ctx, point, time) {
				var pointLifetime = PointTracker.getPointLifetime(),
					timeToDeath = Math.max(0, point.getTime() - time + pointLifetime),
					opacity = BASE_STROKE_OPACITY * timeToDeath / pointLifetime;
				ctx.setStrokeColor(STROKE_COLOR_R, STROKE_COLOR_G, STROKE_COLOR_B, opacity);
			}
		}
	};		
});