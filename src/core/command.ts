import { Context } from "./context";

export class Command {
    command: string;
    description: string;
    example: string;

    constructor() {
        this.command = "";
        this.description = "";
        this.example = "";
    }

    protected async handler(ctx: Context) {
        return;
    }

    public async getHandler(ctx: Context) {
        try {
            await this.handler(ctx);
        } catch (error) {
            ctx.react("😡");
            console.log(error);
        }
    }
}
