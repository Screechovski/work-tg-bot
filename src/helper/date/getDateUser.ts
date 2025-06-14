export function getDateForUser(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}.${month}.${year}`;
}

export function getDateFromUser(date: string): Date {
    const [d, m, y = new Date().getFullYear()] = date.split(".");

    let year = String(y);

    if (year.length === 2) {
        year = "20" + year;
    }

    return new Date(+year, +m - 1, +d);
}
