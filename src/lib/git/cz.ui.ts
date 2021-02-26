import inquirer, { ChoiceOptions } from 'inquirer';
import chalk from 'chalk';
import wordWrap from 'word-wrap';
import { CommitType } from './cz.type';
import { longest } from '../utils';
import { exit } from '../shell';


export interface AnswerOptions {
  defaultType: string,
  defaultScope: string,
  defaultSubject: string,
  defaultBody: string,
  defaultIssues: string,
  disableScopeLowerCase: boolean,
  maxHeaderWidth: number,
  maxLineWidth: number,
}
export interface IAnswer {
  type: string,
  scope?: string,
  subject: string,
  body?: string,
  isBreaking: boolean,
  breakingBody?: string,
  breakingFootnote?: string,
  isIssueAffected: boolean,
  issuesBody?: string,
  issues?:string,
}
const headerLength = function(answers: IAnswer) {
  return (
    answers.type.length + 2 + (answers.scope ? answers.scope.length + 2 : 0)
  );
};
const maxSummaryLength = function(options: AnswerOptions, answers: IAnswer) {
  return options.maxHeaderWidth - headerLength(answers);
};
const filterSubject = function(subject:string) {
  subject = subject.trim();
  if (subject.charAt(0).toLowerCase() !== subject.charAt(0)) {
    subject =
      subject.charAt(0).toLowerCase() + subject.slice(1, subject.length);
  }
  while (subject.endsWith('.')) {
    subject = subject.slice(0, subject.length - 1);
  }
  return subject;
};
export default function ui(options: AnswerOptions, types: CommitType[]) {
  const labelLength = longest<CommitType>(types, 'prefix').prefix.length
  const choices: ChoiceOptions[] = types.map(t => {
    return {
      name: (t.prefix + ':').padEnd(labelLength) + ' ' + t.description,
      value: t.prefix
    }
  });
  return {
    prompter: function (cz: any, commit: (arg0: string) => void) {
      inquirer.prompt<IAnswer>([
        {
          type: 'list',
          name: 'type',
          message: '选择你要提交的类型:',
          choices,
          default: options.defaultType,
        },
        {
          type: 'input',
          name: 'scope',
          message:
            '此次变更的范围 (如：component、model、dto等或具体的文件名): (直接回车可跳过)',
          default: options.defaultScope,
          filter: function(value) {
            return options.disableScopeLowerCase
              ? value.trim()
              : value.trim().toLowerCase();
          }
        },
        {
          type: 'input',
          name: 'subject',
          message: function(answers) {
            return (
              '请填写一段简短的描述（标题），说明你做了什么，如：修改了xxBUG，代码美化等 (最多 ' +
              maxSummaryLength(options, answers) +
              ' 字符):\n'
            );
          },
          default: options.defaultSubject,
          validate: function(subject, answers:IAnswer) {
            const filteredSubject = filterSubject(subject);
            return filteredSubject.length === 0
              ? '标题（简述）是必须的'
              : filteredSubject.length <= maxSummaryLength(options, answers)
                ? true
                : '标题 长度必须小于或等于 ' +
                maxSummaryLength(options, answers) +
                ' 字符. 当前长度是 ' +
                filteredSubject.length +
                ' 字符.';
          },
          transformer: function(subject, answers) {
            const filteredSubject = filterSubject(subject);
            const color =
              filteredSubject.length <= maxSummaryLength(options, answers)
                ? chalk.green
                : chalk.red;
            return color('(' + filteredSubject.length + ') ' + subject);
          },
          filter: function(subject) {
            return filterSubject(subject);
          }
        },
        {
          type: 'input',
          name: 'body',
          message:
            '详细描述这次改动: (直接回车可跳过)\n',
          default: options.defaultBody
        },
        {
          type: 'confirm',
          name: 'isBreaking',
          message: '是否有重大变化，将导致项目的启动或库的使用方式有变更，如：数据库变更、接口变化等?',
          default: false
        },
        {
          type: 'input',
          name: 'breakingBody',
          default: '-',
          message:
            '重大变更，要求必须对此次提交进行详细说明，如说明项目启动前操作或库或接口的新的使用方式:\n',
          when: function(answers) {
            return answers.isBreaking && !answers.body;
          },
          validate: function(breakingBody) {
            return (
              breakingBody.trim().length > 0 ||
              '重大变更的详细描述是必须的'
            );
          }
        },
        {
          type: 'input',
          name: 'breakingFootnote',
          message: '重大变更的脚注（选填）:\n',
          when: function(answers) {
            return answers.isBreaking;
          }
        },
        {
          type: 'confirm',
          name: 'isIssueAffected',
          message: '此次改动是否由具体的issues发起?',
          default: !!options.defaultIssues
        },
        {
          type: 'input',
          name: 'issuesBody',
          default: '-',
          message:
            '如果issues已经解决，请详细描述下此次提交的变更:\n',
          when: function(answers) {
            return (
              answers.isIssueAffected && !answers.body && !answers.breakingBody
            );
          }
        },
        {
          type: 'input',
          name: 'issues',
          message: '输入issues的索引 (如："TPL123", "#123".):\n',
          when: function(answers) {
            return answers.isIssueAffected;
          },
          default: options.defaultIssues ? options.defaultIssues : undefined
        }
      ]).then(function (answers:IAnswer) {

        // 当scope有值 才需要对其格式化，即加括号
        const scope = answers.scope ? `(${answers.scope})` : '';

        const head = answers.type + scope + ': ' + answers.subject;

        // 因为当body有值的时候 是不会让再写breakingBody或issuesBody的
        // 但为了后续的统一格式化，这里仍然需要将特殊body赋值给真正的body
        if (answers.breakingBody) {
          answers.body = answers.breakingBody;
        }
        if (answers.issuesBody) {
          answers.body = answers.issuesBody;
        }
        const wrapOptions = {
          trim: true,
          cut: false,
          newline: '\n',
          indent: '',
          width: options.maxLineWidth
        };
        const body = answers.body ? wordWrap(answers.body, wrapOptions) : false;
        // 如果是break的提交，并设置了脚注, 在前面加"BREAKING CHANGE："前缀，为了防止用户自己输入前缀导致重复，这里先清理掉
        let breakingFootnote:string|boolean = answers.breakingFootnote ? answers.breakingFootnote.trim() : '';
        breakingFootnote = breakingFootnote
          ? 'BREAKING CHANGE: ' + breakingFootnote.replace(/^BREAKING CHANGE: /, '')
          : '';
        breakingFootnote = breakingFootnote ? wordWrap(breakingFootnote, wrapOptions) : false;
        const issues:string|boolean = answers.issues ? wordWrap(answers.issues, wrapOptions) : false;
        try {
          commit([head, body, breakingFootnote, issues].filter(v => v).join('\n\n'));
        } catch (e) {
          exit(e.message);
        }
      })
    }
  }
}
