import { initBot } from "./modules/bot";
import { createHookServer } from "./modules/server";
import { initDB } from "./modules/db";
import { getEnv } from "./helper/getEnv";

async function main() {
    try {
        const dbExported = await initDB();

        const bot = initBot(dbExported);

        await bot.launch();

        if (getEnv("WITH_WEBHOOKS")) {
            const server = createHookServer(dbExported);
            server.setSendToChant(bot.sendToReviewChat);
            await server.launch();
        }
    } catch (error) {
        console.log("main error::", error);
    }
}

main();
