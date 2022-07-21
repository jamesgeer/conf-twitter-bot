export const validSessionCookie = (requestCookie: string, sessionCookie: string): boolean => {
	if (requestCookie.length > 0) {
		// extract the ConfTwBot cookie (request may contain many cookies)
		const confTwBotCookie = requestCookie.split('; ConfTwBot=').pop().split(';')[0];
		// if the confTwBot cookie is missing, then the variable will contain an empty string
		if (confTwBotCookie.length > 0) {
			// verify browser cookie matches existing session cookie
			if (confTwBotCookie === sessionCookie) {
				return true;
			}
		}
	}
	return false;
};
