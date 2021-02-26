import chalk from 'chalk';
const shell = require('shelljs');

export function exit (error:string) {
  if (error) {
    shell.echo(chalk.bold.red(error));
    process.exit(2);
  } else {
    process.exit(0);
  }
}
