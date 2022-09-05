import adapter from '@sveltejs/adapter-node'
import preprocess from 'svelte-preprocess'
import resolveLinks from './hooks/resolveLinks.js'
import addFootnotes from './hooks/addFootnotes.js'
import makeTOC from './hooks/makeTOC.js'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import {mdsvex} from 'mdsvex'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md', '.yaml'],
  preprocess: [
    preprocess(),
    mdsvex({
      extensions: ['.md'],
      remarkPlugins: [resolveLinks, addFootnotes, makeTOC],
      rehypePlugins: [
        rehypeExternalLinks,
        rehypeSlug,
        rehypeAutolinkHeadings,
      ],
    }),
  ],
  kit: {
    adapter: adapter(),
  },
}

export default config
