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

    async function launch() {
        await db.init();
        await bot.launch();
    }

    function hasCommand(command: string) {
        return Boolean(commands.find((item) => item.command === command));
    }

    function addCommand(command: string, description: string, example: string) {
        commands.push({ command, description, example });
    }

    async function add({ command, handler, description, example }: Command) {
        if (hasCommand(command)) {
            throw Error(`Command ${command} already exist`);
        }

        addCommand(command, description, example);

        bot.command(command, async (ctx) => {
            try {
                await handler(createContext(ctx, db), db);
            } catch (error) {
                ctx.react("😡");
                console.log(error);
            }
        });

        bot.command("commands", async (ctx) => {
            let msg = "";

            console.log("commands work");

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
    }

    return {
        launch,
        add,
    };
}
