/*jslint browser:true*/
/*global _, GestureJS */
(function () {
	"use strict";

	// Imports
	var GesturePoint = GestureJS.Point,
		PointTracker = GestureJS.PointTracker,
		GestureBox = GestureJS.GestureBox,
		Gesture = GestureJS.Gesture;

	// Export
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
	
} ());