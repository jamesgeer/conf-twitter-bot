import { getOAuthRequestToken } from '../api/getRequestToken';

class LoginWindow {
	/**
	 * create the new window upon class initialisation
	 */
	constructor() {
		return (async (): Promise<void> => {
			await this.newWindow();
		})() as unknown as LoginWindow;
	}

	/**
	 * creates a bare-bones window that should be centered vertically and horizontally within the user's browser client
	 * @param parentWindow
	 * @param w
	 * @param h
	 * @private
	 */
	private windowFeatures(parentWindow: Window, w: number, h: number): string {
		const y = parentWindow.top!.outerHeight / 2 + parentWindow.top!.screenY - h / 2;
		const x = parentWindow.top!.outerWidth / 2 + parentWindow.top!.screenX - w / 2;
		return `toolbar=no, location=no, directories=no, status=no, menubar=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`;
	}

	/**
	 * returns the url required to access the auth login page from twitter, has the "force_login" parameter
	 * to prevent twitter from automatically logging the user in so multiple accounts can be added
	 * @private
	 */
	private async getLoginUrl(): Promise<string> {
		const oAuthToken = await getOAuthRequestToken();
		return `https://api.twitter.com/oauth/authenticate?oauth_token=${oAuthToken}&force_login=true`;
	}

	/**
	 * open new window with window styles and direct the user to the twitter login page
	 * @private
	 */
	private async newWindow(): Promise<void> {
		const features = this.windowFeatures(window, 500, 250);
		const url = await this.getLoginUrl();
		window.open(url, '', features);
	}
}

export default LoginWindow;
