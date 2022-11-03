import { PORT } from './keys';
import { app } from './app';

// fix for jest tests not ending
// https://stackoverflow.com/a/63299022/4956088
app.listen(PORT, () => {
	console.log('==> 🌎  Listening on port %s. Visit http://localhost:%s/', PORT, PORT);
});
