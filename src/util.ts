import { URL } from 'url';
import { readFileSync, writeFileSync } from 'fs';
import { SchedulingConfigJson } from 'scheduling';
const __dirname = new URL('.', import.meta.url).pathname;

export const robustPath = __dirname.includes('/dist')
  ? function (path) {
      return `${__dirname}/../src/${path}`;
    }
  : function (path) {
      return `${__dirname}/${path}`;
    };

export interface Config {
  tweetTpl: string;
  pictureTpl: string;
  pictureStyle: string;
  scheduleConfig?: SchedulingConfigJson;
}

let configuration: Config | null = null;

export function getConfiguration(): Config {
  if (configuration === null) {
    try {
      configuration = JSON.parse(readFileSync(robustPath('config.json')).toString());
    } catch (e) {
      configuration = {
        tweetTpl: `{{title}}
{{authors}}

{{{url}}}

#pastPapers #MPLR`,
        pictureTpl: `<div class="p-title">{{{title}}}</div>
<div class="p-authors">{{{authors}}}</div>
<div class="p-abstract">{{{abstract}}}</div>
<div class="p-doi">DOI: {{{doi}}}</div>`,
        pictureStyle: `.p-title {
  text-align: center;
  font-size: 1.5em;
  font-family: Linux Libertine;
  /* text-transform: capitalize; */
  font-weight: bold;
}
.p-authors {
  text-align: center;
  font-family: Linux Libertine;
}
.p-details {
  width: 650px;
}`
      };
    }
  }

  return <Config>configuration;
}

export function setConfiguration(config: Config) {
  configuration = config;
  writeFileSync(robustPath('config.json'), JSON.stringify(config));
}
