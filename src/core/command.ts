import type { Database } from "../db/models";
import type { Context } from "./context";

type Handler = (ctx: Context, db: Database) => Promise<void>;

export function createCommandHandler(callback: Handler): Handler {
    return callback;
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
