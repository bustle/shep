export function api(apiName)  {
  return `{
  "swagger": "2.0",
  "info": {
    "title": "${apiName}"
  },
  "schemes": [ "https" ],
  "paths": {}
}`
}

export function env(env)  {
  return `module.exports = {
  env: "${env}",
  secretkey: "${env}-secret-key"
}`
}

export function gitignore()  {
  return `dist/*
node_modules/*
config/*`
}

export function lambda(){
  let obj = {
    Handler: "index.handler",
    MemorySize: 128,
    Role: "",
    Timeout: 10,
    Runtime: "nodejs4.3"
  }

  return JSON.stringify(obj, null, 2)
}

export function pkg(apiName)  {
  let obj = {
    name: apiName,
    version: "1.0.0",
    private: true,
    description: "",
    license: "",
    devDependencies: {
      webpack: "2.1.0-beta.25"
    },
    shep: {
      region: "",
      accountId: "",
      apiId: ""
    }
  }

  return JSON.stringify(obj, null, 2)
}

export function readme(apiName){
  return `# ${apiName}`
}

export function webpack(){
  return `const path = require('path')

module.exports = function(name, env) {
  return {
    target: 'node',
    entry: {
      [name]: path.resolve(\`functions/\${name}/index.js\`)
    },
    output: {
      path: path.resolve(\`dist/\${name}\`),
      filename: 'index.js',
      chunkFilename: '[name]/[id].js',
      libraryTarget: 'commonjs2'
    },
    resolve: {
      modules: [ 'node_modules', 'lib' ],
      alias: { 'shep-config': path.resolve(\`config/\${env}.js\`) }
    },
    externals: { 'aws-sdk': 'aws-sdk' },
    module: {
      loaders: []
    }
  }
}
`
}
