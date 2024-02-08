export interface MediaData {
  filePath: string
  fileName: string
  name: string
  query: string
  nodeContents: string[]
}

export type MediaManifest = Record<string, Array<readonly [query: string, file: string]>>
