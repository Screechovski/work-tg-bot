import { initBot } from "./modules/bot";
import { createHookServer } from "./modules/server";
import { initDB } from "./modules/db";
import { getEnv } from "./helper/getEnv";

async function main() {
    try {
        const dbExported = await initDB();
        console.log("база данных запущена");

        const bot = initBot(dbExported);
        console.log("бот создан");

        await bot.launch();
        console.log("бот запущен");

        if (getEnv("WITH_WEBHOOKS")) {
            const server = createHookServer(dbExported);
            console.log("сервер создан");
            server.setSendToChant(console.log); //bot.sendToReviewChat);
            await server.launch();
            console.log("сервер запущен");
        }
    } catch (error) {
        console.log("main error::", error);
    }
}

main();
