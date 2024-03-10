import { MediaRecord } from "@/api";
import { getLinkHref } from "./extract-media-data";

export function getNativeLinksHtml(mediaData: MediaRecord[]): string
{
    return mediaData.map(record => buildLinkElement(record)).join("\n");
}

function buildLinkElement(record: MediaRecord): string {
    return `<link rel="stylesheet" crossorigin media="${record.mediaQuery}" href="${getLinkHref(record.mediaQuery, record.filePath)}">`;
}