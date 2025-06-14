import { Agent } from "node:https";
import { Telegraf } from "telegraf";
import { Command } from "./command";
import { createContext } from "./context";
import { getEnv } from "../helper/getEnv";
import { Database } from "../db/models";

type BotCommands = Omit<Command, "handler">;

export function createBot(db: Database) {
    const token = getEnv("TOKEN");

    const bot = new Telegraf(token, {
        telegram: {
            agent: new Agent({ keepAlive: false }),
        },
    });

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));

    bot.catch((error) => {
        console.warn("bot.catch::", error);
    });

    const commands: BotCommands[] = [];

    async function launch(): Promise<void> {
        bot.command("commands", async (ctx) => {
            let msg = "";

            for (const item of commands) {
                msg += `<b>/${item.command}</b> - ${item.description ?? "?"}\n`;

                if (item.example) {
                    if (Array.isArray(item.example)) {
                        msg += `Примеры:\n`;

                        item.example.forEach((example) => {
                            if (typeof example === "string") {
                                msg += `<code>/${item.command} ${example}</code>\n`;
                            } else {
                                msg += `<code>/${item.command} ${example[0]}</code> - ${example[1]}\n`;
                            }
                        });
                    } else {
                        msg += `Пример: <code>/${item.command} ${item.example}</code>\n`;
                    }
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

    function add({ command, handler, description, example }: Command) {
        if (hasCommand(command)) {
            throw Error(`Command ${command} already exist`);
        }

        commands.push({ command, description, example });

        bot.command(command, async (_ctx) => {
            const ctx = createContext(_ctx, db);
            try {
                await handler(ctx, db);
            } catch (error) {
                console.log("bot.command error::", error);
                ctx.react("😡");
                // @ts-ignore
                if (error?.message) {
                    // @ts-ignore
                    ctx.reply(error.message);
                }
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
        setAddDisableMrUrl(_add: (url: string) => void) {
            // todo идея для будущего, при первом сообщении об созданом мр, добавлять кнопку, которая убирает прослушку с этого мр
        },
    };
}
