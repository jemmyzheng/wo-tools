import inquirer from 'inquirer';
import { CommitType } from './cz.type';
import { longest } from '../utils';

export interface EngineOptions {
  defaultType: string,
  defaultScope: string,
  defaultSubject: string,
  defaultBody: string,
  defaultIssues: string,
  disableScopeLowerCase: boolean,
  maxHeaderWidth: number,
  maxLineWidth: number,
}

export default function (options: EngineOptions, types: CommitType[]) {
  // TODO
}
