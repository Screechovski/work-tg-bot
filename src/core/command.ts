import { Context } from "./context";

type Handler = (ctx: Context) => Promise<void>;

export class Command {
    command: string;
    handler: Handler;
    description: string;
    example: string;

    constructor(command: string, handler: Handler, description: string, example: string) {
        this.command = command;
        this.handler = handler;
        this.description = description;
        this.example = example;
    }
}

export function createHandler(callback: Handler) {
    return async (ctx: Context) => {
        try {
            await callback(ctx);
        } catch (error) {
            ctx.react("😡");
            console.log(error);
        }
    };
}
