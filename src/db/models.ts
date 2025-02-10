import Sequelize, { DataTypes } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import { getEnv } from "../helper/getEnv";

const sequelize = new Sequelize({
    dialect: PostgresDialect,
    user: getEnv("DATABASE_USER"),
    host: getEnv("DATABASE_HOST"),
    port: getEnv("DATABASE_PORT"),
    clientMinMessages: getEnv("DATABASE_CLIENT_MIN_MESSAGES"),
    password: getEnv("DATABASE_PASSWORD"),
    database: getEnv("DATABASE_DATABASE"),
});

export const User = sequelize.define("User", {
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    patronymic: DataTypes.STRING,
    tgId: DataTypes.STRING,
    gitId: DataTypes.STRING,
    reviewK: DataTypes.INTEGER,
    vacationStart: DataTypes.STRING,
    vacationEnd: DataTypes.STRING,
});

export const Release = sequelize.define("Release", {
    projectId: DataTypes.INTEGER,
    link: DataTypes.STRING,
    writed: DataTypes.TINYINT,
    released: DataTypes.TINYINT,
});

export const Review = sequelize.define("Review", {
    link: DataTypes.STRING,
    approved: DataTypes.TINYINT,
    firstReview: DataTypes.TINYINT,
    ownerId: DataTypes.INTEGER,
    reviewerId: DataTypes.INTEGER,
});

User.hasMany(Release, { as: "releases", foreignKey: "ownerId" });
Release.belongsTo(User, { as: "owner" });

export const db = {
    async init() {
        async function addUser(s: string, n: string, p: string, tg: string, git: string, k: number) {
            const user = await User.findOne({ where: { tgId: tg } });

            if (user) {
                return;
            }

            return User.create({
                name: n,
                surname: s,
                patronymic: p,
                tgId: tg,
                gitId: git,
                reviewK: k,
            });
        }

        await sequelize.sync();
        await addUser("Бобошко", "Юрий", "Леонидович", "yusfortelegram", "iboboshko", 5);
        await addUser("Ширяев", "Дмитрий", "Александрович", "profunarsenal", "DSHiryaev", 4);
        await addUser("Фисунов", "Дмитрий", "Владимирович", "Dmitry_Fisunov", "DFisunov", 4);
        await addUser("Хаджаев", "Роман", "Алихонович", "EvilAvocad", "RKHadzhaev", 4);
        await addUser("Матюхин", "Алексей", "Владимирович", "matyukhinAV", "AMatyukhin", 1);
        await addUser("Дмитриев", "Ярослав", "Владимирович", "dmyavl", "YADmitriev", 1);
        await addUser("Надолинный", "Максим", "Викторович", "nethesite", "MNadolinnyi", 1);
        await addUser("Лопатин", "Глеб", "Германович", "coolboy321", "GLopatin", 1);
        await addUser("Просветкин", "Андрей", "Сергеевич", "andreyvue78", "AProsvetkin", 1);
        await addUser("Крашенинников", "Иван", "Владиславович", "dotbotnet", "IKrasheninni", 1);
        // await addUser("Лизочка", "Солнышко", "Красоточка", "marallada", "_", 1);
    },
};
