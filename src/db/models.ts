import { PostgresDialect } from "@sequelize/postgres";
import { getEnv } from "../helper/getEnv";
import Sequelize, {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "@sequelize/core";

const sequelize = new Sequelize({
    dialect: PostgresDialect,
    user: getEnv("DATABASE_USER"),
    host: getEnv("DATABASE_HOST"),
    port: Number(getEnv("DATABASE_PORT")),
    password: getEnv("DATABASE_PASSWORD"),
    database: getEnv("DATABASE_DATABASE"),
    logging: false, // Отключает логи SQL-запросов
});

interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    id: CreationOptional<number>;
    name: string;
    surname: string;
    patronymic: string;
    tgId: string;
    gitId: string;
    gitIdNumber?: number;
    vacationStart?: string | null;
    vacationEnd?: string | null;
}

export const User = sequelize.define<UserModel>("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    patronymic: { type: DataTypes.STRING, allowNull: false },
    tgId: { type: DataTypes.STRING, allowNull: false },
    gitId: { type: DataTypes.STRING, allowNull: false },
    gitIdNumber: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
    vacationStart: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    vacationEnd: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
});

async function init() {
    async function addUser(s: string, n: string, p: string, tg: string, git: string) {
        const user = await User.findOne({ where: { gitId: git } });

        if (user) {
            return;
        }

        return User.create({
            name: n,
            surname: s,
            patronymic: p,
            tgId: tg,
            gitId: git,
        });
    }

    await sequelize.sync();
    // await addUser("Бобошко", "Юрий", "Леонидович", "yusfortelegram", "iboboshko", 5);
    // await addUser("Ширяев", "Дмитрий", "Александрович", "profunarsenal", "DSHiryaev", 4);
    // await addUser("Фисунов", "Дмитрий", "Владимирович", "Dmitry_Fisunov", "DFisunov", 4);
    // await addUser("Хаджаев", "Роман", "Алихонович", "EvilAvocad", "RKHadzhaev", 4);
    // await addUser("Матюхин", "Алексей", "Владимирович", "matyukhinAV", "AMatyukhin", 1);
    // await addUser("Дмитриев", "Ярослав", "Владимирович", "dmyavl", "YADmitriev", 1);
    // await addUser("Надолинный", "Максим", "Викторович", "nethesite", "MNadolinnyi", 1);
    // await addUser("Лопатин", "Глеб", "Германович", "coolboy321", "GLopatin", 1);
    // await addUser("Просветкин", "Андрей", "Сергеевич", "andreyvue78", "AProsvetkin", 1);
    // await addUser("Крашенинников", "Иван", "Владиславович", "dotbotnet", "IKrasheninni", 1);

    await addUser("Амелин", "Александр", "", "AAmelin", "AAmelin32");
    await addUser("Амелин2", "Александр2", "", "AAmelin", "Ready32");
    await addUser("Лизочка", "Солнышко", "Красоточка", "marallada", "metelitsa.eliizaveta");
    await addUser("Ярослав", "Солнышко", "", "dmyavl", "webdev1232");
}

export const db = {
    User,
    init,
};

export type Database = typeof db;
