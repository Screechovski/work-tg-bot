import { Markup } from "telegraf";
import { createCommand } from "../command";

export const releaseCommand = createCommand(
    "release",
    async (ctx) => {
        // const rootCtx = ctx.getRootCtx();

        //  rootCtx.message.chat.type=group - беседа
        //  rootCtx.message.chat.type=supergroup - беседа с топиками

        // if ("is_forum" in rootCtx.message.chat) {
        //     console.log(JSON.stringify(rootCtx.message.chat.is_forum));
        // }

        // await ctx.reply(JSON.stringify(rootCtx.message.chat));

        // await ctx.reply(rootCtx?.message?.message_thread_id);

        // console.log(JSON.stringify(rootCtx?.message));

        // console.log(rootCtx?.message?.message_thread_id);
        // console.log(ctx.getRootCtx()?.chat);
        // console.log(rootCtx.from);

        // ctx.send('<a href="https://t.me/marallada">youtube</a>');

        /*
/release
Витрина
https://srt.fix-price.ru/jira/browse/ECOMFRONT-6039

/release
crm
https://srt.fix-price.ru/jira/browse/ECOMFRONT-6040

/release
Витрина
https://srt.fix-price.ru/jira/browse/ECOMFRONT-6041
promo
https://srt.fix-price.ru/jira/browse/ECOMFRONT-6042
        */

        // await ctx.react("✍");

        await ctx.send("@dmyavl");
        await ctx.send("Витрина");
        await ctx
            .getRootCtx()
            .sendMessage(
                "https://srt.fix-price.ru/jira/browse/ECOMFRONT-6041",
                Markup.inlineKeyboard([Markup.button.callback("Запушить", "option_1_callback")])
            );
        await ctx
            .getRootCtx()
            .sendMessage(
                "https://srt.fix-price.ru/jira/browse/ECOMFRONT-6039",
                Markup.inlineKeyboard([Markup.button.callback("Запушить", "option_1_callback")])
            );
        await ctx.send("crm");
        await ctx
            .getRootCtx()
            .sendMessage(
                "https://srt.fix-price.ru/jira/browse/ECOMFRONT-6040",
                Markup.inlineKeyboard([Markup.button.callback("Запушить", "option_1_callback")])
            );
        await ctx.send("promo");
        await ctx
            .getRootCtx()
            .sendMessage(
                "https://srt.fix-price.ru/jira/browse/ECOMFRONT-6042",
                Markup.inlineKeyboard([Markup.button.callback("Запушить", "option_1_callback")])
            );
    },
    "",
    ""
);
