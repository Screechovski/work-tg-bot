import type { Context as TelegrafContext } from "telegraf";
import { TelegramEmoji } from "telegraf/typings/core/types/typegram.js";
import type { Update, Message } from "telegraf/types";
import { getLines } from "../helper/getLines";
import { User } from "../db/models";

type TextMessageContext = TelegrafContext<Update.MessageUpdate<Message.TextMessage>>;

export class Context {
    _ctx: TextMessageContext;

    constructor(ctx: TextMessageContext) {
        this._ctx = ctx;
    }

    get message() {
        return this._ctx.message?.text;
    }

    get username() {
        return this._ctx.message.from.username;
    }

    get lines() {
        return getLines(this.message);
    }

    getAuthor() {
        return User.findOne({ where: { tgId: this.username } });
    }

    send(text: string) {
        return this._ctx.sendMessage(text, {
            parse_mode: "HTML",
        });
    }

    reply(text: string) {
        return this._ctx.reply(text, {
            reply_parameters: {
                message_id: this._ctx.message.message_id,
            },
        });
    }

    react(symbol: TelegramEmoji) {
        return this._ctx.react(symbol);
    }
}
