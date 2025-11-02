import Cloudflare from 'cloudflare';
import { getConfig } from './config';
import type { Script } from 'cloudflare/resources/workers.mjs';

export const getWorkers = async (): Promise<Script[]> => {
    try {
        const { apiToken, accountId } = await getConfig();

        const client = new Cloudflare({
            apiToken: apiToken,
        });
        const workers = await client.workers.scripts.list({
            account_id: accountId,
        });
        return workers.result;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const getDurableObjects = async (): Promise<any[]> => {
    try {
        const { apiToken, accountId } = await getConfig();

        const client = new Cloudflare({
            apiToken: apiToken,
        });
        const namespaces = await client.durableObjects.namespaces.list({
            account_id: accountId,
        });

        const durableObjects = [];

        for (const namespace of namespaces.result) {
            const objects = await client.durableObjects.namespaces.objects.list(namespace.id!, {
                account_id: accountId,
            });

            durableObjects.push({
                namespace: namespace.name,
                objects: objects.result
            })
        }

        return durableObjects;
    } catch (error) {
        console.error(error);
        return [];
    }
}