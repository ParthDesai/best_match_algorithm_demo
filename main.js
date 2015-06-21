/**
 * Created by parth on 20/6/15.
 */

var creator = require('./lib/generator/creator');
var core = require('./lib/core');

var context = creator.createData(500, function(count) { return 'name' + count; });

var printCompanyDetails = function (prediction) {
    console.log('******************************************');
    console.log('Name: ' + prediction.company.name);
    console.log('Positions Open:');
    prediction.company.post.forEach(function (value) {
        console.log(' ' + value);
    });
    console.log('Perks:');
    prediction.company.perk.forEach(function (value) {
        console.log(' ' + value);
    });
    console.log('Misc Attribute 1:' + prediction.company.miscAttribute1);
    console.log('Misc Attribute 2:' + prediction.company.miscAttribute2);
    console.log('Misc Attribute 3:' + prediction.company.miscAttribute3);
    console.log('Misc Attribute 4:' + prediction.company.miscAttribute4);

    console.log('Debug Attributes:');
    console.log(' Company score:' + prediction.score);
    console.log(' Predicted Decision: ' + (prediction.decision ? 'Y' : 'N'));
    console.log('******************************************');
};

var mainLoop = function (reply, prediction) {
    if (prediction) {
        switch (reply) {
            case 'Y':
                core.reevaluate(context, prediction.company, prediction.decision, true);
                break;
            case 'N':
                core.reevaluate(context, prediction.company, prediction.decision, false);
                break;
            default :
                return;
        }
    }

    prediction = core.getNextCompanyPrediction(context);
    printCompanyDetails(prediction);
    process.stdin.write('Enter your choice (Y to accept N to reject):');

    process.stdin.once('data', function (chunk) {
        input = chunk.toString()[0].toUpperCase();
        if (input != 'Y' && input != 'N') {
            console.log('Bye Bye!!!!!');
            process.exit(0);
        }
        return mainLoop(input, prediction);
    });
};

mainLoop();

