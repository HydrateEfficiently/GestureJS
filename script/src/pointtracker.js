/*global _, GestureJS, setInterval */
define(function (require) {
	"use strict";

	// Imports
	var Point = require("src/point"),
		ArrayUtil = require("src/util/util.array"),
		GeometryUtil = require("src/util/util.geometry"),
		_ = require("third/lodash.min");

	// Constants
	var	GESTURE_CHECK_INTERVAL = 100,
		MIN_NUMBER_POINTS_FOR_INTERPOLATION = 3,
		INTERPOLATION_PIXEL_DIST = 5,
		SPLINE_TENSION = 0.5,
		EVENT_TRACKING_KEY = "__gesturejs_tracked";

	var recordedPoints = [],
		interpolatedPoints = [],
		pointsByTime = {},
		pointLifetime = 0,
		trackedGestures = {},
		trackedElements = {};

	function getPointLifetime() {
		return pointLifetime;
	}

	function getPoints() {
		return interpolatedPoints.slice();
	}

	function getPointsSince(timestamp) {
		return ArrayUtil.findAllUntil(interpolatedPoints, function (point) {
			return point.getTime() < timestamp;
		});
	}

	function trackPointsOnElement(element) {
		if (!trackedElements[element]) {
			trackedElements[element] = element;
			listenOnElement(element);
		}
	}

	function trackGesture(gesture) {
		if (!trackedGestures[gesture]) {
			trackedGestures[gesture] = gesture;
			pointLifetime = Math.max(pointLifetime, gesture.getTimeMilliseconds());
		}
	}

	function listenOnElement(element) {
		element.addEventListener("mousemove", function (ev) {
			recordedPoints.unshift(new Point(ev.x, ev.y, new Date().getTime()));
			addInterpolatedPoints();
		});
	}

	function addInterpolatedPoints() {
		var numberOfPoints = recordedPoints.length;
		if (numberOfPoints >= MIN_NUMBER_POINTS_FOR_INTERPOLATION) {
			var startPoint = recordedPoints[0],
				endPoint = recordedPoints[1],
				currentPoint = recordedPoints[2],
				startTime = startPoint.getTime(),
				endTime = endPoint.getTime(),
				deltaTime = endTime - startTime,
				interpolationFactor = getInterpolationFactor(startPoint, endPoint),
				points = [];

			GeometryUtil.interpolateForSpline(startPoint, endPoint, currentPoint, interpolationFactor, SPLINE_TENSION, function (x, y, t) {
				points.push(new Point(Math.round(x), Math.round(y), Math.round(startTime + deltaTime * t)));
			});

			ArrayUtil.unshiftRange(interpolatedPoints, points);
		}
	}

	function getInterpolationFactor(startPoint, endPoint) {
		var dist = GeometryUtil.getDistanceBetweenPoints(startPoint, endPoint);
		return Math.ceil(dist / INTERPOLATION_PIXEL_DIST);
	}

	function removeOldPoints() {
		var minTime = new Date().getTime() - pointLifetime,
			ixFirstExpiredRecordedPoint = indexOfFirstExpiredPoint(recordedPoints, minTime),
			ixFirstExpiredInterpolatedPoint = indexOfFirstExpiredPoint(interpolatedPoints, minTime);

		recordedPoints.splice(ixFirstExpiredRecordedPoint, recordedPoints.length - ixFirstExpiredRecordedPoint);
		interpolatedPoints.splice(ixFirstExpiredInterpolatedPoint, interpolatedPoints.length - ixFirstExpiredInterpolatedPoint);
	}

	function indexOfFirstExpiredPoint(points, minTime) {
		var dummyPoint = new Point(0, 0, minTime);
		return _.sortedIndex(points, dummyPoint, function (point) {
			return -point.getTime(); // Compare negative time to reverse index.
		});
	}

	setInterval(function () {
		removeOldPoints();
		_.each(trackedGestures, function (gesture) {
			var points = getPointsSince(gesture.getEarliestValidTime());
			if (points.length > gesture.getMinPoints()) {
				gesture._checkMatch(points);
			}
		});
	}, GESTURE_CHECK_INTERVAL);

	return {
		getPointLifetime: getPointLifetime,
		getPoints: getPoints,
		getPointsSince: getPointsSince,
		trackPointsOnElement: trackPointsOnElement,
		trackGesture: trackGesture
	};
	
});