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
