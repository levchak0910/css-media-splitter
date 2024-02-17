/// <reference types="nuxt" />

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [["css-media-splitter/nuxt-module", { mediaFileMinSize: 0 }]],
  vite: {
    $client: {
      build: {
        rollupOptions: {
          output: {
            assetFileNames: "_nuxt/[name][extname]",
          },
        },
      },
    },
  },
})
