requirejs.config({
	baseUrl: "script",
	shim: {
		"third/customdomevents" : {
			exports: "CustomDomEvents"
		}
	}
});