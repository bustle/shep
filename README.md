## Shepherd

[![Build Status](https://travis-ci.org/bustlelabs/shepherd.svg?branch=master)](https://travis-ci.org/bustlelabs/shepherd)

A framework for building resources using AWS resource Gateway and Lambda

*Warning: Still in development. Not ready for production use*

## Installation

Not on NPM...yet

### Commands

```
new <folder_name>    Generate a new project folder
generate <resource_name>  Generate a new resource endpoint, Lambda function, and test
test [resource_name]      Run tests. Optionally name a specific test to run
deploy [env]         Deploy all new/updated functions/resources. Optionally specify environment
server               Start a local development server for api
configure            Configure global AWS credentials for the project
```

### Project Structure

#### `/resources`

Where resources live

##### `/resources/<resource_name>/models`

Where models live. Models are specified using JSON schema

##### `/resources/<resource_name>/config.json`

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

Location of global AWS configuration. Can be overwritten by resource and function specific configs.
