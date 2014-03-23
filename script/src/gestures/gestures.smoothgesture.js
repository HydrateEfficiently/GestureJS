define(function (require) {
	"use strict";

	var	Gesture = require("src/gestures/gestures.gesture"),
		GestureBox = require("src/gesturebox");

	Gesture.SmoothGesture = Gesture;

	function SmoothGesture(options) {
		Gesture._checkOptionsExists(options);
		this._boxesByWidthByHeight = [];
		this._createOrGetBox(1, options.pattern);
		options.isMatch = this._smoothPatternIsMatch;
		return Gesture.define.call(this, options);
	}

	SmoothGesture.prototype._smoothPatternIsMatch = function (gestureBox) {

	};

	SmoothGesture.prototype._createOrGetBox = function (points, width, height) {
		var boxesByWidth = this._boxesByWidthByHeight[width];
		if (!boxesByWidth) {
			boxesByWidth = this._boxesByWidthByHeight[width] = [];
		}

		var widthByHeight = boxesByWidth[height];
		if (!widthByHeight) {
			widthByHeight = boxesByWidth[height] = new GestureBox(points);
		}






		if (!this._boxesByScale) {
			this._boxesByScale = {};
			this._boxesByWidthScaleByHeightScale["1,1"] = new GestureBox(points);
		} else {

		}
	};


	function getBox(pattern) {
		return new GestureBox(pattern);
	}

	return SmoothGesture;
});