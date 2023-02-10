import { defineConfig } from 'vite';
import dns from 'dns';
import react from '@vitejs/plugin-react';

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
	base: '/',
	plugins: [react()],
	server: {
		host: 'ws',
		port: 3000,
		proxy: {
			backend: {
				target: 'ws://localhost:3000',
				ws: true,
			},
		},
		hmr: {
			path: 'ws',
			port: 3000,
		},
	},
});
