import { LOADER_REPLACE_COMMENT } from "../config"

import { file } from "../utils/fs"

import type { FileData } from "../models/File"

interface WriteHTMLFilesOptions {
  html: string
  files: FileData[]
  replace?: Array<[searchValue: RegExp | string, replaceValue: string]>
}

export async function writeHTMLFiles(options: WriteHTMLFilesOptions) {
  const htmlFilePromises = options.files.map(async (htmlFile) => {
    let html = htmlFile.content
    let ready = false

    if (!ready) {
      const index = html.indexOf(LOADER_REPLACE_COMMENT)

      if (index > -1) {
        html = html.slice(0, index) + options.html + html.slice(index + LOADER_REPLACE_COMMENT.length)
        ready = true
      }
    }

    if (!ready) {
      const regexp = /<(script|link|style).+(src|href)=".+\.(js|css)"/
      const index = html.match(regexp)?.index ?? -1

      if (index > -1) {
        html = html.slice(0, index) + options.html + html.slice(index)
        ready = true
      }
    }

    if (options.replace?.length) {
      options.replace.forEach(([searchValue, replaceValue]) => {
        html = html.replace(searchValue, replaceValue)
      })
    }

    await file.write.plain(htmlFile.path.absolute, html)
  })

  await Promise.all(htmlFilePromises)
}
