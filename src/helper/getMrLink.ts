import { MR_REGEXP } from "./constants.js";
import { getLines } from "./getLines";

export function getMrLink(text: string) {
  const lines = getLines(text).slice(1);

  return lines.find((line) => MR_REGEXP.test(line));
}
