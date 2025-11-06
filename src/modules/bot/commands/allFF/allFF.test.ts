import { ctxMock } from "../../../../testAssets/ctxMock";
import { dbMock } from "../../../../testAssets/dbMock";
import { allFFCommand } from "./allFF";

describe("allFFCommand handler", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("должен тегать всех пользователей, кроме вызвавшего", async () => {
        dbMock.User.findAll.mockResolvedValue([
            { tgId: "user1" },
            { tgId: "test_user" }, // Должен быть исключен
            { tgId: "user2" },
        ]);

        //@ts-ignore
        await allFFCommand.handler(ctxMock, dbMock);

        expect(dbMock.User.findAll).toHaveBeenCalled();
        expect(ctxMock.reply).toHaveBeenCalledWith("@user1 @user2 ");
    });

    it("должен отправлять пустое сообщение, если пользователей нет", async () => {
        dbMock.User.findAll.mockResolvedValue([]);

        //@ts-ignore
        await allFFCommand.handler(ctxMock, dbMock);

        expect(ctxMock.reply).toHaveBeenCalledWith("");
    });

    it("должен корректно работать, если все пользователи – вызывающий", async () => {
        dbMock.User.findAll.mockResolvedValue([{ tgId: "test_user" }, { tgId: "test_user" }]);

        //@ts-ignore
        await allFFCommand.handler(ctxMock, dbMock);

        expect(ctxMock.reply).toHaveBeenCalledWith("");
    });
});
