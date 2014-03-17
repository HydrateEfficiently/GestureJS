/*global GestureJS */
(function () {
	"use strict";

	GestureJS.Point = Point;

	function Point(ev) {
		this._x = ev.x;
		this._y = ev.y;
		this._time = new Date().getTime();
	}

	Point.prototype.getX = function () {
		return this._x;
	};

	Point.prototype.getY = function () {
		return this._y;
	};

	Point.prototype.getXY = function () {
		return { x: this._x, y: this._y };
	};

	Point.prototype.getTime = function () {
		return this._time;
	};

} ());