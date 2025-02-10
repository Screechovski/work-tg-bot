import { Command, createHandler } from "../../core/command";
import { User } from "../../db/models";

const allFFHandler = createHandler(async (ctx) => {
    const users = await User.findAll();
    let message = "";

    for (const user of users) {
        if (user.tgId === ctx.username) {
            continue;
        }
        message += `@${user.tgId} `;
    }

    await ctx.reply(message);
});

export const allFFCommand = new Command(
    "all_ff",
    allFFHandler,
    "Тегает всех пользователей в ответ на сообщение",
    "сообщение..."
);
