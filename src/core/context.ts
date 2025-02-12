import type { Context as TelegrafContext } from "telegraf";
import type { TelegramEmoji } from "telegraf/typings/core/types/typegram.js";
import type { Update, Message } from "telegraf/types";
import type { Database } from "../db/models";
import { getLines } from "../helper/getLines";

type TextMessageContext = TelegrafContext<Update.MessageUpdate<Message.TextMessage>>;

export function createContext(ctx: TextMessageContext, db: Database) {
    const message = ctx.message?.text;
    const username = ctx.message.from.username;

    function getAuthor() {
        return db.User.findOne({ where: { tgId: username } });
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

    return {
        message,
        username,
        lines: getLines(message),
        getAuthor,
        send,
        reply,
        react,
        randomSuccessReact,
    };
}

export type Context = ReturnType<typeof createContext>;
