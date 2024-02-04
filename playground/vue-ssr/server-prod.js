import path from "node:path"
import fs from "node:fs"
import Koa from "koa"
import sendFile from "koa-send"

const resolve = p => path.resolve("./", p)

const clientRoot = resolve("dist/client")
const template = fs.readFileSync(resolve("dist/client/index.html"), "utf-8")
let manifest = fs.readFileSync(resolve("dist/client/.vite/ssr-manifest.json"), "utf-8")
manifest = JSON.parse(manifest)

;(async () => {
  const app = new Koa()

  /** @param {import("koa").ParameterizedContext} ctx */
  app.use(async (ctx) => {
    // send static file
    if (ctx.path.startsWith("/assets") || ctx.path.endsWith(".css")) {
      await sendFile(ctx, ctx.path, { root: clientRoot })
      return
    }

    const { render } = await import("./dist/server/entry-server.js")

    const [appHtml, preloadLinks] = await render(ctx, manifest)

    const html = template
      .replace("<!--preload-links-->", preloadLinks)
      .replace("<!--app-html-->", appHtml)

    ctx.type = "text/html"
    ctx.body = html
  })

  // eslint-disable-next-line no-console
  app.listen(8080, () => console.log("started server on http://localhost:8080"))
})()
