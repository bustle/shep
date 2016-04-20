## Shep

A framework for building/deploying applications using AWS API Gateway and Lambda.

[![Build Status](https://travis-ci.org/bustlelabs/shep.svg?branch=master)](https://travis-ci.org/bustlelabs/shep) [![npm version](https://badge.fury.io/js/shep.svg)](https://badge.fury.io/js/shep)
[![Code Climate](https://codeclimate.com/github/bustlelabs/shep/badges/gpa.svg)](https://codeclimate.com/github/bustlelabs/shep)

## Installation

`npm install -g shep`

## Quick start

```
> shep new
... follow prompts ...
> cd <project-folder>
> shep create-function
... follow prompts ...
> shep create-resource
... follow prompts ...
> shep create-method
... follow prompts ...
> shep deploy
... follow prompts ...
```

## Why?

AWS Lambda and API Gateway are two great tools for building "serverless" applications. But there are some rough edges. Shep is built to smooth these out. It does this by automating tasks and having a few strong opinions.

### API Gateway


#### Mapping templates

API Gateway allows you to write "mapping templates" that transform data before sending it to lambda or other backends. They are written in velocity (java templating) and are generally not fun to deal with. Shep contains a [universal template](https://github.com/bustlelabs/shep/blob/master/src/create-method/templates/mapping.js) that you should use instead. This is automatically configured when you use `shep create-method`. Just use it and save yourself some headache.

### Lambda

#### Packaging

Lambda functions need to be uploaded in a zip file with all of their dependencies already included. Shep will:
- Install dependencies
- Transpile ES2015 code
- Inject environment variables

#### Dependencies

### API Gateway + Lambda

#### Stages/Versioning

### API Gateway Web UI

It is important to note that this does not yet replace the API Gateway UI. For creating new resources/functions/methods you will want to use the shep cli, but edits for headers, params, etc should probably be made through the Web UI. Make sure to update your local api.json file by running `shep pull`

### Lambda versions + API Gateway stages

Shep automatically configures proper permissions and links between API Gateway stages and lambda functions. Example: the beta API stage will call the beta version of your lambda functions. Environment variables are contained in `env.js` and copied into your lambda function on deployment. Just add new keys to that file to created additional environments.

### Node Dependencies

Dependencies can be specified for all project functions in your project root `package.json`. These are copied to each function on deployment and overidden by the dependencies in each functions `package.json` file. Essentially each function 'inherits' any production dependencies from the root project.

## AWS Wishlist

### Swagger export without stage name
### Install dependencies

## Other projects

[Serverless](https://github.com/serverless/serverless)

Shep and Serverless have similar goals. The creation of Shep was definitely inspired by Serverless. With Shep we strive for a more minimal feature set with more opinions baked in. We encourage you to check out both and select the right one for your project.

[Apex](https://github.com/apex/apex)

Apex is very similar to using Shep with the `--no-api` flag. It is just for managing and deploying lambda functions. It also supports multiple lambda runtimes where Shep only supports nodejs.

## CLI Commands

`shep new` - Creates a new project. Will create a new API on AWS

`shep create-resource` - Creates a new resource

`shep create-function` - Creates a new function. Will create a new function on AWS

`shep create-method` - Creates a new method. You should already have created the resource and the function before running this command.

`shep deploy` - Deploys all functions, sets up permissions+versions, and creates a new API gateway deployment

`shep pull` - Pulls a JSON representation of your API and writes it to `api.json`. This is used by shep to match up functions with resources and endpoints. If you make changes using the API gateway web UI make sure to pull down those changes by running this command

`shep run` - Will run a function using the `development` environment and the event found at `functions/{funcName}/event.json`

## Using Without API Gateway

You can use `shep` without API gateway if you just need to deploy and version lambda functions. When creating a project use the following command: `shep new --no-api`. Your project will now skip any API gateway commands and integrations.

## Development

Pull requests welcome!

Test: `npm test`

Rebuild on file change: `npm run compile -- -w`
