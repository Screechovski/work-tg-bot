import { initBot } from "./modules/bot";
import { createHookServer } from "./modules/server";
import { initDB } from "./modules/db";
import { getEnv } from "./helper/getEnv";

async function main() {
    try {
        const db = await initDB();
        console.log("база данных запущена");

        const bot = initBot(db);
        console.log("бот создан");

        if (getEnv("WITH_WEBHOOKS")) {
            const server = createHookServer(db);
            console.log("сервер создан");
            server.setSendToChant(console.log); //bot.sendToReviewChat);
            await server.launch();
            console.log("сервер запущен");
        }

        await bot.launch();
        console.log("бот запущен");
    } catch (error) {
        console.log("main error::", error);
    }
}

main();
