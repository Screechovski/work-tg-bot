export function getEnv(envName: string): any {
    const value = process.env[envName];

    if (!value) {
        throw new Error(`'${envName}' не найден, проверьте env`);
    }

    return value;
}
