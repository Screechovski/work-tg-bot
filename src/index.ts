import { db } from "./db/models";
import { createBot } from "./core/bot";
import { createHookServer } from "./hooks";
import { allFFCommand } from "./commands/general/allFF/allFF";
import { allFCommand } from "./commands/general/allF/allF";
import { testCommand } from "./commands/general/test";
import { vacationCommand } from "./commands/general/vacation/vacation";
import { stopVacationCommand } from "./commands/general/vacation/stopVacation";

async function main() {
    try {
        const bot = createBot(db);
        // const server = createHookServer(db, bot.sendToReviewChat);

        bot.add(allFCommand);
        bot.add(allFFCommand);
        bot.add(vacationCommand);
        bot.add(stopVacationCommand);
        bot.add(testCommand);

        await db.init();
        // await server.launch();
        await bot.launch();
    } catch (error) {
        console.log(123, error);
    }
}

main();
