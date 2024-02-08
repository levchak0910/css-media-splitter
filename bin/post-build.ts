import path from "node:path"

import { minify } from "uglify-js"

import { LIB_NAME } from "../src/config"

import { dir, file } from "../src/utils/fs"

const INSERT_ID_KEY = "<POST_BUILD: INSERT TEMPLATE ID>"
const INSERT_ID_VALUE = `${LIB_NAME}--id`

const INSERT_HANDLER_KEY = "<POST_BUILD: INSERT TEMPLATE OBSERVER>"

;(async () => {
  let observerFileSource = await file.read.plain("src/template/observer.js")
  observerFileSource = observerFileSource.replace(INSERT_ID_KEY, INSERT_ID_VALUE)
  const observerFileCode = minify(observerFileSource, { toplevel: true }).code.replace(/"/g, "\\\"")

  const files = await dir.read.files(path.resolve("dist"), { recursive: true, absolute: true })
  const jsFiles = files.filter(f => ["cjs", "mjs", "js"].some(ext => f.endsWith(`.${ext}`)))

  for await (const jsFilePath of jsFiles) {
    let jsContent = await file.read.plain(jsFilePath)
    jsContent = jsContent.replace(INSERT_ID_KEY, INSERT_ID_VALUE)
    jsContent = jsContent.replace(INSERT_HANDLER_KEY, observerFileCode)
    await file.write.plain(jsFilePath, jsContent)
  }
})()
