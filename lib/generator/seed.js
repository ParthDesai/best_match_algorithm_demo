/**
 * Created by parth on 20/6/15.
 */
'use strict';

var Attribute = require('./attribute');

var impacts =  {
    PositiveImpact: 1,
    NegativeImpact: -1,
    BothImpact: 0,
    NoImpact: 2
};

/**
 * Denotes the attribute of company and type of attribute and possible values. (positive or negative or neutral)
 * @type {{domain: (Attribute|exports|module.exports), post: (Attribute|exports|module.exports), perk: (Attribute|exports|module.exports), miscAttribute1: (Attribute|exports|module.exports), miscAttribute2: (Attribute|exports|module.exports), miscAttribute3: (Attribute|exports|module.exports), miscAttribute4: (Attribute|exports|module.exports)}}
 *
 */
var attributes = {
    domain: new Attribute(impacts.BothImpact,
        ['Telecom', 'Electrical', 'Computer science', 'IT', 'Mechanical'], 1, 1),
    post: new Attribute(impacts.NoImpact,
        ['Software engineer', 'Senior software engineer', 'Team leader', 'Manager', 'Engineer', 'Support'], 1, 6),
    perk: new Attribute(impacts.PositiveImpact,
        ['Work from home', 'Unlimited vacation', 'Equity', 'Free food', 'Flexible Timings', 'Unlimited sick leaves'],
        1, 6),
    miscAttribute1: new Attribute(impacts.BothImpact,
        ['ABC', 'DEF', 'XYZ', 'NLP', 'PNG', 'FUP', 'CDE'], 1, 1),
    miscAttribute2: new Attribute(impacts.BothImpact,
        ['CAD', 'NFG', 'KHP', 'BGT', 'JGF'], 1, 1),
    miscAttribute3: new Attribute(impacts.NegativeImpact,
        ['2 year bond', 'Don\'t talk', ' '], 1, 1),
    miscAttribute4: new Attribute(impacts.NegativeImpact,
        ['Work on weekends', 'No training', ' '], 1, 1)
};

module.exports = {
    impacts: impacts,
    attributes: attributes
};

