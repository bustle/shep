import loudRejection from 'loud-rejection'

loudRejection()

require('yargs')
  .wrap(120)
  .usage('Usage: $0 <command> [options]')
  .demand(1)
  .commandDir('./commands')
  .version()
  .help()
  .strict()
  .argv
