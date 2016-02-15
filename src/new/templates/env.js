export default function(){
  return `module.exports = {
  development: {
    env: 'development',
    secret: 'dev-key'
  },
  beta: {
    env: 'beta',
    secret: 'beta-key'
  },
  production: {
    env: 'production',
    secret: 'prod-key'
  }
}`
}
