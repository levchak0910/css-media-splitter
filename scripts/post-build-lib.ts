import path from "node:path"

import { minify } from "uglify-js"
import { transformFileSync } from "@babel/core"

import { LIB_NAME } from "../src/config"

import { dir, file } from "../src/utils/fs"
import { getLinkHref, getMediaName } from "../src/functions/extract-media-data"

const INSERT_ID_KEY = "<POST_BUILD: INSERT TEMPLATE MANIFEST ID>"
const INSERT_ID_VALUE = `${LIB_NAME}--manifest`

const INSERT_LOADER_KEY = "<POST_BUILD: INSERT TEMPLATE OBSERVER>"

const INSERT_FUNCTION_getMediaName = `"<POST_BUILD: INSERT FUNCTION: getMediaName>"`
const INSERT_FUNCTION_getLinkHref = `"<POST_BUILD: INSERT FUNCTION: getLinkHref>"`

;(async () => {
  let observerFileSource = transformFileSync("src/template/observer.js", {
    ast: false,
    code: true,
    sourceMaps: false,
    comments: false,
    cloneInputAst: false,
    envName: "production",
    presets: ["@babel/preset-env"],
  })?.code ?? ""

  observerFileSource = observerFileSource.replace(INSERT_ID_KEY, INSERT_ID_VALUE)
  observerFileSource = observerFileSource.replace(INSERT_FUNCTION_getMediaName, getMediaName.toString())
  observerFileSource = observerFileSource.replace(INSERT_FUNCTION_getLinkHref, getLinkHref.toString())
  const observerFileCode = minify(observerFileSource, { toplevel: true }).code.replaceAll("\\", "\\\\").replace(/"/g, "\\\"")

  const files = await dir.read.files(path.resolve("dist"), { recursive: true, absolute: true })
  const jsFiles = files.filter(f => ["cjs", "mjs", "js"].some(ext => f.endsWith(`.${ext}`)))

  for await (const jsFilePath of jsFiles) {
    let jsContent = await file.read.plain(jsFilePath)
    jsContent = jsContent.replace(INSERT_ID_KEY, INSERT_ID_VALUE)
    jsContent = jsContent.replace(INSERT_LOADER_KEY, observerFileCode)
    await file.write.plain(jsFilePath, jsContent)
  }
})()
