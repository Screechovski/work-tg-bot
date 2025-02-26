import express, { Express, Request, Response } from "express";
import { getStatusFromMergeRequest } from "./mergeRequest";
import { Database } from "../db/models";

let callback = (message: string) => {};

export function createHookServer(db: Database) {
    const app: Express = express();
    const port = 3333;

    app.use(express.json());

    app.post("/", async (req: Request, res: Response) => {
        const message = await getStatusFromMergeRequest(req.body);

        if (message) {
            callback(message);
        }

        res.send("ok");
    });

    return {
        onHook(_callback: (message: string) => void) {
            callback = _callback;
        },
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
