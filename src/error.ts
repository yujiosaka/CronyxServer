/**
 * @public
 */
export class CronyxServerError extends Error {
  /**
   * @internal
   */
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }

  /**
   * @internal
   */
  get [Symbol.toStringTag](): string {
    return this.constructor.name;
  }
}
