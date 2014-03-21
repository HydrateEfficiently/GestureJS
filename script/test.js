/*jslint browser:true*/
/*global Test, GestureJS, CustomDomEvents*/
function main() {
	"use strict";

	var testCanvas = document.getElementById("test-canvas"),
		testGesture = GestureJS.define({
			name: "test",
			time: 500,
			element: testCanvas,
			isMatch: function (points) {
				return false;
			}
		});

	initView(testCanvas);
}

function initView(canvasElement) {
	"use strict";

	var STROKE_COLOR_R = 255,
		STROKE_COLOR_G = 215,
		STROKE_COLOR_B = 0,
		BASE_STROKE_OPACITY = 1;

	var PointTracker = GestureJS.PointTracker;

	var canvasContext,
		width,
		height;

	canvasContext = canvasElement.getContext("2d");
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
			firstPoint = points[numberOfPoints - 1],
			currentTime = new Date().getTime(),
			pointLifetime = PointTracker.getPointLifetime(),
			timeToDeath,
			currentPoint,
			opacity;

		canvasElement.width = canvasElement.width; // Clear old path.

		if (firstPoint) {
			canvasContext.beginPath();
			canvasContext.moveTo(firstPoint.x, firstPoint.y);

			for (var i = numberOfPoints - 1; i >= 0; i--) {
				currentPoint = points[i];
				timeToDeath = Math.max(0, currentPoint.getTime() - currentTime + pointLifetime);
				opacity = 1; //BASE_STROKE_OPACITY * timeToDeath / pointLifetime;
				canvasContext.setStrokeColor(STROKE_COLOR_R, STROKE_COLOR_G, STROKE_COLOR_B, opacity);
				canvasContext.lineTo(currentPoint.x, currentPoint.y);
				canvasContext.lineWidth = 1;
				canvasContext.stroke();
			}
		}
	}
}