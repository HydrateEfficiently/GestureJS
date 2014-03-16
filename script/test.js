/*jslint browser:true*/
/*global _*/
function main() {
	"use strict";

	var MAX_GESTURE_TIME = 500,
		SAMPLE_POINT_RESOLUTION = 1,
		STROKE_COLOR_R = 255,
		STROKE_COLOR_G = 215,
		STROKE_COLOR_B = 0,
		STROKE_OPACITY = 1;

	function onMouseDown(e) {
		isMouseDown = true;
	}

	function onMouseUp(e) {
		isMouseDown = false;
	}

	function onMouseMove(e) {
		if (!isMouseDown){
			return;
		}

		var lastPoint = currentGesture[0],
			currentPoint = new MousePoint(e),
			currentLength = currentGesture.length;

		removeOldPoints();
		sampleCounter++;
		if (sampleCounter === SAMPLE_POINT_RESOLUTION) {
			currentGesture.push(currentPoint);
			updateCanvas();
			sampleCounter = 0;
		}
	}

	function onMouseOver(e) {
		canvasContext.moveTo(e.x, e.y);
	}

	function onMouseOut(e) {
		isMouseDown = false;
		clearAllPoints();
	}

	function clearAllPoints() {
		currentGesture.length = 0;
	}

	function removeOldPoints() {
		var currentTime = new Date().getTime();
		_.reject(currentGesture, function (point) {
			return currentTime > point.time + MAX_GESTURE_TIME;
		});
	}

	function updateCanvas() {
		var numberOfPoints = currentGesture.length,
			firstPoint = currentGesture[numberOfPoints - 1],
			currentTime = new Date().getTime(),
			timeToDeath,
			currentPoint;

		testCanvas.width = testCanvas.width; // Clear old path.

		if (firstPoint) {
			canvasContext.beginPath();
			canvasContext.moveTo(firstPoint.x, firstPoint.y);

			for (var i = numberOfPoints - 1; i >= 0; i--) {
				currentPoint = currentGesture[i];
				timeToDeath = Math.max(0, currentPoint.time - currentTime + MAX_GESTURE_TIME);
				canvasContext.setStrokeColor(STROKE_COLOR_R, STROKE_COLOR_G, STROKE_COLOR_B, STROKE_OPACITY * timeToDeath / MAX_GESTURE_TIME);
				canvasContext.lineTo(currentPoint.x, currentPoint.y);
				canvasContext.stroke();
			}
		}
	}

	function setSize() {
		width = testCanvas.clientWidth;
		height = testCanvas.clientHeight;
		testCanvas.setAttribute("width", width);
		testCanvas.setAttribute("height", height);
	}

	var testCanvas = document.getElementById("test-canvas"),
		canvasContext = testCanvas.getContext("2d"),
		currentGesture = [],
		sampleCounter = 0,
		isMouseDown = false,
		width, height;

	setInterval(function () {
		removeOldPoints();
		updateCanvas();
	}, 50);

	testCanvas.addEventListener("mousemove", onMouseMove);
	testCanvas.addEventListener("mouseout", onMouseOut);
	testCanvas.addEventListener("mousedown", onMouseDown);
	testCanvas.addEventListener("mouseup", onMouseUp);
	window.onresize = setSize;
	setSize();
}

function MousePoint(e) {
	this.x = e.x;
	this.y = e.y;
	this.time = new Date().getTime();
}