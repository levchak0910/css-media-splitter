# css-media-splitter

The tool extracts all @media at-rules into dedicated files and download them only when the user device matches the media query.

This technique is the most valuable for mobile-first applications. It reduces the size of the CSS downloaded and increases the coverage ratio, so makes page loading faster and prevents a "Reduce unused CSS code" issue in the Lighthouse report.

The package exposes:

- `css-media-splitter/plain` - handler for plain HTML & CSS projects. (maintainer: [@levchak0910](https://github.com/levchak0910))
- `css-media-splitter/vite-plugin` - plugin for Vite based projects. (maintainer: [@levchak0910](https://github.com/levchak0910))
- `css-media-splitter/nuxt-module` - module for Nuxt based projects. (maintainer: [@levchak0910](https://github.com/levchak0910))
- `css-media-splitter/api` - helper functions for writing custom solutions. (maintainer: [@levchak0910](https://github.com/levchak0910))

_Your favorite framework is not supported yet?_ - please refer to [CONTRIBUTION.md](./CONTRIBUTING.md#new-integration).

## How it works

The tool is modifying the application by transforming HTML and CSS files. It was developed to be used on the final bundle after any build process was finished.

The algorithm:

1. run through all CSS source files and extract all @media at-rules.
2. remove all @media at-rules from CSS source files.
3. write dedicated media files with all CSS rules grouped under one @media at-rule.
4. generate manifest with relations between source files and media files.
5. include the loader into all HTML files.

_source file_ in scope of this tool equals to a **compiled CSS or HTML file** from your **final bundle**. Please, don't confuse with the file you actually work with.

## Usage

### Install the package

```bash
npm i -D css-media-splitter
```

```bash
yarn add -D css-media-splitter
```

```bash
pnpm add -D css-media-splitter
```

### Plain app

```ts
import processCssMediaSplitter from "css-media-splitter/plain"

const result = await processCssMediaSplitter({ distDir: "dist" })
```

Use `result` which contain `manifest`, `loader` and `report` depending on the project setup.

Example could be found in [playground](./playground/plain/media-splitter.ts).

### Vite

```ts
// vite.config.ts
import { defineConfig } from "vite"
import VitePluginCssMediaSplitter from "css-media-splitter/vite-plugin"

export default defineConfig({
  plugins: [
    VitePluginCssMediaSplitter(),
  ],
})
```

Examples could be found for:

- no framework app - [vite playground](./playground/vite/vite.config.ts)
- VUE SPA app - [vue-spa playground](./playground/vue-spa/vite.config.ts)
- VUE SSR app - [vue-ssr playground](./playground/vue-spa/vite.config.ts)

### Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["css-media-splitter/nuxt-module"],
})
```

Example could be found in [playground](./playground/nuxt/nuxt.config.ts)

### Options

#### distDir

Available in: `plain`

Path to `dist` folder. Should be an absolute fs path or the folder name relative to the root folder.

In `vite-plugin` and `nuxt-module` is set based on vite/nuxt config respectively.

#### mediaFileMinSize

Available in: `plain`, `vite-plugin`, `nuxt-module`

Use this option to define how large media file content should be, so it will be extract into a dedicated file.

This option is useful when media file content is small and it will take more space in the loader manifest than having it in the CSS source file.

By default equals to **100** (experimentally calculated, _not recommended_ to set a smaller size).

**In Vite project**: `vite.config.ts`

```ts
{
  plugins: [ VitePluginCssMediaSplitter({ mediaFileMinSize: 250 }) ],
}
```

**In Nuxt project**: `nuxt.config.ts`

```ts
{
  modules: [ ["css-media-splitter/nuxt-module", { mediaFileMinSize: 250 }] ],
}
```

## Internals

### Loader

By default, the loader will be included before the first `link`/`style`/`script` with the src path ends with `.css` or `.js` extension.

In some scenarios it is not relevant, then you can put comment `<!-- css-media-splitter:loader -->` in place before any `link`/`style`/`script` is defined and the comment will be replaced automatically.

Example in vue-ssr playground - [comment](./playground/vue-ssr/index.html) on line 7.

When the comment is not the case too, the loader can be inserted programmatically using functions from `css-media-splitter/api`.

Example in nuxt-module - [nuxt.hook "close"](./src/integrations/nuxt-module.ts) on line 42.

## Credits

- [starter-vite-plugin](https://github.com/elonehoo/starter-vite-plugin) - starter template ([@elonehoo](https://github.com/elonehoo))
- [postcss-extract-media-query](https://github.com/SassNinja/postcss-extract-media-query) - original idea ([@SassNinja](https://github.com/SassNinja))
