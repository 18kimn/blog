import adapterNode from "@sveltejs/adapter-node"
import adapterStatic from "@sveltejs/adapter-static"
import {sveltePreprocess} from "svelte-preprocess"
import resolveLinks from "./src/hooks/resolveLinks.js"
import addFootnotes from "./src/hooks/addFootnotes.js"
import makeTOC from "./src/hooks/makeTOC.js"
import rehypeExternalLinks from "rehype-external-links"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import {mdsvex} from "mdsvex"

const errorPageBuild =
  process.env.ERROR_PAGE_BUILD === "true"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md", ".yaml"],
  onwarn: (warning, handler) => {
    if (warning.code === "script_context_deprecated") return
    handler(warning)
  },
  preprocess: [
    mdsvex({
      extensions: [".md"],
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
    adapter: errorPageBuild
      ? adapterStatic({
          pages: "error-build",
          assets: "error-build",
          strict: false,
        })
      : adapterNode(),
    ...(errorPageBuild && {
      output: {bundleStrategy: "inline"},
      prerender: {
        entries: ["/cloudflare-error"],
        crawl: false,
        handleUnseenRoutes: "ignore",
      },
    }),
  },
}

export default config
