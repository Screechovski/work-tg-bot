import { createCommand } from "../../core/command";

export const testCommand = createCommand(
    "test",
    async (ctx) => {
        const rootCtx = ctx.getRootCtx();

        //  rootCtx.message.chat.type=group - беседа
        //  rootCtx.message.chat.type=supergroup - беседа с топиками

        if ("is_forum" in rootCtx.message.chat) {
            console.log(JSON.stringify(rootCtx.message.chat.is_forum));
        }

        // await ctx.reply(JSON.stringify(rootCtx.message.chat));

        // await ctx.reply(rootCtx?.message?.message_thread_id);

        // console.log(JSON.stringify(rootCtx?.message));

        console.log(rootCtx?.message?.message_thread_id);
        // console.log(ctx.getRootCtx()?.chat);
        // console.log(rootCtx.from);

        // ctx.send('<a href="https://t.me/marallada">youtube</a>');

        // await ctx.getRootCtx().sendMessage("test", {
        //     message_thread_id: 2,
        // });
    },
    "",
    ""
);
