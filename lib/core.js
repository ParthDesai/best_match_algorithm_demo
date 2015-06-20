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
}

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
}

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
}

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
        })
    });
}

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
}

var reevaluate = function (context, company, companyPrediction, userDecision) {
    if (companyPrediction === userDecision) {
        return;
    }
    reevaluateAttributes(company, userDecision, context.attributeMap);
}

var getNextCompanyPrediction = function (context) {
    var companyValues = {};
    var prediction = {
        company: null,
        decision: false
    };
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
}


module.exports = {
    reevaluate: reevaluate,
    getNextCompanyPrediction: getNextCompanyPrediction
}
