import { db } from "./db/models";
import { createBot } from "./core/bot";
import { createHookServer } from "./hooks";
import { allFFCommand } from "./commands/general/allFF/allFF";
import { allFCommand } from "./commands/general/allF/allF";
import { testCommand } from "./commands/general/test";
import { vacationCommand } from "./commands/general/vacation/vacation";
import { stopVacationCommand } from "./commands/general/vacation/stopVacation";
import { getEnv } from "./helper/getEnv";

async function main() {
    try {
        // const bot = createBot(db);

        // bot.add(allFCommand);
        // bot.add(allFFCommand);
        // bot.add(vacationCommand);
        // bot.add(stopVacationCommand);
        // bot.add(testCommand);

        await db.init();
        console.log("база данных запущена");

        if (getEnv("WITH_WEBHOOKS") === "true") {
            const server = createHookServer(db);
            server.setSendToChant((message) => console.log("tochat message: ", message));
            await server.launch();
            console.log("сервер для webhook'ов запущен");
        }
        // await bot.launch();
        // console.log("бот запущен");
    } catch (error) {
        console.log(123, error);
    }
}

main();
