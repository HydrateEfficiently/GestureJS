define(function (require) {
	"use strict";

	var _ = require("third/lodash.min"),
		ArrayUtil = require("src/util/util.array");

	function GestureBox(options) {
		var points = Array.isArray(options) ? options : options.points || null;
		if (points) {
			this._points = [];
			this._xValues = [];
			this._yValues = [];
			_.each(points, this.addPoint);
		} else if (options.gestureBox) {
			var gestureBox = options.gestureBox;
			this._points = gestureBox._points.slice();
			this._xValues = gestureBox._xValues.slice();
			this._yValues = gestureBox._yValues.slice();
		}
	}
	
	GestureBox.prototype.addPoint = function(point) {
		this._points.unshift(point);
		this._xValues.splice(_.sortedIndex(this._xValues, point.x), 0, point.x);
		this._yValues.splice(_.sortedIndex(this._yValues, point.x), 0, point.x);
	};

	GestureBox.prototype.removePoint = function(gestureBox) {

	};

	GestureBox.prototype.getSize = function() {
		var numberOfPoints = this._points.length;
		return {
			width: this._pointsByX[numberOfPoints - 1],
			height: this._pointsByY[numberOfPoints - 1]
		};
	};

	GestureBox.prototype.clone = function(gestureBox) {
		return new GestureBox({ gestureBox: gestureBox });
	};

	GestureBox.prototype.scaleByWidth = function(gestureBox, scale) {

	};

	GestureBox.prototype.matches = function(other) {

	};

	return GestureBox;

});