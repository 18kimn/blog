import {sveltekit} from '@sveltejs/kit/vite'
// import {enhancedImages} from '@sveltejs/enhanced-img'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  assetsInclude: '**/*.yaml',
}

export default config
