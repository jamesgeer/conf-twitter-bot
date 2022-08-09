import { readFileSync } from 'fs';
import mustache from 'mustache';
import { robustPath } from './util';

const headerHtml = readFileSync(robustPath('views/header.html')).toString();

export default function processTemplate(filename: string, variables: any = {}): string {
	const fileContent = readFileSync(robustPath(`views/${filename}`)).toString();

	if (!variables) {
		variables = {};
	}

	variables.headerHtml = headerHtml;
	return mustache.render(fileContent, variables);
}
