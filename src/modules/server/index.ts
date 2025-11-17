import express, { Express, Request, Response } from "express";
import { DBPayload } from "../db";
import { getMrStatus } from "./helpers/getMrStatus";

let sendToChat = (m: string) => {};

export function createHookServer(dbPayload: DBPayload) {
    const app: Express = express();
    const port = 3333;

    app.use(express.json());

    app.post("/", async (req: Request, res: Response) => {
        const data = req.body;
        res.send("ok");

        try {
            console.log(JSON.stringify(data, null, 1));
            console.log("------------------");

            if (data && typeof data === "object") {
                const mrInfo = getMrStatus(data);

                if (mrInfo) {
                    switch (mrInfo.status) {
                        case "set_reviewer": {
                            const user = await dbPayload.getUserByGitId(mrInfo.reviewerGitId);

                            if (user) {
                                sendToChat(`@${user.tgId} тебе на ревью задачка\n${mrInfo.mrLink}`);
                            }

                            break;
                        }
                        case "open_discusses": {
                            const assigner = await dbPayload.getUserByGitId(mrInfo.assigneGitId);
                            const reviewer = await dbPayload.getUserByGitId(mrInfo.reviewerGitId);

                            if (assigner && reviewer) {
                                sendToChat(`@${assigner.tgId}, тебе дискусы от @${reviewer.tgId}\n${mrInfo.mrLink}`);
                            }

                            break;
                        }
                        case "close_discusses": {
                            const assigner = await dbPayload.getUserByGitId(mrInfo.assigneGitId);
                            const reviewer = await dbPayload.getUserByGitId(mrInfo.reviewerGitId);

                            if (assigner && reviewer) {
                                sendToChat(
                                    `@${reviewer.tgId}, @${assigner.tgId} поправил все дискусы\n${mrInfo.mrLink}`
                                );
                            }

                            break;
                        }
                        case "approve": {
                            const assigner = await dbPayload.getUserByGitId(mrInfo.assigneGitId);
                            const reviewer = await dbPayload.getUserByGitId(mrInfo.reviewerGitId);

                            if (assigner && reviewer) {
                                let message = `@${assigner.tgId}, @${reviewer.tgId} апрувнул мр\n${mrInfo.mrLink}`;

                                if (mrInfo.isDraft) {
                                    message += "\nне забудь поправить draft";
                                }

                                sendToChat(message);
                            }

                            break;
                        }

                        default:
                            break;
                    }
                }
            }
        } catch (error) {
            console.log("try error", error);
        }
    });

    return {
        launch(): Promise<void> {
            return new Promise((resolve) => {
                app.listen(port, () => {
                    resolve();
                    console.log(`started http://localhost:${port}`);
                });
            });
        },
        setSendToChant: (_sendToChat: (m: string) => void) => {
            sendToChat = _sendToChat;
        },
    };
}
