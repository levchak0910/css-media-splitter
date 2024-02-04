import { defineConfig } from "vite"

import Inspect from "vite-plugin-inspect"

import VitePluginCssMediaSplitter from "css-media-splitter/vite-plugin"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Inspect(),
    VitePluginCssMediaSplitter(),
  ],
})
