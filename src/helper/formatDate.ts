export function formatDate(dateString: string) {
  const [d, m, y] = dateString.split(".");

  return `${y}.${m}.${d}`;
}
