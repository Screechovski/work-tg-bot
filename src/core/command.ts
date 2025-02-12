import type { Database } from "../db/models";
import type { Context } from "./context";

type Handler = (ctx: Context, db: Database) => Promise<void>;

export function createHandler(callback: Handler): Handler {
    return async (ctx: Context, db: Database) => {
        try {
            await callback(ctx, db);
        } catch (error) {
            ctx.react("😡");
            console.log(error);
        }
    };
}

export function createCommand(command: string, handler: Handler, description = "", example = "") {
    return {
        command,
        handler,
        description,
        example,
    };
}

export type Command = ReturnType<typeof createCommand>;
