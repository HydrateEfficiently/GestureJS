/*global _, GestureJS */
(function () {
	"use strict";

	GestureJS.TwoWayMap = TwoWayMap;

	function TwoWayMap() {
		this._map = {};
		this._reverseMap = {};
	}

	TwoWayMap.prototype.add = function (entry1, entry2) {
		this._map[entry1] = entry2;
		this._reverseMap[entry2] = entry1;
	};

	TwoWayMap.prototype.get = function (entry) {
		return this._map[entry] || this._reverseMap[entry] || null;
	};

	TwoWayMap.prototype.remove = function (entry) {
		var removedEntry = null;
		if (this._map[entry]) {
			removedEntry = this._map[entry];
			delete this._map[entry];
			delete this._reverseMap[removedEntry];
		} else if (this._reverseMap[entry]) {
			removedEntry = this._reverseMap[entry];
			delete this._reverseMap[entry];
			delete this._map[removedEntry];
		}
		return removedEntry;
	};
	
} ());