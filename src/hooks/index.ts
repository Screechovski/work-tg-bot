import express, { Express, Request, Response } from "express";
import { getStatusFromMergeRequest } from "./mergeRequest";
import { Database } from "../db/models";

let sendToChat = (message: string) => {};

export function createHookServer(db: Database, _sendToChat: (m: string) => void) {
    const app: Express = express();
    const port = 3333;
    sendToChat = _sendToChat;

    app.use(express.json());

    app.post("/", async (req: Request, res: Response) => {
        console.log(req.body);

        // const message = await getStatusFromMergeRequest(req.body);

        // if (message) {
        //     sendToChat(message);
        // }

        // res.send("ok");
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
    };
}
