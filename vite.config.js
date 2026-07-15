import {sveltekit} from "@sveltejs/kit/vite"
import {gzipSync} from "node:zlib"
// import {enhancedImages} from '@sveltejs/enhanced-img'

const GZIP_WARN_LIMIT = 500 * 1024

function gzipChunkSizeWarning() {
  return {
    name: "gzip-chunk-size-warning",
    generateBundle(_options, bundle) {
      for (const [name, chunk] of Object.entries(bundle)) {
        if (chunk.type !== "chunk") continue
        const gzipped = gzipSync(chunk.code).length
        if (gzipped > GZIP_WARN_LIMIT) {
          this.warn(
            `${name} is ${(gzipped / 1024).toFixed(
              2,
            )} kB after gzip, over the ${
              GZIP_WARN_LIMIT / 1024
            } kB limit.`,
          )
        }
      }
    },
  }
}

/** @type {import('vite').UserConfigFn} */
export default ({command}) => ({
  plugins: [sveltekit(), gzipChunkSizeWarning()],
  assetsInclude: "**/*.yaml",
  logLevel: command === "build" ? "warn" : "info",
  build: {
    chunkSizeWarningLimit: Infinity,
    reportCompressedSize: false,
  },
})
