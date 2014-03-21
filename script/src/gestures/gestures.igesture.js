/*jslint browser:true*/
/*global _, CustomDomEvents, GestureJS */
(function () {
	"use strict";

	// Imports
	var GesturePoint = GestureJS.Point,
		PointTracker = GestureJS.PointTracker;

	// Export
	GestureJS.define = function (config) {
		return new IGesture(config);
	};

	// Constants
	var GESTURE_EVENT_SUFFIX = "gesture",
		DEFAULT_MIN_POINTS = 1,
		DEFAULT_MAX_TIME = 500;

	// Statics
	var gesturesByElement = {},
		gestures = {},
		names = {};

	function IGesture(options) {
		if (typeof (options) !== "object") {
			throw "An gesture must be defined with an options object.";
		}

		if (typeof (options.isMatch) === "function") {
			this._isMatch = options.isMatch;
		} else {
			throw "Must define isMatch function.";
		}

		var name = options.name;
		if (!name) {
			throw "Must define a name for gesture.";
		} else if (names[name]) {
			throw "Gesture with name " + name + " has already been defined.";
		}

		if (options.element) {
			this._elements = [];
			this._elements.push(options.element);
		} else if (options.elements) {
			if (Array.isArray(options.elements)) {
				this._elements = options.elements.slice();
			} else {
				throw "elements option must be an array";
			}
		} else {
			this._elements = [];
		}

		this._minPoints = isNaN(options.minPoints) ? DEFAULT_MIN_POINTS : options.minPoints;
		this._time = isNaN(options.time) ? DEFAULT_MAX_TIME : options.time;
		if (this._elements[0]) {
			this.register(this._elements[0]);
		}
		CustomDomEvents.registerEventType(name);
		this._name = name;
	}

	IGesture.prototype.getMaxTime = function () {
		return this._time;
	};

	IGesture.prototype.getMinPoints = function () {
		return this._minPoints;
	};

	IGesture.prototype.register = function (element) {
		if (!gesturesByElement[element]) {
			gesturesByElement[element] = [];
			PointTracker.trackPointsOnElement(element);
			PointTracker.trackGesture(this);
		}
		this._elements.push(element);
	};

	IGesture.prototype._checkMatch = function (points) {
		if (this._isMatch(points)) {
			this._fireEvent();
		}
	};

	IGesture.prototype._fireEvent = function () {
		var eventName = "on" + this._name + GESTURE_EVENT_SUFFIX;
		_.each(this._elements, function (element) {
			element[eventName]();
		});
	};

} ());