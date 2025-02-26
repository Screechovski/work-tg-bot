import express, { Express, Request, Response } from "express";
import { getStatusFromMergeRequest } from "./mergeRequest";

export function createHookServer(callback: (message: string) => void) {
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

    app.listen(port, () => console.log(`SERVER inited\n  http://localhost:${port}`));

    return app;
}
