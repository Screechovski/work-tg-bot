import { db } from "./db/models";
import { createBot } from "./core/bot";
import { createHookServer } from "./hooks";
import { allFFCommand } from "./commands/general/allFF/allFF";
import { allFCommand } from "./commands/general/allF/allF";
import { testCommand } from "./commands/general/test";
import { vacationCommand } from "./commands/general/vacation/vacation";

async function main() {
    try {
        const bot = createBot(db);
        const server = createHookServer(db);

        bot.add(allFCommand);
        bot.add(vacationCommand);
        bot.add(testCommand);
        bot.add(allFFCommand);

        server.onHook(bot.sendToReviewChat);

        await db.init();
        await server.launch();
        await bot.launch();
    } catch (error) {
        console.log(error);
    }
}

main();
