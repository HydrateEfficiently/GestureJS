/*jslint browser:true*/
/*global _, CustomDomEvents */
(function () {
	"use strict";

	function Gesture(config) {
		this.geometryGroup = config.geometryGroup;
		this.name = config.name;
		this.timeLimit = isNaN(config.timeLimit) ? 500 : config.timeLimit;
		CustomDomEvents.registerEventType(this.name);
	}

} ());