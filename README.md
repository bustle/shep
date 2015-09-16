## Shepherd

[![Build Status](https://travis-ci.org/bustlelabs/shepherd.svg?branch=master)](https://travis-ci.org/bustlelabs/shepherd)

A framework for building resources using AWS resource Gateway and Lambda

*Warning: Still in development. Not ready for production use*

## Installation

Not on NPM...yet

### Commands

```
new <folder_name> : Generate a new project folder
```

```
generate <resource|function|model|stage> : Generate a new resource, function, model, or stage
```

```
deploy : Deploy all new/updated functions/resources. Optionally specify environment
```

### Project Structure

#### `/resources`

Where resources live

##### `/models`

Where models live. Models are specified using JSON schema

##### `/stages`

Where stages live.

#### `/functions`

Where AWS lambda functions live

##### `/functions/<function_name>/index.json`

Code to be run on Lambda

##### `/functions/<function_name>/package.json`

Required if your function depends on third party modules

##### `/functions/<function_name>/config.json`

Configuration for deployment to AWS

##### `/config.js`

Configuration for deployment to AWS
