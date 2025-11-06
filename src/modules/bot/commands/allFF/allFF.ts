import { createCommand, createCommandHandler } from "../../command";

const allFFHandler = createCommandHandler(async (ctx, getAllUsers) => {
    const users = await getAllUsers();
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
