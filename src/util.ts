import { URL } from 'url';
import { readFileSync } from 'fs';
const __dirname = new URL('.', import.meta.url).pathname;

export const robustPath = __dirname.includes('/dist')
  ? function (path) {
      return `${__dirname}/../src/${path}`;
    }
  : function (path) {
      return `${__dirname}/${path}`;
    };

interface Config {
  template: string;
}

let configuration: Config | null = null;

export function getConfiguration(): Config {
  if (configuration === null) {
    try {
      configuration = JSON.parse(readFileSync(robustPath('config.json')).toString());
    } catch (e) {
      configuration = {template: ""};
    }
  }

  return <Config>configuration;
}
