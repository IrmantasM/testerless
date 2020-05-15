# testerless

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=IrmantasM_testerless&metric=alert_status)](https://sonarcloud.io/dashboard?id=IrmantasM_testerless) [![Known Vulnerabilities](https://snyk.io/test/github/IrmantasM/testerless/badge.svg)](https://snyk.io/test/github/IrmantasM/testerless)

Simplistic RequestResponse based Lambda function test framework to test _deployed_ Lambda functions.

## Changelog

Changelog can be found [here](./CHANGELOG.md).

## Pre-requisites

- [Configured AWS credentials](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html).
- `test.yml` and event body, ([see below](#test-configuration))

### Test Configuration

To successfully run testerless, all you need to do is to create two files: .yml configuration file and event trigger json (e.g. sample cloudwatch event).

In [testerless/example/](./example/) directory you will find sample files with explanations in comments.

## Installation

1. Clone this repository:

    ```sh
    git clone https://github.com/IrmantasM/testerless.git
    ```

1. Navigate to the cloned repository and install testerless library globally:

    ```sh
    npm install -g
    ```

1. Now you can run `testerless` command:

    ```sh
    testerless
    ```

Alternatively, if you don't want to install package globally, you can simply run:

  ```sh
  npm install
  node index.js
  ```

## Contributing

No hard rules at the moment, for now just bump the version (semver), raise a PR and add reviewers.

## TODOs

1. (HIGH) Do TODOs in code!
1. (HIGH) Support custom json response body
1. (HIGH) CICD
1. (MEDIUM) Go public: repo & publish npm package
1. (LOW) Integrate with test framework such as jest
