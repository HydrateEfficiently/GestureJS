(function () {

	var customEventTypesRegister = {};
	var customEventTypesByElement = {};

	var nativeAddEventListener = EventTarget.prototype.addEventListener;
	var nativeRemoveEventListener = EventTarget.prototype.removeEventListener;

	EventTarget.prototype.addEventListener = function(type, listener) {
		addCustomEventToElement(this, type);
		if (isRegisteredCustomEventType(type)) {
			customAddEventListener(this, type, listener);
		} else {
			nativeAddEventListener.apply(this, arguments);
		}
	};

	EventTarget.prototype.removeEventListener = function(type, listener) {
		if (isRegisteredCustomEventType(type)) {
			customRemoveEventListener(this, type, listener);
		} else {
			nativeRemoveEventListener.apply(this, arguments);
		}
	};

	function registerEventType(eventType) {
		customEventTypesRegister[eventType] = 1;
	}

	function isRegisteredCustomEventType(eventType) {
		return !!customEventTypesRegister[eventType];
	}

	function addCustomEventToElement(element, eventType) {
		if (element[getEventName(eventType)] === undefined) {
			if (isRegisteredCustomEventType(eventType)) {
				doAddCustomEventToElement(element, eventType);
			} else {
				throw "Event type " + eventType + " does not exist. You can add it by calling CustomDomEvents.registerEventType(\"" + eventType +"\")";
			}
		}
	}

	function doAddCustomEventToElement(element, eventType) {
		var customEventTypes = getCustomEventsTypesForElement(element);
		if (!customEventTypes[eventType]) {
			var customEventListeners = [];
			element[getEventName(eventType)] = function () {
				var length = customEventListeners.length, i;
				for (i = 0; i < length; i++) {
					customEventListeners[i].apply(this, arguments);
				}
			};
			customEventTypes[eventType] = customEventListeners;
		}
	}

	function getCustomEventsTypesForElement(element) {
		if (!customEventTypesByElement[element]) {
			customEventTypesByElement[element] = {};
		}
		return customEventTypesByElement[element];
	}

	function customAddEventListener(element, eventType, listener) {
		var customEventTypes = getCustomEventsTypesForElement(element);
		customEventTypes[eventType].push(listener);
	}

	function customRemoveEventListener(element, eventType, listener) {
		var customEventTypes = getCustomEventsTypesForElement(element),
			customEventListeners = customEventTypes[eventType],
			index = customEventListeners.indexOf(listener);
		customEventListeners.splice(index, 1);
	}

	function getEventName(eventType) {
		return "on" + eventType;
	}

	window.CustomDomEvents = {
		registerEventType: registerEventType
	};
	
} ());