import { createCommand } from "../../core/command";

export const testCommand = createCommand(
    "test",
    async (ctx) => {
        ctx.send('<a href="https://t.me/marallada">youtube</a>');
    },
    "",
    ""
);
