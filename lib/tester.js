// 3rd Party libraries
const fs    = require('fs');
const CLI = require('clui'), Spinner = CLI.Spinner;
const AWS   = require('aws-sdk');
const YAML  = require('YAML');
const chalk = require('chalk');

var lambda = new AWS.Lambda();           // Create Lambda client

module.exports = {
  runTests: async (fileName, eventsDir) => {
    const config = YAML.parse(fs.readFileSync(fileName, 'utf8'))['functions'];
    for (var functionName in config) {
      // console.log(chalk.grey(
      //   `[DEBUG] Function ${functionName} Tests: ${JSON.stringify(config[functionName])}`
      // ));
      const tests = config[functionName]['tests']
      for (var testName in tests) {
        // console.log(chalk.grey(
        //   `[DEBUG] Function ${functionName} Test ${testName}: ${JSON.stringify(tests[testName])}`
        // ));
        const test = tests[testName];
        const eventFilePath = `./${eventsDir}/${functionName}/${testName}.json`;
        // console.log(chalk.grey(
        //   `[DEBUG] Function ${functionName} Test ${testName} event data file path: ${eventFilePath}`
        // ));
        const expectedStatusCode = test['response']['statusCode'];

        if (!fs.existsSync(eventFilePath)) {
          console.log(chalk.red(`File`, eventFilePath, 'does not exist.'));
          process.exit();
        }

        // console.log(chalk.grey(
        //   `[DEBUG] Running ${testName} test case for`, chalk.yellow(functionName), `: expected statusCode: ${expectedStatusCode}`
        // ));
        var params = {
          FunctionName: `${functionName}`,
          InvocationType: "RequestResponse",
          LogType: "None",
          Payload: fs.readFileSync(eventFilePath)
        };
        try {
          const responseStatusCode = await runTest(params, functionName, testName);
          if (expectedStatusCode == responseStatusCode) {
            console.log(chalk.yellow(functionName), chalk.green(
              ` / Test ${chalk.yellow(testName)} PASSED: received statusCode ${responseStatusCode}`
            ));
          } else {
            console.log(chalk.yellow(functionName), chalk.red(
              ` X Test ${chalk.yellow(testName)} FAILED: received statusCode ${responseStatusCode} but expecting ${expectedStatusCode}`
            ));
          }
        } catch (err) {
          console.log(err, err.stack);
        }
      }
    }
  }
};

async function runTest(params, functionName, testName) {
  var waiting = new Spinner(`Testing ${functionName}: Test Case: ${testName}. Waiting for the response from Lambda...  `, ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);
  waiting.start();
  return new Promise((resolve, reject) => {
    lambda.invoke(params, function(err, data) {
      if (err) {  // an error occurred
        waiting.stop();
        reject(err);
      } else { // successful response
        waiting.stop();
        resolve(JSON.parse(data.Payload)['statusCode']);
      }
    });
  });
}
