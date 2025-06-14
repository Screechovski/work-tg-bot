export function getDateForDatabase(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${year}.${month + 1}.${day}`;
}

export function getDateFromDatabase(date: string): Date {
    return new Date(date);
}
