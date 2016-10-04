export const cors = {
  'responses': {
    '200': {
      'description': '200 response',
      'headers': {
        'Access-Control-Allow-Origin': {
          'type': 'string'
        },
        'Access-Control-Allow-Methods': {
          'type': 'string'
        },
        'Access-Control-Allow-Headers': {
          'type': 'string'
        }
      }
    }
  },
  'x-amazon-apigateway-integration': {
    'responses': {
      'default': {
        'statusCode': '200',
        'responseParameters': {
          'method.response.header.Access-Control-Allow-Methods': "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
          'method.response.header.Access-Control-Allow-Headers': "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
          'method.response.header.Access-Control-Allow-Origin': "'*'"
        }
      }
    },
    'requestTemplates': {
      'application/json': '{"statusCode": 200}'
    },
    'passthroughBehavior': 'when_no_match',
    'type': 'mock'
  }
}
