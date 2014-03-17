/*global GestureJS */
(function () {
	"use strict";

	GestureJS.Point = Point;

	function Point(ev) {
		this._x = ev.x;
		this._y = ev.y;
		this._time = new Date().getTime();
		this._elements = [];
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

	Point.prototype.addElement = function (element) {
		this._elements.push(element);
	};

} ());