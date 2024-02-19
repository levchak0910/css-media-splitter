export interface MediaRecord {
  filePath: string
  fileBase: string
  mediaName: string
  mediaQuery: string
  nodeContents: string[]
}

export type MediaManifest = Record<string, string[]>
