/*global _, GestureJS */
(function () {

	function insert(array, item, index) {
		array.splice(index, 0, item);
	}

	function unshiftRange(array, items) {
		array.unshift.apply(array, items);
	}

	function remove(array, index, count) {
		array.splice(index, count);
	}

	function findAllUntil(array, predicate) {
		var untilIndex = _.indexOf(array, predicate);
		if (untilIndex === -1) {
			return array.slice(); // All items match
		} else if (untilIndex === 0) {
			return []; // No items match
		} else {
			return array.slice(0, untilIndex - 1);
		}
	}

	GestureJS.Util.Array = {
		insert: insert,
		findAllUntil: findAllUntil,
		unshiftRange: unshiftRange
	};

} ());