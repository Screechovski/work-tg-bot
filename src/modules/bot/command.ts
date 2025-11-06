import { DBPayload } from "../db";
import { Context } from "./context";

type Handler = (ctx: Context, getAllUsers: DBPayload["getAllUsers"]) => Promise<void>;

export function createCommandHandler(callback: Handler): Handler {
    return callback;
}

export function createCommand(
    command: string,
    handler: Handler,
    description = "",
    example: string | ([string, string] | string)[] = ""
) {
    return {
        command,
        handler,
        description,
        example,
    };
}

export type Command = ReturnType<typeof createCommand>;
