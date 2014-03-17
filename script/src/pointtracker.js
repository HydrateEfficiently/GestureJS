/*global _, GestureJS, setInterval */
(function () {
	"use strict";

	// Imports
	var Point = GestureJS.Point,
		TwoWayMap = GestureJS.TwoWayMap,
		ArrayUtil = GestureJS.Util.Array;

	// Constants
	var	GESTURE_CHECK_INTERVAL = 50;

	var points = [],
		pointsEventsMap = new TwoWayMap(),
		pointLifetime = 0,
		trackedGestures = {},
		trackedElements = {};

	function addPoint(ev) {
		// TODO: find vectors from last two points to create nice curve to link. 
		var point = new Point(ev);
		pointsEventsMap.add(point, ev);
		ArrayUtil.insert(points, point);
	}

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
		element.addEventListener("mouseover", function (ev) {
			var trackedPoint = pointsEventsMap.get(ev);
			if (!trackedPoint) {
				addPoint(ev);
				trackedPoint = pointsEventsMap.get(ev);
			}
			trackedPoint.addElement(element);
		});
	}

	function removeOldPoints() {
		var currentTime = new Date().getTime(),
			removedPoints = _.reject(points, function (point) {
				return currentTime > point.time + pointLifetime;
			});
		_.each(removedPoints, function (point) {
			pointsEventsMap.remove(point);
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