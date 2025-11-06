import type { Context as TelegrafContext } from "telegraf";
import type { TelegramEmoji } from "telegraf/typings/core/types/typegram.js";
import type { Update, Message } from "telegraf/types";
import { getLines } from "../../helper/getLines";
import { DBPayload } from "../db";

type TextMessageContext = TelegrafContext<Update.MessageUpdate<Message.TextMessage>>;

export function createContext(ctx: TextMessageContext, getUserByGitUsername: DBPayload["getUserByGitUsername"]) {
    const message = ctx.message?.text;
    const username = ctx.message.from.username;

    const lines = getLines(message);

    function getAuthor() {
        return getUserByGitUsername(username ?? "");
    }

    function send(text: string) {
        return ctx.sendMessage(text, {
            parse_mode: "HTML",
        });
    }

    function reply(text: string) {
        return ctx.reply(text, {
            reply_parameters: {
                message_id: ctx.message.message_id,
            },
        });
    }

    function react(symbol: TelegramEmoji) {
        return ctx.react(symbol);
    }

    function randomSuccessReact() {
        return react("🆒");
    }

    function getRootCtx() {
        return ctx;
    }

    return {
        message,
        username,
        lines,
        getAuthor,
        send,
        reply,
        react,
        randomSuccessReact,
        getRootCtx,
    };
}

export type Context = ReturnType<typeof createContext>;
