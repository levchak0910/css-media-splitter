import type { Handler } from "../models/Handler"
import type { MediaManifest } from "../models/Media"

export function getHandler(mediaManifest: MediaManifest): Handler {
  const manifestContent = JSON.stringify(mediaManifest)
  const manifestHTML = `<script id="<POST_BUILD: INSERT TEMPLATE ID>" type="application/json">${manifestContent}</script>`

  const handlerContent = "<POST_BUILD: INSERT TEMPLATE OBSERVER>"
  const handlerHTML = `<script>${handlerContent}</script>`

  const finalHTML = [manifestHTML, "\n", handlerHTML, "\n"].join("")

  return {
    script: {
      content: handlerContent,
      html: handlerHTML,
    },
    manifest: {
      content: manifestContent,
      html: manifestHTML,
    },
    html: finalHTML,
  }
}
