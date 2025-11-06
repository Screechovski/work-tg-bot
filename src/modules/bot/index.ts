import { Agent } from "node:https";
import { Telegraf } from "telegraf";
import { getEnv } from "../../helper/getEnv";
import { DBPayload } from "../db";
import { getExampleMessage } from "./helper";
import { Command } from "./command";
import { allFCommand } from "./commands/allF/allF";
import { allFFCommand } from "./commands/allFF/allFF";
import { vacationCommand } from "./commands/vacation/vacation";
import { stopVacationCommand } from "./commands/vacation/stopVacation";
import { createContext } from "./context";

export function initBot(payload: DBPayload) {
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

    const commands: Command[] = [allFCommand, allFFCommand, vacationCommand, stopVacationCommand];

    bot.command("commands", async (ctx) => {
        let msg = "";

        for (const item of commands) {
            msg += getExampleMessage(item.command, item.example, item.description);
        }

        await ctx.sendMessage(msg, {
            parse_mode: "HTML",
        });
    });

    for (const { command, handler } of commands) {
        bot.command(command, async (_ctx) => {
            const ctx = createContext(_ctx, payload.getUserByTgId);

            try {
                await handler(ctx, payload.getAllUsers);
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
        launch: bot.launch,
        sendToReviewChat(text: string) {
            bot.telegram.sendMessage(+getEnv("CHAT_ID"), text, {
                message_thread_id: +getEnv("REVIEW_TREAD_ID"),
            });
        },
        setAddDisableMrUrl(_add: (url: string) => void) {
            // TODO идея для будущего, при первом сообщении об созданом мр, добавлять кнопку, которая убирает прослушку с этого мр
        },
    };
}
