/**
 * Created by parth on 20/6/15.
 */
'use strict';

var getPatternOfCompany = function (company) {
    var keyArray = Object.keys(company);
    var valueArray = [];
    Object.keys(company).forEach(function (attrib) {
        if (!seed.attributes[attrib]) {
            return;
        }

        if (Array.isArray(company[attrib])) {
            company[attrib].forEach(function (value) {
                valueArray.push(value);
            });
        } else {
            valueArray.push(company[attrib]);
        }

    });
    return keyArray.sort().join() + '#' + valueArray.sort().join();
}

var getHashOfPattern = function (pattern) {
    var sha256 = crypto.createHash('sha256');
    sha256.update(pattern);
    return sha256.digest('hex')
}

var registerCompanyPattern = function (patterns, company, decisionMade) {
    var hashOfPattern = getHashOfPattern(getPatternOfCompany(company));
    patterns[hashOfPattern] = decisionMade;
}

var getCompanyPatternRegistered = function (patterns, company) {
    var hashOfPattern = getHashOfPattern(getPatternOfCompany(company));
    return patterns[hashOfPattern];
}

module.exports = {
    getCompanyPatternRegistered: getCompanyPatternRegistered,
    registerCompanyPattern: registerCompanyPattern
}
