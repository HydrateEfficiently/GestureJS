/*jslint browser:true*/
/*global _, CustomDomEvents, GestureJS */
(function () {
	"use strict";

	// Imports
	var GesturePoint = GestureJS.Point,
		PointTracker = GestureJS.PointTracker;

	// Export
	GestureJS.Gestures.IGesture = IGesture;

	// Constants
	var GESTURE_EVENT_SUFFIX = "gesture";

	// Statics
	var gesturesByElement = {},
		gestures = {};

	function IGesture(options) {
		this.geometryGroup = options.geometryGroup;
		this._name = options.name;
		this._time = isNaN(options.time) ? 500 : options._time;
		this._elements = [];
		PointTracker.setPointLifetime(Math.max(this.getTime(), PointTracker.getPointLifetime()));
		CustomDomEvents.registerEventType(this._name);
	}

	IGesture.prototype.getTime = function () {
		return this._time;
	};

	IGesture.prototype.register = function (element) {
		if (!gesturesByElement[element]) {
			gesturesByElement[element] = [];
			listenOnElement(element);
		}
		gesturesByElement.push(this);
		this._elements.push(element);
	};

	IGesture.prototype._checkMatched = function () {
		var points = PointTracker.getPointsSince(this._time);
		if (this.isMatch(points)) {
			this._fireEvent();
		}
	};

	IGesture.prototype._fireEvent = function () {
		var eventName = "on" + this._name + GESTURE_EVENT_SUFFIX;
		_.each(this._elements, function (element) {
			element[eventName]();
		});
	};

	function listenOnElement(element) {

	}

} ());