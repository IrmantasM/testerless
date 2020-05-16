// 3rd Party libraries
const CLI   = require('clui'), Spinner = CLI.Spinner;
const AWS   = require('aws-sdk');
const YAML  = require('YAML');
const chalk = require('chalk');

var lambda = new AWS.Lambda(); // Create Lambda client

module.exports = {
  runTest: async (config) => {
    var params = {
      FunctionName: `${config.lambdaFunction.name}`,
      InvocationType: "RequestResponse",
      LogType: "None",
      Payload: config.test.request.payload
    };
    // console.log(chalk.grey(
    //   `[DEBUG] Running ${testName} test case for`, chalk.yellow(functionName), `: expected statusCode: ${expectedStatusCode}`
    // ));
    const expectedResponseBody = config.test.response.body;

    if (config.test.request.type == 'api-gateway') {
      console.log('api-gateway request');
    } else {
      console.log('direct request');
      try {
        const responseBody = await runTestInvoke(params, config.test.name);
        if (expectedResponseBody == responseBody) {
          console.log(chalk.yellow(config.test.name), chalk.green(
            ` / Test ${chalk.yellow(config.test.name)} PASSED: received responseBody ${responseBody}`
          ));
        } else {
          console.log(chalk.yellow(config.test.name), chalk.red(
            ` X Test ${chalk.yellow(config.test.name)} FAILED: received responseBody ${responseBody} but expecting ${JSON.stringify(expectedResponseBody)}`
          ));
        }
      } catch (err) {
        console.log(err, err.stack);
      }
    }
  }
};

async function runTestInvoke(params, testName) {
  var waiting = new Spinner(`Testing ${params.FunctionName}: Test Case: ${testName}. Waiting for the response from Lambda...  `, ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);
  waiting.start();
  return new Promise((resolve, reject) => {
    lambda.invoke(params, function(err, data) {
      if (err) {  // an error occurred
        waiting.stop();
        reject(err);
      } else { // successful response
        waiting.stop();
        resolve(data.Payload);
      }
    });
  });
}
