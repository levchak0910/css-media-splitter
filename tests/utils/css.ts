export function compressCSS(css: string): string {
  css = css.replaceAll("\n", "")
  css = css.replace(/\s+/g, " ")
  css = css.trim()
  return css
}
