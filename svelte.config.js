import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'
import resolveLinks from './hooks/resolveLinks.js'
import addFootnotes from './hooks/addFootnotes.js'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
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
      remarkPlugins: [resolveLinks, addFootnotes],
      rehypePlugins: [
        rehypeExternalLinks,
        rehypeSlug,
        rehypeAutolinkHeadings,
      ],
    }),
  ],
  extensions: ['.svelte', '.md'],
  kit: {
    adapter: adapter(),
  },
}

export default config
