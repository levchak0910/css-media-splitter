import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import VitePluginCssMediaSplitter from "css-media-splitter/vite-plugin"

// https://vitejs.dev/config/
export default defineConfig({
  preview: { port: 4172 },
  plugins: [
    vue(),
    VitePluginCssMediaSplitter(),
  ],
})
