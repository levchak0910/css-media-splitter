/* eslint-disable no-console */

import nodeFS from "node:fs/promises"
import path from "node:path"

import { LibError } from "../models/Error"

function wrapFSCall<T extends (...args: any) => any>(fn: T): ((...args: Parameters<T>) => Promise<ReturnType<T>>) {
  return async (...args) => {
    try {
      // @ts-expect-error -- hard to type
      return await fn(...args)
    }
    catch (error) {
      console.log("-------------START-----------")
      console.log("🚀 ~ args:", args)
      console.log("🚀 ~ error:", error)
      console.log("🚀 ~ fn:", fn.toString())
      console.log("-------------END-----------")
      throw new LibError("FS ERROR")
    }
  }
}

const getPathStat = wrapFSCall(async (anyPath: string) => {
  return await nodeFS.stat(anyPath)
})
async function isDir(dirPath: string) {
  const stat = await getPathStat(dirPath)
  return stat.isDirectory()
}
async function isFile(filePath: string) {
  const stat = await getPathStat(filePath)
  return stat.isFile()
}

const createDir = wrapFSCall(async (dir: string) => {
  await nodeFS.mkdir(dir, { recursive: true })
})

const readDir = wrapFSCall(async (dir: string) => {
  try {
    const entries = await nodeFS.readdir(dir)
    return entries
  }
  catch (error) {
    if ((error as any).code === "ENOENT")
      return []
    else
      throw new LibError("FS ERROR", error as Error)
  }
})

async function readFiles(
  dir: string,
  options?: { removeExtension?: boolean, recursive?: boolean, absolute?: boolean },
): Promise<string[]> {
  const entries = await readDir(dir)

  let files: string[] = []

  for await (const entry of entries) {
    const entryPath = path.join(dir, entry)
    const isEntryFile = await isFile(entryPath)
    if (isEntryFile)
      files.push(entry)
  }

  if (options?.recursive) {
    for await (const entry of entries) {
      const entryPath = path.join(dir, entry)
      const isEntryDirectory = await isDir(entryPath)

      if (!isEntryDirectory)
        continue

      const nestedFiles = await readFiles(entryPath, { recursive: true })
      const joinedFiles = nestedFiles.map(f => path.join(entry, f))
      files.push(...joinedFiles)
    }
  }

  if (options?.absolute)
    files = files.map(f => path.join(dir, f))

  if (options?.removeExtension) {
    files = files.map((f) => {
      const { dir, name } = path.parse(f)
      return path.join(dir, name)
    })
  }

  return files
}

async function readDirectories(dir: string, options?: { recursive?: boolean, absolute?: boolean }): Promise<string[]> {
  const entries = await readDir(dir)

  let directories: string[] = []

  for await (const entry of entries) {
    const entryPath = path.join(dir, entry)
    const isEntryDir = await isDir(entryPath)
    if (isEntryDir)
      directories.push(entry)
  }

  if (options?.recursive) {
    for await (const directory of directories) {
      const subdirectoryPath = path.join(dir, directory)
      const subdirectoryDirectories = await readDirectories(subdirectoryPath, { recursive: true })
      const joinedSubdirectoryDirectories = subdirectoryDirectories.map(d => path.join(directory, d))
      directories.push(...joinedSubdirectoryDirectories)
    }
  }

  if (options?.absolute)
    directories = directories.map(d => path.join(dir, d))

  return directories
}

export const dir = {
  create: createDir,
  read: {
    entries: readDir,
    files: readFiles,
    directories: readDirectories,
  },
}

const readPlainFile = wrapFSCall(async (filePath: string) => {
  const fileContent = await nodeFS.readFile(filePath, "utf-8")
  return fileContent
})

async function readJSON<T>(filePath: string): Promise<T> {
  const fileContent = await readPlainFile(filePath)
  return JSON.parse(fileContent) as T
}

const readImage = wrapFSCall(async (imagePath: string) => {
  const fileBuffer = await nodeFS.readFile(imagePath)
  return fileBuffer
})

const writeFileContent = wrapFSCall(async (filePath: string, fileContent: string | Buffer) => {
  const fileDir = path.parse(filePath).dir
  await dir.create(fileDir)
  await nodeFS.writeFile(filePath, fileContent)
})
async function writeFile(filePath: string, fileContent: string) {
  await writeFileContent(filePath, fileContent)
}
async function writeImage(imagePath: string, imageBuffer: Buffer) {
  await writeFileContent(imagePath, imageBuffer)
}
async function writeJSON(filePath: string, data: any) {
  const fileContent = JSON.stringify(data, null, 2)
  await writeFileContent(filePath, fileContent)
}

const removeFile = wrapFSCall(async (filePath: string) => {
  await nodeFS.unlink(filePath)
})

async function copyFile(filePath: string, destPath: string) {
  await nodeFS.copyFile(filePath, destPath)
}

const isFileExist = wrapFSCall(async (filePath: string) => {
  try {
    await nodeFS.stat(filePath)
    return true
  }
  catch (error) {
    if ((error as any).code === "ENOENT")
      return false

    else
      throw new LibError("FS ERROR", error as any)
  }
})

export const file = {
  read: {
    plain: readPlainFile,
    json: readJSON,
    image: readImage,
  },
  write: {
    plain: writeFile,
    json: writeJSON,
    image: writeImage,
  },
  remove: removeFile,
  copy: copyFile,
  exist: isFileExist,
}
