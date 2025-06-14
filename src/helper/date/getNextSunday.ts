import { getNextMonday } from "./getNextMonday";

export function getNextSunday() {
    const nextMonday = getNextMonday();
    const nextSunday = new Date(nextMonday);

    nextSunday.setDate(nextSunday.getDate() + 7);

    return nextSunday;
}
