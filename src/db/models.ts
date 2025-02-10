// import Sequelize, { DataTypes } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import { getEnv } from "../helper/getEnv";
import Sequelize, {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "@sequelize/core";
// import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";

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
    reviewK: number;
    vacationStart?: string;
    vacationEnd?: string;
}

export const User = sequelize.define<UserModel>("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    patronymic: { type: DataTypes.STRING },
    tgId: { type: DataTypes.STRING },
    gitId: { type: DataTypes.STRING },
    reviewK: { type: DataTypes.INTEGER, defaultValue: 0 },
    vacationStart: { type: DataTypes.STRING, allowNull: true },
    vacationEnd: { type: DataTypes.STRING, allowNull: true },
});

interface ReleaseModel extends Model<InferAttributes<ReleaseModel>, InferCreationAttributes<ReleaseModel>> {
    id: CreationOptional<number>;
    projectId: number;
    link: string;
    writed: number;
    released: number;
}

export const Release = sequelize.define<ReleaseModel>("Release", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    projectId: { type: DataTypes.INTEGER, allowNull: false },
    link: { type: DataTypes.STRING, allowNull: false },
    writed: { type: DataTypes.TINYINT, defaultValue: 0 },
    released: { type: DataTypes.TINYINT, defaultValue: 0 },
});

interface ReviewModel extends Model<InferAttributes<ReviewModel>, InferCreationAttributes<ReviewModel>> {
    id: CreationOptional<number>;
    link: string;
    approved: number;
    firstReview: number;
    ownerId: number;
    reviewerId: number;
}

export const Review = sequelize.define<ReviewModel>("Review", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    link: { type: DataTypes.STRING, allowNull: false },
    approved: { type: DataTypes.TINYINT, defaultValue: 0 },
    firstReview: { type: DataTypes.TINYINT, defaultValue: 0 },
    ownerId: { type: DataTypes.INTEGER, allowNull: false },
    reviewerId: { type: DataTypes.INTEGER, allowNull: false },
});

// User.hasMany(Review, { foreignKey: "ownerId", as: "OwnedReviews" });
// Review.belongsTo(User, { foreignKey: "ownerId", as: "Owner" });

// User.hasMany(Review, { foreignKey: "reviewerId", as: "Reviewed" });
// Review.belongsTo(User, { foreignKey: "reviewerId", as: "Reviewer" });

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
