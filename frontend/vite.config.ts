import { defineConfig } from 'vite';
import dns from 'dns';
import react from '@vitejs/plugin-react';

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
	root: './',
	publicDir: 'public',
	plugins: [react()],
	server: {
		host: '0.0.0.0',
		port: 3000,
		https: true,
		// hmr: {
		// 	// host: 'yourdomainname.com',
		// 	// port: 3000,
		// 	protocol: 'ws',
		// },
	},
	base: '/',
});
