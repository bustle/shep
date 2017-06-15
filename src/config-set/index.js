import upload from '../util/upload-environment'

export default function ({ env = 'development', vars }) {
  return upload(env, vars)
}
