/*global _, GestureJS */
define(function () {
	"use strict";

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

	function binarySearchByProperty(sortedArray, candidate, compare) {
		return _.sortedIndex(sortedArray, candidate, getIteratorForSortedIndex(compare));
	}

	function binaryInsert(sortedArray, candidate, compare) {
		var index = binarySearchByProperty(sortedArray, candidate, compare);
		sortedArray.insert(sortedArray, 0, candidate);
	}

	function binaryRemove(sortedArray, candidate, compare) {
		var index = binarySearchByProperty(sortedArray, candidate, compare),
			item = sortedArray[index],
			iteratorFunc = getIteratorForSortedIndex(compare),
			wasRemoved = false;

		if (iteratorFunc) { // Don't do default equality check.
			if (iteratorFunc(item) === iteratorFunc(candidate)) {
				sortedArray.splice(index, 1);
				wasRemoved = true;
			}
		} else if (item === candidate) {
			sortedArray.splice(index, 1);
			wasRemoved = true;
		}

		return wasRemoved;
	}

	function getIteratorForSortedIndex(compare) {
		if (typeof (compare) === "function") {
			return compare;
		} else if (typeof (compare) === "string") {
			return function (item) {
				return item[compare];
			};
		}
	}

	return {
		insert: insert,
		findAllUntil: findAllUntil,
		unshiftRange: unshiftRange,
		binarySearchByProperty: binarySearchByProperty
	};

});