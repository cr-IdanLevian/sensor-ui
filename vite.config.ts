import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		viteSingleFile(), // This will inline all CSS and JS into a single HTML file
	],

	// Configuration for single file build
	build: {
		// Don't create separate asset files
		assetsInlineLimit: 100 * 1024 * 1024, // 100MB limit (essentially unlimited)

		// Target ES2015+ for broader compatibility
		target: 'es2015',

		// Single chunk for everything
		rollupOptions: {
			output: {
				manualChunks: undefined,
				inlineDynamicImports: true,
			},
		},

		// Minify for production
		minify: 'esbuild',
	},

	// Ensure relative base path
	base: './',

	// Development server config (for yarn dev)
	server: {
		port: 5173,
		host: 'localhost',
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
