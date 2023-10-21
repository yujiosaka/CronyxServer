import debug from "debug";
import { CronyxServerError } from "./error";
import Source from "./source";

const logCronyxServer = debug("cronyx:server");

/**
 * @internal
 */
export function parseSource(source: string | undefined): Source {
  if (source && Object.values(Source).includes(source as Source)) {
    return source as Source;
  }

  throw new CronyxServerError(`Unsupported source: ${source}`);
}

/**
 * @internal
 */
export function parseOptions(json: string | undefined): unknown {
  if (!json) return undefined;

  try {
    return JSON.parse(json);
  } catch (error) {
    throw new CronyxServerError(`Cannot parse options: ${json}`);
  }
}

/**
 * @internal
 */
export function log(formatter: unknown, ...args: unknown[]) {
  logCronyxServer(formatter, ...args);
}
