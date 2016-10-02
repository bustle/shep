import Listr from 'Listr'

export default function listr(tasks, quiet, concurrent){
  const renderer = quiet ? 'silent' : 'default'

  return new Listr(tasks, { renderer, concurrent })
}
