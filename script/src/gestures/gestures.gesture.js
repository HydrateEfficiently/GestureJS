/*jslint browser:true*/
/*global _, CustomDomEvents, GestureJS */
define(function (require) {
	"use strict";

	// Imports
	var PointTracker = require("src/pointtracker"),
		CustomDomEvents = require("third/customdomevents");

	// Constants
	var GESTURE_EVENT_SUFFIX = "gesture",
		DEFAULT_MIN_POINTS = 1,
		DEFAULT_MAX_TIME = 500;

	// Statics
	var gesturesByElement = {},
		gestures = {},
		names = {};

	function Gesture(options) {
		checkOptionsExists(options);

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
		this._timeFired = 0;
	}

	Gesture.prototype.getTimeMilliseconds = function () {
		return this._time;
	};

	Gesture.prototype.getEarliestValidTime = function (currentTime) {
		return Math.max(this._timeFired, currentTime - this._time);
	};

	Gesture.prototype.getMinPoints = function () {
		return this._minPoints;
	};

	Gesture.prototype.register = function (element) {
		if (!gesturesByElement[element]) {
			gesturesByElement[element] = [];
			PointTracker.trackPointsOnElement(element);
			PointTracker.trackGesture(this);
		}
		this._elements.push(element);
	};

	Gesture.prototype._checkMatch = function (points) {
		if (this._isMatch(points)) {
			this._fireEvent();
		}
	};

	Gesture.prototype._fireEvent = function () {
		var eventName = "on" + this._name + GESTURE_EVENT_SUFFIX;
		_.each(this._elements, function (element) {
			element[eventName]();
		});
		this._timeFired = new Date().getTime();
	};

	Gesture.prototype._getLastTimeFired = function () {
		return this._timeFired;
	};

	function define(options) {
		return new Gesture(options);
	}

	function checkOptionsExists(options) {
		if (typeof (options) !== "object") {
			throw "An gesture must be defined with an options object.";
		}
	}

	return {
		define: define,
		_checkOptionsExists: checkOptionsExists
	};

});