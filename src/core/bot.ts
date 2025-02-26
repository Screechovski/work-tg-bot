import { Telegraf } from "telegraf";
import { Command } from "./command";
import { createContext } from "./context";
import { getEnv } from "../helper/getEnv";
import { Database } from "../db/models";

interface BotCommands {
    command: string;
    description: string;
    example: string;
}

export function createBot(db: Database) {
    const token = getEnv("TOKEN");
    const bot = new Telegraf(token);
    const commands: BotCommands[] = [];

    async function launch(): Promise<void> {
        bot.command("commands", async (ctx) => {
            let msg = "";

            for (const item of commands) {
                msg += `<b>/${item.command}</b> - ${item.description ?? "?"}\n`;

                if (item.example) {
                    msg += `Пример: <code>/${item.command} ${item.example}</code>\n`;
                }

                msg += "\n";
            }

            await ctx.sendMessage(msg, {
                parse_mode: "HTML",
            });
        });

        return new Promise((resolve) => {
            bot.launch(resolve);
        });
    }

    function hasCommand(command: string) {
        return Boolean(commands.find((item) => item.command === command));
    }

    async function add({ command, handler, description, example }: Command) {
        if (hasCommand(command)) {
            throw Error(`Command ${command} already exist`);
        }

        commands.push({ command, description, example });

        bot.command(command, async (ctx) => {
            try {
                await handler(createContext(ctx, db), db);
            } catch (error) {
                ctx.react("😡");
                console.log(error);
            }
        });
    }

    return {
        launch,
        add,
        sendToReviewChat(text: string) {
            bot.telegram.sendMessage(-1002207395842, text, {
                message_thread_id: 2,
            });
        },
    };
}
