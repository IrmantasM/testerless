// 3rd Party libraries
const fs    = require('fs');
const CLI = require('clui'), Spinner = CLI.Spinner;
const AWS   = require('aws-sdk');
const YAML  = require('YAML');
const chalk = require('chalk');

AWS.config.update({region:'us-east-1'}); // TODO parameterize region
var lambda = new AWS.Lambda();           // Create Lambda client

module.exports = {
  runTests: (fileName, eventsDir) => {
    const json = YAML.parse(fs.readFileSync(fileName, 'utf8'));

    for (var functionName in json['functions']) {
      const eventFilePath = `./${eventsDir}/${functionName}-event.json`;
      const expectedStatusCode = json['functions'][functionName]['response']['statusCode']; // TODO add more flexibility on expected results

      if (!fs.existsSync(eventFilePath)) {
        console.log(chalk.red(`File`, eventFilePath, 'does not exist.'));
        process.exit();
      }
      
      // Invoke Lambda function
      var params = {
        FunctionName: `${functionName}`,
        InvocationType: "RequestResponse",
        LogType: "None",
        Payload: fs.readFileSync(eventFilePath)
      };
      console.log('\nRunning tests for', chalk.yellow(functionName));
      test(functionName, params, expectedStatusCode);
    }
  }
};

function test(functionName, params, expectedStatusCode) {
  var waiting = new Spinner('Waiting for the response from Lambda...  ', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);
  waiting.start();
  lambda.invoke(params, function(err, data) {
    if (err) {  // an error occurred
      waiting.stop();
      console.log(err, err.stack);
    } else { // successful response
      waiting.stop();
      // console.log(`[DEBUG] Response Payload: ${data.Payload}`)
      const responseStatusCode = JSON.parse(data.Payload)['statusCode'];
      if (expectedStatusCode == responseStatusCode) {
        console.log(chalk.yellow(functionName), chalk.green(
          ` / PASSED: received statusCode ${responseStatusCode}`
        ));
      } else {
        console.log(chalk.yellow(functionName), chalk.red(
          ` X FAILED: received statusCode ${responseStatusCode} but expecting ${expectedStatusCode}`
        ));
      }
    }
  });
}
