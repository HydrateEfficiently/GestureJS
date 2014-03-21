/*global _, GestureJS, setInterval */
(function () {
	"use strict";

	// Imports
	var Point = GestureJS.Point,
		Util = GestureJS.Util,
		ArrayUtil = Util.Array,
		GeometryUtil = Util.Geometry;

	// Constants
	var	GESTURE_CHECK_INTERVAL = 100,
		MIN_NUMBER_POINTS_FOR_INTERPOLATION = 3,
		INTERPOLATION_FACTOR = 5,
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
			pointLifetime = Math.max(pointLifetime, gesture.getTime());
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
				points = [];

			GeometryUtil.interpolateForSpline(startPoint, endPoint, currentPoint, INTERPOLATION_FACTOR, SPLINE_TENSION, function (x, y, t) {
				points.push(new Point(Math.round(x), Math.round(y), Math.round(startTime + deltaTime * t)));
			});

			ArrayUtil.unshiftRange(interpolatedPoints, points);
		}
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
			gesture._checkMatch(getPointsSince(gesture.getTime()));
		});
	}, GESTURE_CHECK_INTERVAL);

	GestureJS.PointTracker = {
		getPointLifetime: getPointLifetime,
		getPoints: getPoints,
		getPointsSince: getPointsSince,
		trackPointsOnElement: trackPointsOnElement,
		trackGesture: trackGesture
	};
	
} ());