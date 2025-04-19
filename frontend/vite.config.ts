import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		proxy:{
			'/api': 'http://127.0.0.1:8000',
			'/auth': 'http://127.0.0.1:8000',
			'/users': 'http://127.0.0.1:8000',
		}
	}
});
