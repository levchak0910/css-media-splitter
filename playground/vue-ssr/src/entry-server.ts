import { createSSRApp } from "vue"
import { renderToString } from "vue/server-renderer"

import type { ParameterizedContext } from "koa"

import App from "./App.vue"

export async function render(
  _ctx: ParameterizedContext,
  manifest: Record<string, string[]>,
): Promise<[string, string]> {
  const app = createSSRApp(App)

  const renderCtx: { modules?: string[] } = {}
  const renderedHtml = await renderToString(app, renderCtx)

  const preloadLinks = renderPreloadLinks(renderCtx.modules, manifest)
  return [renderedHtml, preloadLinks]
}

function renderPreloadLinks(modules: undefined | string[], manifest: Record<string, string[]>): string {
  let links = ""
  const seen = new Set()

  if (modules === undefined)
    return links

  modules.forEach((id) => {
    const files = manifest[id]
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file)
          links += renderPreloadLink(file)
        }
      })
    }
  })
  return links
}

function renderPreloadLink(file: string): string {
  if (file.endsWith(".js"))
    return `<link rel="modulepreload" crossorigin href="${file}">`
  else if (file.endsWith(".css"))
    return `<link rel="stylesheet" href="${file}">`
  else
    return ""
}
