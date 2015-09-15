## Shepherd

[![Build Status](https://travis-ci.org/bustlelabs/shepherd.svg?branch=master)](https://travis-ci.org/bustlelabs/shepherd)

A framework for building APIs using AWS API Gateway and Lambda

*Warning: Still in development. Not ready for production use*

## Installation

Not on NPM...yet

### Commands

```
new <folder_name>    Generate a new project folder
generate <api_name>  Generate a new API endpoint, Lambda function, and test
test [api_name]      Run tests. Optionally name a specific test to run
deploy [env]         Deploy all new/updated functions/APIs. Optionally specify environment
server               Start a local development server for APIs
configure            Configure global AWS credentials for the project
```

### Project Structure

#### `/apis`

Where apis live

##### `/apis/<api_name>/models`

Where models live. Models are specified using JSON schema

##### `/apis/<api_name>/config.json`

Configuration for deployment to AWS

#### `/functions`

Where AWS lambda functions live

##### `/functions/<function_name>/index.json`

Code to be run on Lambda

##### `/functions/<function_name>/package.json`

Required if your function depends on third party modules

##### `/functions/<function_name>/config.json`

Configuration for deployment to AWS

#### `/tests`

Where integration tests live

#### `/config.json`

Location of global AWS configuration. Can be overwritten by API and function specific configs.
