/*global GestureJS */
define(function () {
	"use strict";

	function Point(x, y, time) {
		this.x = x;
		this.y = y;
		this._time = time;
		this._elements = [];
	}

	Point.prototype.getTime = function () {
		return this._time;
	};

	Point.prototype.addElement = function (element) {
		this._elements.push(element);
	};

	return Point;

});