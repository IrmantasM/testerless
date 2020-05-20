#!/usr/bin/env node

// 3rd Party libraries
const chalk  = require('chalk');
const clear  = require('clear');
const figlet = require('figlet');
const fs     = require('fs');

// Custom libraries
const inquirer   = require('./lib/inquirer');
const parser     = require('./lib/parser');
const tester     = require('./lib/tester');

clear();

const argv = require('minimist')(process.argv.slice(2));

var pjson = require('./package.json');
console.log(
  chalk.yellow(
    figlet.textSync('Testerless', { horizontalLayout: 'full' })
  ),
  chalk.red(`v${pjson.version}`)
);
console.log(chalk.green('\nSimplistic RequestResponse based integration test framework for your Lambda functions!\n'));

const run = async () => {
  // TODO skip config details if argv is passed
  const params = await inquirer.askConfigDetails();
  const ymlFileName = params['ymlFileName'];
  const eventsDir = params['eventsDir'];

  if (!fs.existsSync(ymlFileName)) {
    console.log(chalk.red(`File`, ymlFileName, 'does not exist.'));
    process.exit();
  }

  if (!fs.existsSync(eventsDir)) {
    console.log(chalk.red(`Directory`, eventsDir, 'does not exist.'));
    process.exit();
  }

  // Get TestConfig
  const config = await parser.parseTestConfig(ymlFileName, eventsDir);
  // console.log(config)
  config.forEach(function (item, index) {
    tester.runTest(item);
  });
};

// Everything starts here
run();
