import { Command } from "../../core/command";

export const testCommand = new Command(
  "test",
  async (ctx) => {
    ctx.send('<a href="https://t.me/marallada">youtube</a>');
  },
  "",
  "",
);
