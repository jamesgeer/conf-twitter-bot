import { createHash } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { fetch, CookieJar } from 'node-fetch-cookies';
import { robustPath } from './util.js';

export function hashToString(str: string): string {
	return createHash('sha256').update(str).digest('hex');
}

export async function fetchHtmlOrUsedCached(url: string): Promise<string | Buffer> {
	if (!url) {
		return '';
	}

	const hashedName = robustPath('../cache/') + hashToString(url) + '.html';

	if (existsSync(hashedName)) {
		return readFileSync(hashedName);
	}

	console.log('Fetch ' + url);
	const cookieJar = new CookieJar();
	const response = await fetch(cookieJar, url);
	const html = await response.text();
	writeFileSync(hashedName, html);

	return html;
}
