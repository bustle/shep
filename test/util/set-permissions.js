import td from 'testdouble'

const lambda = td.replace('../../src/util/aws/lambda')

const setPermissions = require('../../src/util/set-permissions')

const apiId = 'api-id'
const env = 'prod'
const region = 'narnia'
const accountId = '123456'
const name = 'foo'

const api = {
  paths: {
    '/': {
      get: {
        'x-amazon-apigateway-integration': {
          uri: `arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:${region}:${accountId}:function:${name}:\${stageVariables.functionAlias}/invocations`
        }
      },
      post: {
        'x-amazon-apigateway-integration': {
          uri: `arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:${region}:${accountId}:function:${name}/invocations`
        }
      }
    }
  }
}

describe('util/set-permissions', () => {
  it('Calls setPermission on lambda', async () => {
    await setPermissions(api, apiId, env)
    td.verify(lambda.setPermission(td.matchers.contains({
      apiId,
      accountId,
      region,
      name
    })), { times: 2 })
  })
})
