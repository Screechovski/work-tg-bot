export function getLines(text: string) {
  return text
    .split("\n")
    .map((i) => i.trim().split(" "))
    .flat();
}
