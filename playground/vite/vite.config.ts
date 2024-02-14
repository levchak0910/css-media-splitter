import { defineConfig } from "vite"

import Inspect from "vite-plugin-inspect"

import VitePluginCssMediaSplitter from "css-media-splitter/vite-plugin"

// https://vitejs.dev/config/
export default defineConfig({
  preview: { port: 4171 },
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
    VitePluginCssMediaSplitter({ mediaFileMinSize: 0 }),
  ],
})
