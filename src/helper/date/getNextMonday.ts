export function getNextMonday() {
    const today = new Date();
    const dayOfWeek = today.getDay();

    let daysToAdd = (7 - dayOfWeek + 1) % 7;

    // Если сегодня понедельник, то нам нужен следующий (через 7 дней)
    if (daysToAdd === 0) {
        daysToAdd = 7;
    }

    const nextMonday = new Date(today);

    nextMonday.setDate(today.getDate() + daysToAdd);

    return nextMonday;
}
