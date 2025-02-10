import { Telegraf } from "telegraf";
import { Command } from "./command";
import { Context } from "./context";
import { getEnv } from "../helper/getEnv";
import { db } from "../db/models";

interface BotCommands {
  command: string;
  description: string;
  example: string;
}

export class Bot {
  bot: Telegraf;
  commands: BotCommands[];

  constructor() {
    const token = getEnv('TOKEN');
    this.bot = new Telegraf(token);
    this.commands = [];
  }

  async launch() {
    await db.init();
    this.bot.launch();
  }

  async add({ command, handler, description, example }: Command) {
    this.commands.push({
      command,
      description,
      example,
    });

    this.bot.command(command, async (ctx) => {
      try {
        await handler(new Context(ctx));
      } catch (error) {
        ctx.react("😡");
        console.log(error);
      }
    });

    this.bot.command("commands", async (ctx) => {
      let msg = "";
      for (const item of this.commands) {
        msg += `<b>/${item.command}</b> - ${item.description ?? "?"}\n`;
        if (item.example) {
          msg += `Пример: <code>/${item.command} ${item.example}</code>\n`;
        }
        msg += "\n";
      }

      await ctx.sendMessage(msg, {
        parse_mode: "HTML",
      });
    });
  }
}
