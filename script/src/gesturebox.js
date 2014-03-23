define(function (require) {
	"use strict";

	var _ = require("third/lodash.min"),
		ArrayUtil = require("src/util/util.array"),
		Point = require("src/point"),
		Size = require("src/size");

	function GestureBox(points) {
		if (points) {
			this._points = {};
			this._xValues = [];
			this._yValues = [];
			_.each(points, this.addPoint);
		}
	}

	GestureBox.prototype.addPoint = function(point) {
		this._points[point.getTime()] = point;
		ArrayUtil.binaryInsert(this._xValues, point.x);
		ArrayUtil.binaryInsert(this._yValues, point.y);
	};

	GestureBox.prototype.removePoint = function(point) {
		delete this._points[point.getTime()];
		ArrayUtil.binaryRemove(this._xValues, point.x);
		ArrayUtil.binaryRemove(this._yValues, point.y);
	};

	GestureBox.prototype.clone = function() {
		var gestureBox = new GestureBox();
		gestureBox._points = this._points.slice();
		gestureBox._xValues = this._xValues.slice();
		gestureBox._yValues = this._yValues.slice();
		return gestureBox;
	};

	GestureBox.prototype.scale = function(scale) {
		this._points = _.map(this._points, function (point) {
			return new Point(point.x * scale, point.y * scale);
		});

		var length = this._points.length,
			i;

		for (i = 0; i < length; i++) {
			this._xValues[i] *= scale;
			this._yValues[i] *= scale;
		}
	};

	GestureBox.prototype.getSize = function() {
		var numberOfPoints = this._points.length;
		return new Size(this._pointsByX[numberOfPoints - 1], this._pointsByY[numberOfPoints - 1]);
	};

	return GestureBox;

});