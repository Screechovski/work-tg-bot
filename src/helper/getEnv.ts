import dotenv from "dotenv";
dotenv.config();

export function getEnv(envName: string): string {
    const value = process.env[envName];

    if (!value) {
        throw new Error(`'${envName}' не найден, проверьте env`);
    }

    return value;
}
