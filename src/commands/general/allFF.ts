import { Command } from "../../core/command";
import { Context } from "../../core/context";
import { User } from "../../db/models";

export class AllFFCommand extends Command {
    constructor() {
        super();
        this.command = "all_ff";
        this.description = "Тегает всех пользователей в ответ на сообщение";
        this.example = "сообщение...";
    }

    async handler(ctx: Context) {
        const users = await User.findAll();
        let message = "";

        for (const user of users) {
            if (user.tgId === ctx.username) {
                continue;
            }

            message += `@${user.tgId} `;
        }

        await ctx.reply(message);
    }
}
