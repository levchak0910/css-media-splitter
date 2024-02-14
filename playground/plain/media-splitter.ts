import processCssMediaSplitter from "css-media-splitter/plain"
import { getBundleFiles, stringifyReport, writeHTMLFiles } from "css-media-splitter/api"

(async () => {
  const result = await processCssMediaSplitter({
    distDir: "dist",
    assetDir: "styles",
  })

  if (result === null)
    return

  const { htmlFiles } = await getBundleFiles({
    distDir: "dist",
  })

  await writeHTMLFiles({
    assetDir: "styles",
    files: htmlFiles,
    html: result.loader.html,
  })

  // eslint-disable-next-line no-console
  console.log(stringifyReport(result.report))
})()
