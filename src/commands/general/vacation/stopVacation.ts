import { createCommand, createCommandHandler } from "../../../core/command";

const stopVacationHandler = createCommandHandler(async (ctx) => {
    const user = await ctx.getAuthor();

    if (!user) {
        throw Error("пользователь не определён");
    }

    user.vacationStart = null;
    user.vacationEnd = null;

    await user.save();

    await ctx.react("👍");
});

export const stopVacationCommand = createCommand(
    "stop_vacation",
    stopVacationHandler,
    "Сбрасывает текущий отпуск у автора",
    ""
);
