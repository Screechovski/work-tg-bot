import { PostgresDialect } from "@sequelize/postgres";
import Sequelize, {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "@sequelize/core";
import { getEnv } from "../../helper/getEnv";

const sequelize = new Sequelize({
    dialect: PostgresDialect,
    user: getEnv("POSTGRES_USER"),
    host: getEnv("DATABASE_HOST"),
    port: Number(getEnv("POSTGRES_PORT")),
    password: getEnv("POSTGRES_PASSWORD"),
    database: getEnv("POSTGRES_DB"),
    logging: false, // Отключает логи SQL-запросов
});

interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    id: CreationOptional<number>;
    name: string;
    surname: string;
    tgId: string;
    gitId: string;
    gitIdNumber: number;
    vacationStart?: string | null;
    vacationEnd?: string | null;
    active: number;
}

const User = sequelize.define<UserModel>("users", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    tgId: { type: DataTypes.STRING, allowNull: false },
    gitId: { type: DataTypes.STRING, allowNull: false },
    gitIdNumber: { type: DataTypes.INTEGER, allowNull: false, defaultValue: null },
    vacationStart: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    vacationEnd: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    active: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
});

async function initUsers() {
    async function addUser(s: string, n: string, tg: string, g: string, gn: number) {
        const user = await User.findOne({ where: { gitId: g } });

        if (user) {
            return;
        }

        return User.create({
            name: n,
            surname: s,
            tgId: tg,
            gitId: g,
            gitIdNumber: gn,
            active: 1,
        });
    }

    await sequelize.sync();
    // await addUser("Бобошко", "Юрий", "yusfortelegram", "iboboshko");
    // await addUser("Ширяев", "Дмитрий", "profunarsenal", "DSHiryaev");
    // await addUser("Фисунов", "Дмитрий", "Dmitry_Fisunov", "DFisunov");
    // await addUser("Хаджаев", "Роман", "EvilAvocad", "RKHadzhaev");
    // await addUser("Матюхин", "Алексей", "matyukhinAV", "AMatyukhin");
    // await addUser("Дмитриев", "Ярослав", "dmyavl", "YADmitriev");
    // await addUser("Надолинный", "Максим", "nethesite", "MNadolinnyi");
    // await addUser("Лопатин", "Глеб", "coolboy321", "GLopatin");
    // await addUser("Просветкин", "Андрей", "andreyvue78", "ASProsvetkin");
    // await addUser("Крашенинников", "Иван", "dotbotnet", "IKrasheninni");

    await addUser("User1", "", "user3", "maralada", 31426342);
    await addUser("User2", "", "user2", "screech1232", 31426283);
    await addUser("Ярослав", "Дмитриев", "dmyavl", "webdev1232", 6457388);
}

export async function initDB() {
    await initUsers();

    return {
        getAllUsers: () => User.findAll(),
        getUserByTgId: (tgId: string) => User.findOne({ where: { tgId } }),
        getUserByGitUsername: (gitId: string) => User.findOne({ where: { gitId } }),
        getUserByGitId: (gitIdNumber: number) => User.findOne({ where: { gitIdNumber } }),
    };
}

export type DBPayload = Awaited<ReturnType<typeof initDB>>;
