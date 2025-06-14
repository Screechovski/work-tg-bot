import { createCommand, createCommandHandler } from "../../../core/command";
import { getNextSunday } from "../../../helper/date/getNextSunday";
import { getNextMonday } from "../../../helper/date/getNextMonday";
import { getDateForUser, getDateFromUser } from "../../../helper/date/getDateUser";
import { getDateForDatabase } from "../../../helper/date/getDateDatabase";

const vacationHandler = createCommandHandler(async (ctx) => {
    const date = ctx.message.split(" ")[1];

    let startDate: Date;
    let endDate: Date;

    if (!date) {
        startDate = getNextMonday();
        endDate = getNextSunday();
    } else {
        const splited = date.split("-");
        startDate = getDateFromUser(splited[0]);

        if (!splited[1]) {
            const tmpDate = getDateFromUser(splited[0]);
            tmpDate.setDate(tmpDate.getDate() + 7);
            endDate = tmpDate;
        } else {
            endDate = getDateFromUser(splited[1]);
        }
    }

    const user = await ctx.getAuthor();

    if (!user) {
        throw Error("пользователь не определён");
    }

    user.vacationStart = getDateForDatabase(startDate);
    user.vacationEnd = getDateForDatabase(endDate);

    await user.save();

    await ctx.react("👍");
});

export const vacationCommand = createCommand(
    "vacation",
    vacationHandler,
    "Добавляет возможность назначить отпуск пользователю",
    [
        `${getDateForUser(getNextMonday())}-${getDateForUser(getNextSunday())}`,
        [`${getDateForUser(getNextMonday())}`, "вторая дата будет считаться +7 дней"],
        ["", "первая дата - это следующий понедельник, вторая дата - это +7 дней к первой дате"],
    ]
);
