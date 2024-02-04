import processCssMediaSplitter from "css-media-splitter/plain"
import { getBundleFiles, writeHTMLFiles } from "css-media-splitter/api"

(async () => {
  const { handler } = await processCssMediaSplitter({
    distDir: "dist",
    assetDir: "styles",
  })

  const { htmlFiles } = await getBundleFiles({
    distDir: "dist",
  })

  await writeHTMLFiles({
    assetDir: "styles",
    files: htmlFiles,
    html: handler.html,
  })
})()
