import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// Production build configuration - clean version without dev features
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		viteSingleFile(), // Single HTML file for C# integration
	],

	// Production-specific configuration
	build: {
		// Output directory for production build
		outDir: 'dist-prod',

		// Don't create separate asset files
		assetsInlineLimit: 100 * 1024 * 1024, // 100MB limit (essentially unlimited)

		// Target ES2015+ for broader compatibility
		target: 'es2015',

		// Single chunk for everything
		rollupOptions: {
			input: 'index.prod.html',
			output: {
				manualChunks: undefined,
				inlineDynamicImports: true,
			},
		},

		// Minify for production
		minify: 'esbuild',

		// Don't generate source maps for production
		sourcemap: false,

		// Clean output directory before build
		emptyOutDir: true,
	},

	// Production environment variables
	define: {
		'import.meta.env.VITE_BUILD_MODE': '"production"',
		'import.meta.env.VITE_ENABLE_DEBUG': 'false',
		'import.meta.env.VITE_ENABLE_MOCK_TOGGLES': 'false',
	},

	// Ensure relative base path for C# integration
	base: './',

	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},

	// Optimize for production
	esbuild: {
		// Remove console logs in production
		drop: ['console', 'debugger'],
	},
});
