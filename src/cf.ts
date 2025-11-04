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

export const runObservabilityQuery = async (workerId: string): Promise<any> => {
    try {
        console.log('running observability query for worker', workerId);
        const { apiToken, accountId } = await getConfig();

        const client = new Cloudflare({
            apiToken: apiToken,
        });
        const now = Date.now();
        const yesterday = now - (24 * 60 * 60 * 1000);

        const response = await client.workers.observability.telemetry.query({
            account_id: accountId,
            queryId: '',
            ignoreSeries: true, // we don't want to get the series data
            timeframe: { from: yesterday, to: now },
            parameters: {
                limit: 100,
                datasets: ['cloudflare-workers'],
                filters: [
                    {
                        key: "$metadata.service",
                        value: workerId,
                        type: "string",
                        operation: "eq",
                    }
                ],
                calculations: [],
                havings: [],
                groupBys: [],
            },
            view: 'events',
        } as any);
        return response.events;
    } catch (error) {
        console.error(error);
        return null;
    }
}