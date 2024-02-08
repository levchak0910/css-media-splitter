import { defineConfig } from "vite"

import Inspect from "vite-plugin-inspect"

import VitePluginCssMediaSplitter from "css-media-splitter/vite-plugin"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: "[name].[ext]",
        chunkFileNames: "[name].[ext]",
      },
    },
  },
  plugins: [
    Inspect(),
    VitePluginCssMediaSplitter(),
  ],
})
