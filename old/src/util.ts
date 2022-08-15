import { readFileSync, writeFileSync } from 'fs';
import { Config, ConfigForUser } from './data-types.js';

const dirName = `${process.env.PWD}`;

export const robustPath = dirName.includes('/dist')
	? (path) => `${dirName}/../src/${path}`
	: (path) => `${dirName}/${path}`;

let configuration: Config | null = null;

export function getConfiguration(userId: string): ConfigForUser {
	if (configuration === null) {
		try {
			configuration = JSON.parse(readFileSync(robustPath('config.json')).toString());
		} catch (e) {
			console.log(e);
		}
	}
	if (configuration === null) {
		configuration = {};
	}

	let userConfig = configuration[userId];
	if (!userConfig) {
		userConfig = {
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
}`,
		};
		configuration[userId] = userConfig;
	}

	return userConfig;
}

export function setConfiguration(userId: string, config: ConfigForUser): void {
	if (configuration === null) {
		configuration = {};
	}
	configuration[userId] = config;
	writeFileSync(robustPath('config.json'), JSON.stringify(configuration));
}
