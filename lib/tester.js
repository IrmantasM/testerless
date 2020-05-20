// 3rd Party libraries
const CLI   = require('clui'), Spinner = CLI.Spinner;
const AWS   = require('aws-sdk');
const YAML  = require('YAML');
const chalk = require('chalk');
const https = require('https');

var lambda = new AWS.Lambda(); // Create Lambda client
var supportedRequestTypes = ['api-gateway', 'manual'];

module.exports = {
  runTest: async (config) => {
    // console.log(chalk.grey(
    //   `[DEBUG] Running ${testName} test case for`, chalk.yellow(functionName), `: expected statusCode: ${expectedStatusCode}`
    // ));
    const expectedResponseBody = config.test.response.body;
    const requestType = config.test.request.type;

    if (!supportedRequestTypes.includes(requestType)) {
      console.log(chalk.red(`[ERROR] Unsupported request type: ${requestType}`));
      process.exit();
    }

    if (requestType == 'api-gateway') {
      var postData = JSON.stringify(config.test.request.payload);
      var options = {
        hostname: config.test.request.hostname,
        port: 443, // TODO param?
        path: config.test.request.path,
        method: 'POST', // TODO param?
        headers: config.test.request.headers, // TODO at the moment this is failing at authorizer function
      }
      await callApiGateway(options, postData);
    }

    if (requestType == 'manual') {
      var params = {
        FunctionName: `${config.lambdaFunction.name}`,
        InvocationType: "RequestResponse",
        LogType: "None",
        Payload: config.test.request.payload
      };
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

// TODO logic
async function callApiGateway(options, postData) {
  console.log(options);
  // process.exit();
  const req = https.request(options, (res) => {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });

    res.on(postData, (d) => {
      process.stdout.write(d)
      return res;
    })
  })
  
  req.on('error', (error) => {
    console.error(error)
  })
  
  req.write(postData)
  req.end()
}