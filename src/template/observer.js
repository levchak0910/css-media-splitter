// @ts-check

/** @type {Record<string, string[]>} */
const mediaManifest = JSON.parse(document.getElementById("<POST_BUILD: INSERT TEMPLATE MANIFEST ID>").textContent)

/** @type {(query: string) => string} */
// @ts-expect-error -- will be replaced by post-build script
// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const getMediaName = "<POST_BUILD: INSERT FUNCTION: getMediaName>"

/** @type {(query: string, sourceUrl: string) => string} */
// @ts-expect-error -- will be replaced by post-build script
const getLinkHref = "<POST_BUILD: INSERT FUNCTION: getLinkHref>"

const isLinkInserted = (query, href) => !!document.querySelector(`link[href="${href}"][media="${query}"]`)

function insertLink(query, href) {
  if (isLinkInserted(query, href))
    return

  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.media = query
  link.href = href
  document.head.appendChild(link)
}

function createInsertLinkFn(query, href) {
  return (media) => {
    if (media.matches)
      insertLink(query, href)
  }
}

const observer = new MutationObserver((records) => {
  /** @type {HTMLLinkElement[]} */
  // @ts-expect-error -- cast
  const links = records
    .flatMap(r => Array.from(r.addedNodes ?? []))
    // @ts-expect-error -- rel exists on Node with nodeName === "LINK"
    .filter(node => node.nodeName === "LINK" && node.rel === "stylesheet")

  if (links.length === 0)
    return

  // @ts-expect-error -- href exist on HTMLLinkElement
  const existingUrls = Array.from(document.querySelectorAll("link[rel=stylesheet]")).map(node => node.href)
  const urls = links.map(link => new URL(link.href).pathname).filter(href => !existingUrls.includes(href))

  urls.forEach((url) => {
    const mediaQueries = mediaManifest[url]
    if (!mediaQueries)
      return

    mediaQueries.forEach((query) => {
      const href = getLinkHref(query, url)
      if (isLinkInserted(query, href))
        return

      const fireInsertLink = createInsertLinkFn(query, href)

      const isMatchMediaSupported = typeof matchMedia === "function"
      if (isMatchMediaSupported) {
        const media = matchMedia(query)
        fireInsertLink(media)
        media.addEventListener("change", fireInsertLink)
      }
      else {
        insertLink(query, href)
      }
    })
  })
})

observer.observe(document.head, { childList: true })
