import type { Loader } from "../models/Loader"
import type { MediaManifest } from "../models/Media"

export function getLoader(mediaManifest: MediaManifest): Loader {
  const manifestContent = JSON.stringify(mediaManifest)
  const manifestHTML = `<script id="<POST_BUILD: INSERT TEMPLATE MANIFEST ID>" type="application/json">${manifestContent}</script>`

  const loaderContent = "<POST_BUILD: INSERT TEMPLATE OBSERVER>"
  const loaderHTML = `<script>${loaderContent}</script>`

  const finalHTML = [manifestHTML, "\n", loaderHTML, "\n"].join("")

  return {
    script: {
      content: loaderContent,
      html: loaderHTML,
    },
    manifest: {
      content: manifestContent,
      html: manifestHTML,
    },
    html: finalHTML,
  }
}
