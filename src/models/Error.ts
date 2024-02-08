export class LibError extends Error {
  constructor(message: string, cause?: Error) {
    super(message, { cause })
  }
}
