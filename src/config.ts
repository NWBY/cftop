import { homedir } from 'os';

export const configExists = async (): Promise<boolean> => {
    const homeDir = homedir();
    const configPath = `${homeDir}/.cftop.json`;
    const file = Bun.file(configPath);

    return await file.exists();
}

export const createConfig = async (apiToken: string, accountId: string): Promise<void> => {
    const homeDir = homedir();
    const configPath = `${homeDir}/.cftop.json`;
    const file = Bun.file(configPath);

    await file.write(JSON.stringify({
        apiToken: apiToken,
        accountId: accountId,
    }, null, 2));
}

export const getConfig = async (): Promise<{ apiToken: string, accountId: string }> => {
    const homeDir = homedir();
    const configPath = `${homeDir}/.cftop.json`;
    const file = Bun.file(configPath);
    const config = await file.json();
    return {
        apiToken: config.apiToken,
        accountId: config.accountId,
    };
}