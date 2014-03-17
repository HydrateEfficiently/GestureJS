/*global _, GestureJS */
(function () {
	"use strict";

	// Imports
	var ArrayUtil = GestureJS.Util.Array;

	// Constants
	var DEFAULT_POINT_LIFETIME_MS = 1000;

	var points = [],
		pointLifetime = DEFAULT_POINT_LIFETIME_MS;

	function getPointLifetime() {
		return pointLifetime;
	}

	function setPointLifetime(timeMs) {
		pointLifetime = timeMs;
	}

	function addPoint(point) {
		ArrayUtil.insert(points, point);
	}

	function getPointsSince(timestamp) {
		return ArrayUtil.findAllUntil(points, function (point) {
			return point.getTime() < timestamp;
		});
	}

	GestureJS.PointTracker = {
		getPointLifetime: getPointLifetime,
		setPointLifetime: setPointLifetime,
		addPoint: addPoint,
		getPointsSince: getPointsSince
	};
	
} ());