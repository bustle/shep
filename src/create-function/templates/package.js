export default function({ name }){
  let obj = {
    name: name,
    version: '1.0.0',
    main: 'index.js',
    scripts: {
      'test': 'echo \"Error: no test specified\" && exit 1'
    },
    dependencies: {}
  }

  return JSON.stringify(obj, null, 2)
}
