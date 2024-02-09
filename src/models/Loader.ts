export interface Loader {
  script: {
    content: string
    html: string
  }
  manifest: {
    content: string
    html: string
  }
  html: string
}
