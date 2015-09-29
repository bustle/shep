## Shepherd

[![Build Status](https://travis-ci.org/bustlelabs/shepherd.svg?branch=master)](https://travis-ci.org/bustlelabs/shepherd)

A framework for building resources using AWS resource Gateway and Lambda

**Warning: Still in development. Not ready for production use**

## Installation

`npm install -g shepherd-cli`

## Quick start

```
shepherd new "Blog API"
cd blog-api
shepherd configure --accessKeyId key --secretAccessKey secret region us-east-1
shepherd push
shepherd generate resource /posts/{id}
```

### Commands

```
new <api_name> : Generate a new project folder. Will convert name to kebab case for folder name.
```

```
generate <resource|function|model|stage> : Generate a new resource, function, model, or stage. Still a WIP
```

```
push : Pushes API changes up to AWS. Does execute a deployment them yet.
```

```
configure --accessKeyId key --secretAccessKey secret region us-east-1
```

```
pull : Pulls down models and resources from AWS
```

```
deploy functions : Deploys all functions to AWS Lambda
```
