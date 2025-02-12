import { createCommand, createHandler } from "../../../core/command";

const allFHandler = createHandler(async (ctx, db) => {
    const users = await db.User.findAll();
    let message = "";

    for (const user of users) {
        if (user.tgId === ctx.username) {
            continue;
        }

        if (user.vacationStart && user.vacationEnd) {
            const startDate = new Date(user.vacationStart).getTime();
            const endDate = new Date(user.vacationEnd).getTime();
            const nowDate = new Date().getTime();

            if (startDate < nowDate && nowDate < endDate) {
                continue;
            }
        }

        message += `@${user.tgId} `;
    }

    await ctx.reply(message);
});

export const allFCommand = createCommand(
    "all_f",
    allFHandler,
    "Тегает всех пользователей не в отпуске в ответ на сообщение",
    "сообщение..."
);
