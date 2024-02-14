export type Report = Record<string, {
  content: {
    original: number
    transformed: number
  }
  mediaFiles: Array<{
    path: string
    size: number
    query: string
  }>
}>
