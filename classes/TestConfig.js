const Test     = require('./Test');
const Function = require('./Function');

class TestConfig {
  constructor(test, lambdaFunction) {
    this.test           = new Test(test.name, test.request, test.response);
    this.lambdaFunction = new Function(lambdaFunction.name);
  }
}

module.exports = TestConfig;
