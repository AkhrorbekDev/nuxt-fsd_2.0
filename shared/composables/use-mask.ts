import { Mask } from "maska"
import type { MaskType } from "maska"

export const useMask = () => {
  const masked = (value: string, mask: MaskType) => new Mask({ mask }).masked(value)
  const unmasked = (value: string, mask: MaskType) => new Mask({ mask }).unmasked(value)

  return { masked, unmasked }
}
