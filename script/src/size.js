(define(function() {

	function Size(width, height) {
		this.width = width;
		this.height = height;
	}

	Size.prototype.equals = function(other) {
		return this.width === other.width && this.height === other.height;
	};

	Size.prototype.toString = function() {
		return "width:" + width + "_height:" + height;
	};
	
}));