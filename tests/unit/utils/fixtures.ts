import path from "node:path"

import { afterEach, beforeEach } from "vitest"
import { rimraf } from "rimraf"
import cpx from "cpx"

import { dir, file } from "@/utils/fs"

const TESTS_ROOT_PATH = path.resolve("tests", "unit")

const COMPILED_FOLDER_PATH = path.join(TESTS_ROOT_PATH, "fixtures", "compiled")
const COMPILED_SMALL_APP_PATH = path.join(COMPILED_FOLDER_PATH, "app-small")
const COMPILED_BIG_APP_PATH = path.join(COMPILED_FOLDER_PATH, "app-big")

const SMALL_APP_PATH = path.join(TESTS_ROOT_PATH, "fixtures", "app-small")
const BIG_APP_PATH = path.join(TESTS_ROOT_PATH, "fixtures", "app-big")

export function prepareFixtures() {
  beforeEach(async () => {
    await dir.create(COMPILED_SMALL_APP_PATH)
    await dir.create(COMPILED_BIG_APP_PATH)
    cpx.copySync(`${SMALL_APP_PATH}/**/*`, COMPILED_SMALL_APP_PATH)
    cpx.copySync(`${BIG_APP_PATH}/**/*`, COMPILED_BIG_APP_PATH)
  })
  afterEach(async () => {
    const gitignorePath = path.resolve(COMPILED_FOLDER_PATH, ".gitignore")
    const gitignore = await file.read.plain(gitignorePath)
    await rimraf(COMPILED_FOLDER_PATH, { preserveRoot: true })
    await file.write.plain(gitignorePath, gitignore)
  })

  return {
    COMPILED_FOLDER_PATH,
    COMPILED_SMALL_APP_PATH,
    COMPILED_BIG_APP_PATH,
    SMALL_APP_PATH,
    BIG_APP_PATH,
  }
}
