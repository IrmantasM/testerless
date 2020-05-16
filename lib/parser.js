/* This library parses yml mapping test configuration */
const chalk = require('chalk');
const fs    = require('fs');
const YAML  = require('YAML');

const Function   = require('../classes/Function');
const Request    = require('../classes/Request');
const Response   = require('../classes/Response');
const Test       = require('../classes/Test');
const TestConfig = require('../classes/TestConfig')

module.exports = {
  parseTestConfig: async (fileName, eventsDir) => {
    var testsConfig = []
    const config = YAML.parse(fs.readFileSync(fileName, 'utf8'))['functions'];

    for (var functionName in config) {
      let lambdaFunction = new Function(functionName);

      // console.log(chalk.grey(
      //   `[DEBUG] Function ${lambdaFunction.name} Tests: ${JSON.stringify(config[lambdaFunction.name])}`
      // ));

      const tests = config[lambdaFunction.name]
      for (var testName in tests) {
        const testData = tests[testName];
        let test = new Test(
          testName,
          testData['request'],
          testData['response']
        );
        test.response.body = JSON.stringify(test.response.body);
        
        // console.log(chalk.grey(
        //   `[DEBUG] Function ${lambdaFunction.name} Test ${test.name}: ${JSON.stringify(tests[test.name])}`
        // ));
        
        // console.log(chalk.grey(
        //   `[DEBUG] Function: ${lambdaFunction.name}, Test: ${test.name}, Type: ${test.request.type}, ResBody: ${test.response.body}`
        // ));

        // const eventFilePath = `./${eventsDir}/${lambdaFunction.name}/${test.name}.json`;
        // console.log(chalk.grey(
        //   `[DEBUG] Function ${lambdaFunction.name} Test ${test.name} event data file path: ${eventFilePath}`
        // ));

        if (!fs.existsSync(eventFilePath)) {
          console.log(chalk.red(`File`, eventFilePath, 'does not exist.'));
          process.exit();
        }

        test.request.payload = fs.readFileSync(eventFilePath);

        testsConfig.push(new TestConfig(test, lambdaFunction))
      }
    }
    return testsConfig;
  }
};
