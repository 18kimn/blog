import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import resolveLinks from './hooks/resolveLinks.js'
import {mdsvex} from 'mdsvex'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    preprocess(),
    mdsvex({
      layout: {
        projects: 'src/routes/projects/_template.svelte',
        writing: 'src/routes/writing/_template.svelte',
      },
      extensions: ['.md'],
      remarkPlugins: [resolveLinks],
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    }),
  ],
  extensions: ['.svelte', '.md'],
  kit: {
    adapter: adapter(),
  },
}

export default config
