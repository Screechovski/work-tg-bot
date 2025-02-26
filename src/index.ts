import { db } from "./db/models";
import { createBot } from "./core/bot";
import { createHookServer } from "./hooks";
import { allFFCommand } from "./commands/general/allFF/allFF";
import { allFCommand } from "./commands/general/allF/allF";
import { testCommand } from "./commands/general/test";

// bot.command("poslanie", tryC(poslanieHandler));
// bot.command("all_f", tryC(allFrontendHandler));
// bot.command("release", tryC(releaseHandler));
// bot.command("release_list", tryC(releaseListHandler));
// bot.command("review", tryC(reviewHandler));
// bot.action("write_release", tryC(writeReleaseListener));
// bot.action("like_release", tryC(likeReleaseListener));
// bot.action("tag_release", tryC(tagReleaseListener));
// bot.action("cancel_release", tryC(cancelReleaseListener));
// bot.action("approve_review", tryC(approveReviewListener));
// bot.action("questions_review", tryC(questionReviewListener));
// bot.action("fixed_review", tryC(fixedReviewListener));
// bot.action("to_other_review", tryC(toOtherReviewListener));
// bot.action("approve_onemore_review", tryC(approveOnemoreReviewListener));

async function main() {
    try {
        const bot = createBot(db);

        await bot.add(allFCommand);
        // await bot.add(vacationCommand);
        await bot.add(testCommand);
        await bot.add(allFFCommand);
        const server = createHookServer(bot.sendToReviewChat);
        // server.on(bot.send);

        await db.init();
        console.log("DB inited");
        await bot.launch();
        console.log("BOT inited");
    } catch (error) {
        console.log(error);
    }
}

main();
