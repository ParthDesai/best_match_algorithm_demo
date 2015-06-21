/**
 * Created by parth on 20/6/15.
 */
'use strict';

var crypto = require('crypto');
var seed = require('./generator/seed');


var predictDecision = function (value) {
    if (value >= 0) {
        return true;
    } else {
        return false;
    }
};

/**
 * This method analyze attribute given in the parameter and
 * add information to the analysis object. (Basically its impact and it's weight
 * @param company Company object
 * @param analysis Analysis of company object based on recent results
 * @param attrib attribute of the company
 * @param value value of the attribute
 * @param impact Impact of the attribute
 * @param attributeMap AttributeMap which holds weight for the attributes
 */
var analyzeAttribute = function (company, analysis, attrib, value, impact, attributeMap) {
    switch(impact) {
        case seed.impacts.PositiveImpact:
        case seed.impacts.BothImpact:
            if (analysis.PositiveProperty[attrib]) {
                analysis.PositiveProperty[attrib].push(value);
            } else {
                analysis.PositiveProperty[attrib] = [value];
            }
            analysis.PositiveCount += 1;
            analysis.PositiveWeight += attributeMap[attrib][value];
            break;
        case seed.impacts.NegativeImpact:
            if (analysis.NegativeProperty[attrib]) {
                analysis.NegativeProperty[attrib].push(value);
            } else {
                analysis.NegativeProperty[attrib] = [value];
            }
            analysis.NegativeCount += 1;
            analysis.NegativeWeight += Math.abs(attributeMap[attrib][value]);
            break;
    }
};

/**
 * This method analyze the recent conflict and prepare analysis object of the company attributes.
 * This analysis object holds data about number of positive or negative property, and values of those.
 * This object is then used to modify attributeMap to store the 'learning'
 * @param company Company object
 * @param attributeMap AttributeMap which holds weight for the attributes
 * @returns {{PositiveProperty: {}, NegativeProperty: {}, PositiveWeight: number, NegativeWeight: number, PositiveCount: number, NegativeCount: number}}
 */
var extrapolateValues = function (company, attributeMap) {
    var analysis = {
        PositiveProperty: {},
        NegativeProperty: {},

        PositiveWeight: 0,
        NegativeWeight: 0,

        PositiveCount : 0,
        NegativeCount : 0
    };
    Object.keys(seed.attributes).forEach(function (attrib) {
        if (seed.attributes[attrib].maxValues === 1) {
            analyzeAttribute(company, analysis, attrib,
                company[attrib], seed.attributes[attrib].impact, attributeMap);
        } else {
            company[attrib].forEach(function (value) {
               analyzeAttribute(company, analysis, attrib, value,
                   seed.attributes[attrib].impact, attributeMap);
            });
        }
    });
    return analysis;
};

/**
 * Reflect the 'learning' into the data. i.e Reassigns attribute map based on current choices made by user.
 * This is core of learning.
 * @param company
 * @param decisionMade Decision made by user.
 * @param attributeMap
 */
var reevaluateAttributes = function (company, decisionMade, attributeMap) {
    var analysis = extrapolateValues(company, attributeMap);
    var attributeToAdd = decisionMade ? analysis.PositiveProperty : analysis.NegativeProperty;
    var attributeCount = decisionMade ? analysis.PositiveCount : analysis.NegativeCount;
    var addPerAttribute = decisionMade ? analysis.NegativeWeight / attributeCount :
    (-1) * analysis.PositiveWeight / attributeCount;

    Object.keys(attributeToAdd).forEach(function (attrib) {
        if (!attributeToAdd[attrib]) {
            return;
        }
        attributeToAdd[attrib].forEach(function (value) {
            attributeMap[attrib][value] += addPerAttribute;
        });
    });
};

/**
 * Calculates the value (or score) of the company. This score is used while predicting next best choice for candidate.
 * This value changes over the life-time of this program.
 * @param company
 * @param attributesMap
 * @returns {number}
 */
var companyValue = function (company, attributesMap) {
    var value = 0;

    Object.keys(seed.attributes).forEach(function (attrib) {
       if (seed.attributes[attrib].maxValues == 1) {
           value += attributesMap[attrib][company[attrib]];
       } else {
           company[attrib].forEach(function (val) {
              value += attributesMap[attrib][val];
           });
       }
    });

    return Math.round(value);
};

/**
 * (Exported function)
 * Reevaluates ('learns') current attribute map based on current user choice.
 * It constantly adapts to the user's choice.
 * @param context Context is object that stores all contextual information (companies, attributeMap etc.).
 * @param company
 * @param companyPrediction
 * @param userDecision
 */
var reevaluate = function (context, company, companyPrediction, userDecision) {
    if (companyPrediction === userDecision) {
        return;
    }
    reevaluateAttributes(company, userDecision, context.attributeMap);
};

/**
 * Gets the next best company for user and also prediction of user choice.
 * @param context
 * @returns {{company: null, decision: boolean}}
 */
var getNextCompanyPrediction = function (context) {
    var companyValues = {};
    var prediction = {
        company: null,
        decision: false
    };
    /*
    sorting in descending order.
     */
    context.companies.sort(function (first, second) {
        if (!companyValues[first.name]) {
            companyValues[first.name] = companyValue(first, context.attributeMap);
        }
        if (!companyValues[second.name]) {
            companyValues[second.name] = companyValue(second, context.attributeMap);
        }
        return companyValues[first.name] - companyValues[second.name];
    });
    prediction.company = context.companies.pop();
    prediction.decision = predictDecision(companyValues[prediction.company.name]);
    prediction.score = companyValues[prediction.company.name];
    return prediction;
};


module.exports = {
    reevaluate: reevaluate,
    getNextCompanyPrediction: getNextCompanyPrediction
};
