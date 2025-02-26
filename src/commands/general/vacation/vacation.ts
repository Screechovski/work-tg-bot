import { formatDate } from "../../../helper/formatDate";
import { createCommand, createCommandHandler } from "../../../core/command";

const vacationHandler = createCommandHandler(async (ctx) => {
    const date = ctx.message.split(" ")[1];

    if (!date) {
        throw new Error();
    }

    const [startDate, endDate] = date.split("-");

    const user = await ctx.getAuthor();

    if (!user) throw Error("пользователь не найден");

    user.vacationStart = formatDate(startDate);
    user.vacationEnd = formatDate(endDate);

    await user.save();

    await ctx.react("👍");
});

export const vacationCommand = createCommand(
    "vacation",
    vacationHandler,
    "Добавляет возможность назначить отпуск пользователю",
    "03.10.2024-10.10.2024"
);
