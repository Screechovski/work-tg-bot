import express, { Express, Request, Response } from "express";
import { Database } from "../db/models";
import { getMergeRequestInfo } from "./helpers/getMergeRequestInfo";
import { getMergeRequestStatus } from "./helpers/getMergeRequestStatus";

let sendToChat = (message: string) => {};

export function createHookServer(db: Database) {
    const app: Express = express();
    const port = 3333;

    app.use(express.json());

    app.post("/", async (req: Request, res: Response) => {
        // const getUserByGitId = (username: string) => db.User.findOne({ where: { tgId: username } });
        console.log("               ");
        console.log("               ");
        console.log("               ");
        console.log(JSON.stringify(req.body));

        const mrInfo = getMergeRequestInfo(req.body);
        const mrStatus = getMergeRequestStatus(mrInfo);

        switch (mrStatus) {
            case "approve":
                console.log(
                    `${mrInfo.mrAuthorId}, твой мр апрувнут ${mrInfo.reviewerId}, можешь отправлять в тест\n${mrInfo.link}`
                );
                break;
            case "create":
                console.log(`${mrInfo.mrAuthorId} назначил ${mrInfo.reviewerId} тебя ревьюером\n${mrInfo.link}`);
                break;
            case "open_discusses":
                console.log(`${mrInfo.reviewerId} оставил комменты, ${mrInfo.mrAuthorId} посмотри\n${mrInfo.link}`);
                break;
            case "close_discusses":
                console.log(`${mrInfo.mrAuthorId} поправил комменты, ${mrInfo.mrAuthorId} посмотри\n${mrInfo.link}`);
                break;
            case "next_reviewer":
                console.log(
                    `${mrInfo.mrAuthorId}\n${mrInfo.prevReviewerId} апрувнул мр и назначил нового ревьюера - ${mrInfo.reviewerId} посмотри\n${mrInfo.link}`
                );
                break;

            default:
                break;
        }

        res.send("ok");
    });

    return {
        launch(): Promise<void> {
            return new Promise((resolve) => {
                app.listen(port, () => {
                    resolve();
                    console.log(`SERVER inited\n  http://localhost:${port}`);
                });
            });
        },

        setSendToChant: (_sendToChat: (m: string) => void) => {
            sendToChat = _sendToChat;
        },
    };
}
