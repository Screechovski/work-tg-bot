import { createCommand, createCommandHandler } from "../../../core/command";

const allFFHandler = createCommandHandler(async (ctx, db) => {
    const users = await db.User.findAll();
    let message = "";

    for (const user of users) {
        if (user.tgId === ctx.username) {
            continue;
        }

        message += `@${user.tgId} `;
    }

    await ctx.reply(message);
});

export const allFFCommand = createCommand(
    "all_ff",
    allFFHandler,
    "Тегает всех пользователей в ответ на сообщение",
    "сообщение..."
);
