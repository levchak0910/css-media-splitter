export const formatFloat = (number: number): number => Number.parseFloat(number.toFixed(2))

export function formatBytes(bytes: number): string {
  if (Math.abs(bytes) < 1000)
    return `${bytes} B`

  const kb = bytes / 1000
  const mb = kb / 1000

  return Math.abs(mb) >= 1 ? `${formatFloat(mb)} MB` : `${formatFloat(kb)} kB`
}
