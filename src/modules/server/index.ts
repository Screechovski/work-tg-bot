import express, { Express, Request, Response } from "express";
import { DBPayload } from "../db";

let sendToChat = (m: string) => {};

export function createHookServer(payload: DBPayload) {
    const app: Express = express();
    const port = 3333;

    app.use(express.json());

    app.post("/", async (req: Request, res: Response) => {
        // const getUserByGitId = (username: string) => db.User.findOne({ where: { tgId: username } });

        const data = req.body;
        res.send("ok");

        let label = "";

        if (data.labels && data.labels.length === 1) {
            label = data.labels[0].title as "approve" | "discus" | "review";
        }

        console.log(`data \n ${JSON.stringify(data)} \n`);

        const prevReviewerId = null;
        const reviewerId = "string;";

        const isApproved = true;
        const isClosed = data.object_attributes.state === "closed";
        const isOpened = data.object_attributes.state === "opened";

        const isComment = data.event_type === "note";
        const isMR = data.event_type === "merge_request";

        const link = data.object_attributes.url;

        let status = "unknown";

        const mrAuthorId = data.merge_request.author_id;
        const mrAssignerId = data.assignees?.[0]?.id || mrAuthorId;
        const hookActionAuthorId = data.user.id;
        const currentReviewerId = data.reviewers?.[0].id;

        if (data.changes.reviewers.previous.length === 1 && data.changes.reviewers.previous.current === 1) {
            // change reviewer
        }

        // if (isComment) {
        //     return;
        // } else if (actionAuthorId === mrAuthorId && !isApproved && label === "" && prevReviewerId === null) {
        //     status = "create";
        // } else if (label === "discus") {
        //     status = "open_discusses";
        // } else if (label === "") {
        //     status = "close_discusses";
        // } else if (actionAuthorId === prevReviewerId && isApproved && label === "") {
        //     status = "next_reviewer";
        // } else if (actionAuthorId === reviewerId && isApproved && label === "approve") {
        //     status = "approve";
        // }

        if (isMR) {
            sendToChat(`\n\n ${new Date()} ${status}`);
        }

        // switch (mrStatus) {
        //     case "approve":
        //         sendToChat(`${mrAuthorId}, твой мр апрувнут ${reviewerId}, можешь отправлять в тест\n${link}`);
        //         break;
        //     case "create":
        //         sendToChat(`${mrAuthorId} назначил ${reviewerId} тебя ревьюером\n${link}`);
        //         break;
        //     case "open_discusses":
        //         sendToChat(`${reviewerId} оставил комменты, ${mrAuthorId} посмотри\n${link}`);
        //         break;
        //     case "close_discusses":
        //         sendToChat(`${mrAuthorId} поправил комменты, ${mrAuthorId} посмотри\n${link}`);
        //         break;
        //     case "next_reviewer":
        //         sendToChat(`${mrAuthorId}\n${prevReviewerId} апрувнул мр и назначил нового ревьюера - ${reviewerId} посмотри\n${link}`);
        //         break;
        //     default:
        //         break;
        // }
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
