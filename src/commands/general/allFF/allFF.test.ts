import { allFFCommand } from "./allFF";

const mockCtx = {
    username: "test_user",
    message: "test_message",
    lines: ["line1"],
    reply: jest.fn(),
    getAuthor: jest.fn(),
    send: jest.fn(),
    react: jest.fn(),
    randomSuccessReact: jest.fn(),
};

const mockDb = {
    User: {
        findAll: jest.fn(),
    },
    init: jest.fn(),
};

describe("allFFCommand handler", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("должен тегать всех пользователей, кроме вызвавшего", async () => {
        mockDb.User.findAll.mockResolvedValue([
            { tgId: "user1" },
            { tgId: "test_user" }, // Должен быть исключен
            { tgId: "user2" },
        ]);

        //@ts-ignore
        await allFFCommand.handler(mockCtx, mockDb);

        expect(mockDb.User.findAll).toHaveBeenCalled();
        expect(mockCtx.reply).toHaveBeenCalledWith("@user1 @user2 ");
    });

    it("должен отправлять пустое сообщение, если пользователей нет", async () => {
        mockDb.User.findAll.mockResolvedValue([]);

        //@ts-ignore
        await allFFCommand.handler(mockCtx, mockDb);

        expect(mockCtx.reply).toHaveBeenCalledWith("");
    });

    it("должен корректно работать, если все пользователи – вызывающий", async () => {
        mockDb.User.findAll.mockResolvedValue([{ tgId: "test_user" }, { tgId: "test_user" }]);

        //@ts-ignore
        await allFFCommand.handler(mockCtx, mockDb);

        expect(mockCtx.reply).toHaveBeenCalledWith("");
    });
});
