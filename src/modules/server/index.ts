import express, { Express, Request, Response } from "express";
import { DBPayload } from "../db";

let sendToChat = (m: string) => {};

const LABELS = {
    discuss: "discus",
    onReview: "review",
    approved: "approve",
};

export function createHookServer(payload: DBPayload) {
    const app: Express = express();
    const port = 3333;

    app.use(express.json());

    app.post("/", async (req: Request, res: Response) => {
        const data = req.body;
        res.send("ok");

        try {
            console.log(JSON.stringify(data));

            const isApproved = true;
            const isClosed = data.object_attributes.state === "closed";
            const isOpened = data.object_attributes.state === "opened";
            const isOpenAction = data.object_attributes.action === "open";

            const isComment = data.event_type === "note";
            const isMR = data.event_type === "merge_request";

            const link = data.object_attributes.url;

            let status = "unknown";

            const mrAuthorId = data.object_attributes.author_id;
            const mrAssignerId = data.assignees?.[0]?.id || mrAuthorId;
            const hookActionAuthorId = data.user.id;
            const currentReviewerId = data.reviewers?.[0].id;

            if (isOpenAction && currentReviewerId) {
                sendToChat(`\n\n ${new Date()} ${"created"}`);
                // создали мр сразу с ревьюером
            }

            if (data.changes?.reviewers?.current?.length === 1) {
                sendToChat(`\n\n ${new Date()} ${data.changes.reviewers.current[0].id} тебе упала задачка на ревью`);
                // поставили ревьюера
            }

            if (
                data.changes?.reviewers?.previous.length === 1 &&
                data.changes?.reviewers?.previous.current === 1 &&
                mrAssignerId !== hookActionAuthorId
            ) {
                // change reviewer
            }

            if (
                data.changes?.labels?.current?.find((l: { title: string }) => l.title === LABELS.discuss) &&
                currentReviewerId === hookActionAuthorId
            ) {
                sendToChat(`\n\n ${new Date()} ${mrAssignerId}, ${hookActionAuthorId} оставил комменты`);
            } else if (
                !data.changes?.labels?.previous?.find((l: { title: string }) => l.title === LABELS.approved) &&
                data.changes?.labels?.current?.find((l: { title: string }) => l.title === LABELS.approved) &&
                currentReviewerId === hookActionAuthorId
            ) {
                sendToChat(`\n\n ${new Date()} ${mrAssignerId}, ${hookActionAuthorId} поставил апрув`);
            } else if (
                data.changes?.labels?.previous?.find((l: { title: string }) => l.title === LABELS.discuss) &&
                !data.changes?.labels?.current?.find((l: { title: string }) => l.title === LABELS.discuss) &&
                mrAssignerId === hookActionAuthorId
            ) {
                sendToChat(`\n\n ${new Date()} ${currentReviewerId}, ${mrAssignerId} внес правки`);
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

            /*
            https://docs.gitlab.com/user/project/integrations/webhook_events/#merge-request-events

            У меня есть вебхук сервер для гитлаба, он присылает мне события с МРа

            Мне нужно распредлить МР по статусам, на основании: лайблов, ревьюеров, ассайнеров, авторов и экшенов

            Есть 5 статусов:
            created
            open_discusses
            close_discusses
            next_reviewer
            approve

            асайнер = асайнер || автор

            open_discusses - ревьюер поставил лейбл discus

            approve - ревьюер поставил approve

            close_discusses- асайнер убрал лейбл discus

            next_reviewer - назначен новый ревьюер, до этого стоит апрув от предыдущего ревьюера, лейблов нет, треды от предыдуего ревьюера закрыты

            апрув стоит, автор экшена не ассайнер, и не ревьюер

            created - мр создан, у него нет тредов или есть но только от асайнер, и у него назначен ревьюер, нет лейблов и не апрувлен, статус открыт
*/

            if (isMR) {
                sendToChat(`\n\n ${new Date()} ${status}`);
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
