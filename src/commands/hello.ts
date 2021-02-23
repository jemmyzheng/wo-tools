import {Arguments, Argv} from "yargs";

export const command:string = 'hello';
export const desc:string = '这是一次测试，使用TS 基于yargs 开发命令行工具';
export interface HelloOptions {
  param: string,
}
export const builder = (yargs:Argv<HelloOptions>) => {
    return yargs.option('param', {
        alias: 'p',
        type: 'string',
        default: '',
    });
};
export const handler = (argv: Arguments<HelloOptions>) => {
  console.log(argv.param);
}
