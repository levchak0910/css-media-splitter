import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import VitePluginCssMediaSplitter from "css-media-splitter/vite-plugin"

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
    vue(),
    VitePluginCssMediaSplitter(),
  ],
})
