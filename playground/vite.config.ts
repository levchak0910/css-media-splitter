import { defineConfig } from "vite"
import Inspect from "vite-plugin-inspect"

import CssMediaSplitter from "../src"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Inspect(),
    CssMediaSplitter(),
  ],
})
