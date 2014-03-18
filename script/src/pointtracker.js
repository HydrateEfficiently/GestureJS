/*global _, GestureJS, setInterval */
(function () {
	"use strict";

	// Imports
	var Point = GestureJS.Point,
		TwoWayMap = GestureJS.TwoWayMap,
		ArrayUtil = GestureJS.Util.Array;

	// Constants
	var	GESTURE_CHECK_INTERVAL = 100,
		EVENT_TRACKING_KEY = "__gesturejs_tracked";

	var points = [],
		pointsByTime = {},
		pointLifetime = 0,
		trackedGestures = {},
		trackedElements = {};

	function getPointLifetime() {
		return pointLifetime;
	}

	function getPoints() {
		return points.slice();
	}

	function getPointsSince(timestamp) {
		return ArrayUtil.findAllUntil(points, function (point) {
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
			var point = getPoint(ev);
			if (!point) {
				point = new Point(ev);
				ArrayUtil.insert(points, point);
				ev.EVENT_TRACKING_KEY = point.getTime();
				pointsByTime[point.getTime()] = point;
			}
			point.addElement(element);
		});
	}

	function getPoint(ev) {
		var time = ev[EVENT_TRACKING_KEY];
		if (!isNaN(time)) {
			return pointsByTime[time];
		}
	}

	function removeOldPoints() {
		var currentTime = new Date().getTime();
		var numberOfPoints = points.length,
			pointsToRemove = _.filter(points, function (point) {
				return currentTime > point.getTime() + pointLifetime;
			}),
			startIndex = numberOfPoints - pointsToRemove.length;

		points.splice(startIndex, pointsToRemove.length);
		_.each(pointsToRemove, function (point) {
			delete pointsByTime[point.getTime()];
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