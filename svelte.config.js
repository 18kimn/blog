import adapter from '@sveltejs/adapter-node'
import {sveltePreprocess} from 'svelte-preprocess'
import resolveLinks from './src/hooks/resolveLinks.js'
import addFootnotes from './src/hooks/addFootnotes.js'
import makeTOC from './src/hooks/makeTOC.js'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import {mdsvex} from 'mdsvex'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md', '.yaml'],
  preprocess: [
    mdsvex({
      extensions: ['.md'],
      remarkPlugins: [resolveLinks, addFootnotes, makeTOC],
      rehypePlugins: [
        rehypeExternalLinks,
        rehypeSlug,
        rehypeAutolinkHeadings,
      ],
    }),
    sveltePreprocess(),
  ],
  kit: {
    adapter: adapter(),
  },
}

export default config
