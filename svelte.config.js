import adapter from '@sveltejs/adapter-static'
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
  extensions: ['.svelte', '.md'],
  preprocess: [
    mdsvex({
      layout: {
        projects: 'src/routes/projects/_template.svelte',
        writing: 'src/routes/writing/_template.svelte',
        thoughts: 'src/routes/_thoughts_template.svelte',
      },
      extensions: ['.md'],
      remarkPlugins: [resolveLinks, addFootnotes, makeTOC],
      rehypePlugins: [
        rehypeExternalLinks,
        rehypeSlug,
        rehypeAutolinkHeadings,
      ],
    }),
    preprocess(),
  ],
  kit: {
    adapter: adapter(),
    outDir: 'server/build',
  },
}

export default config
