import { Markup } from "telegraf";
import { createCommand } from "../command";

export const reviewCommand = createCommand(
    "review",
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
/review
https://git.fix-price.ru/ecom/frontend/buyer-front-web/-/merge_requests/4038
        */

        await ctx
            .getRootCtx()
            .sendMessage(
                "@user2 тебе пришло на ревью https://git.fix-price.ru/ecom/frontend/buyer-front-web/-/merge_requests/4038 от @dmyavl",
                Markup.inlineKeyboard([
                    Markup.button.callback("Апрув", "option_1_callback"),
                    Markup.button.callback("Доработать", "option_3_callback"),
                    Markup.button.callback("Ревью", "option_2_callback"),
                ])
            );
    },
    "",
    ""
);
