import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Static adapter: the whole site is prerendered to plain HTML/JS/CSS so it
			// can be hosted anywhere (GitHub Pages, Netlify, Vercel, …). Prerendering is
			// enabled site-wide via `export const prerender = true` in src/routes/+layout.js.
			adapter: adapter({
				fallback: undefined
			})
		})
	]
});
