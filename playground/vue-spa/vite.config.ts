import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import VitePluginCssMediaSplitter from "css-media-splitter/vite-plugin"

// https://vitejs.dev/config/
export default defineConfig({
  preview: { port: 4172 },
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
