import { validSessionCookie } from '../sessions-model';

test('valid session cookie should return true', async () => {
	const requestCookie =
		// eslint-disable-next-line max-len
		'ConfTwBot=some_random_hash_string==; ConfTwBot.sig=not_real_sig';
	const sessionCookie = 'ConfTwBot=some_random_hash_string==';

	expect(validSessionCookie(requestCookie, sessionCookie)).toEqual(true);
});

test('invalid cookie name should return false', async () => {
	const requestCookie =
		// eslint-disable-next-line max-len
		'LameBot=some_random_hash_string==; LameBot.sig=not_real_sig';
	const sessionCookie = 'ConfTwBot=some_random_hash_string==';

	expect(validSessionCookie(requestCookie, sessionCookie)).toEqual(false);
});

test('invalid cookie length should return false', async () => {
	const requestCookie =
		// eslint-disable-next-line max-len
		'ConfTwBot=; ConfTwBot.sig=';
	const sessionCookie = 'ConfTwBot=some_random_hash_string';

	expect(validSessionCookie(requestCookie, sessionCookie)).toEqual(false);
});

test('request and session cookie mismatching value should return false', async () => {
	const requestCookie =
		// eslint-disable-next-line max-len
		'ConfTwBot=some_value==; ConfTwBot.sig=not_real_sig';
	const sessionCookie = 'ConfTwBot=a_different_value==';

	expect(validSessionCookie(requestCookie, sessionCookie)).toEqual(false);
});
