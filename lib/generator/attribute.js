/**
 * Created by parth on 20/6/15.
 */
'use strict';

/**
 * Constructor for attribute data type
 * @param impact
 * @param possibleValues
 * @param minValues
 * @param maxValues
 * @constructor
 */
var Attribute = function(impact, possibleValues, minValues, maxValues) {
    this.impact = impact;
    this.possibleValues = possibleValues;
    this.minValues = minValues;
    this.maxValues = maxValues;
};

/**
 * Generates random number in range of min (Inclusive) and max (Inclusive)
 * @param min
 * @param max
 * @returns {number}
 */
function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

/**
 * Returns random value of this attribute from the possibleValues.
 * @returns {*}
 */
Attribute.prototype.getRandom = function () {
    var cloned = this.possibleValues.slice(0);
    var valuesCount = getRandomNumber(this.minValues, this.maxValues);
    var arrIndex = 0;

    var output = [];

    while (valuesCount > 0) {
        arrIndex = getRandomNumber(1, cloned.length);
        output.push(cloned[arrIndex - 1]);
        cloned.splice(arrIndex - 1, 1);
        valuesCount--;
    }
    return (this.maxValues == 1 ? output[0] : output);
};

module.exports = Attribute;