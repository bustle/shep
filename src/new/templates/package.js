export default function({ apiName, folder, region, accountId, functionNamespace, api, apiId }){
  let obj = {
    name: apiName || folder,
    version: "1.0.0",
    repository: "",
    description: "",
    license: "",
    babel: {
      presets: [ "es2015" ]
    },
    dependencies: {},
    devDependencies: {
      "babel-preset-es2015": "^6.5.0"
    },
    shepherd: { region, functionNamespace, accountId, apiId }
  }

  if (api === false) { obj.shepherd.api = false }

  return JSON.stringify(obj, null, 2)
}
