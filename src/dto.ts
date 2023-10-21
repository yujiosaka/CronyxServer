import { t } from "elysia";

/**
 * @internal
 */
export const HealthcheckResponseDTO = t.Object({
  ok: t.Boolean(),
});
