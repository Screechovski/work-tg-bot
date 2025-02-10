import { formatDate } from "../../helper/formatDate";
import { Command } from "../../core/command";

async function vacationHandler(ctx) {
  const date = ctx.message.split(" ")[1];

  if (!date) {
    throw new Error();
  }

  const [startDate, endDate] = date.split("-");

  const user = await ctx.getAuthor();

  user.vacationStart = formatDate(startDate);
  user.vacationEnd = formatDate(endDate);

  await user.save();

  await ctx.react("👍");
}

export const vacationCommand = new Command(
  "vacation",
  vacationHandler,
  "Добавляет возможность назначить отпуск пользователю",
  "03.10.2024-10.10.2024",
);
