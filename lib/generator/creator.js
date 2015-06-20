/**
 * Created by parth on 20/6/15.
 */
'use strict';

var seed = require('./seed');

module.exports = {
    createData: function (count, nameGenerator) {
        var current = null;
        var output = {
            companies: [],
            attributeMap: {},
            patterns: {}
        };

        while (count > 0) {
            current = {};
            Object.keys(seed.attributes).forEach(function (val) {
                current[val] = seed.attributes[val].getRandom();
            });
            current.name = nameGenerator(count);
            count--;

            output.companies.push(current);
        }

        Object.keys(seed.attributes).forEach(function (val) {
            output.attributeMap[val] = {};
            seed.attributes[val].possibleValues.forEach(function (possibleValue) {
                switch (seed.attributes[val].impact) {
                    case seed.impacts.PositiveImpact:
                        output.attributeMap[val][possibleValue] = 10;
                        break;
                    case seed.impacts.NegativeImpact:
                        output.attributeMap[val][possibleValue] = -10;
                        break;
                    case seed.impacts.BothImpact:
                    case seed.impacts.NoImpact:
                        output.attributeMap[val][possibleValue] = 0;
                        break;
                }
            });
        });

        return output;
    }
}

