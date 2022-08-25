import {sveltekit} from '@sveltejs/kit/vite'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  assetsInclude: '**/*.yaml',
}

export default config
