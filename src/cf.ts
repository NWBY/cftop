import Cloudflare from 'cloudflare';
import { getConfig } from './config';
import type { Domain, Script } from 'cloudflare/resources/workers.mjs';
import type { Bucket } from 'cloudflare/resources/r2.mjs';

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

export const getR2Buckets = async (): Promise<Bucket[] | undefined> => {
    try {
        const { apiToken, accountId } = await getConfig();

        const client = new Cloudflare({
            apiToken: apiToken,
        });
        const res = await client.r2.buckets.list({
            account_id: accountId,
        });
        return res.buckets;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const getDomains = async (): Promise<Domain[] | undefined> => {
    try {
        const { apiToken, accountId } = await getConfig();

        const client = new Cloudflare({
            apiToken: apiToken,
        });
        const res = await client.workers.domains.list({
            account_id: accountId,
        });
        return res.result;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const runObservabilityQuery = async (workerId: string, timeframe: { from: number, to: number }): Promise<any> => {
    try {
        const { apiToken, accountId } = await getConfig();

        const client = new Cloudflare({
            apiToken: apiToken,
        });

        const response = await client.workers.observability.telemetry.query({
            account_id: accountId,
            queryId: '',
            ignoreSeries: true, // we don't want to get the series data
            timeframe: timeframe,
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

        // Return the events array from the response
        if (response && response.events && response.events.events && Array.isArray(response.events.events)) {
            return response.events.events;
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}