export function formatDate(dateString: string) {
    const [d, m, y = new Date().getFullYear()] = dateString.split(".");

    return `${y}.${m}.${d}`;
}
