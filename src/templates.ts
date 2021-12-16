import { readFileSync } from 'fs';
import mustache from 'mustache';
import { robustPath } from './util.js';

const headerHtml = readFileSync(robustPath('views/header.html')).toString();

export function processTemplate(filename: string, variables: any = {}): string {
  const fileContent = readFileSync(robustPath(`views/${filename}`)).toString();

  variables.headerHtml = headerHtml;
  return mustache.render(fileContent, variables);
}
