const inquirer = require('inquirer');


module.exports = {
  askConfigDetails: () => {

    const questions = [
      {
        name: 'ymlFileName',
        type: 'input',
        message: 'Enter testerless compatible config .yml file name:',
        default: 'test.yml',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter testerless compatible config .yml file name.';
          }
        }
      },
      {
        name: 'eventsDir',
        type: 'input',
        message: 'Enter name of the events json data directory:',
        default: 'events',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter name of the events json data directory.';
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  },
};
