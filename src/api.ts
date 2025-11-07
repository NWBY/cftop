/**
 * Cloudflare API Client
 * 
 * Supports both GraphQL (for analytics) and REST API (for worker management)
 * REST API Reference: https://developers.cloudflare.com/api/resources/workers/
 */

import type {
    GraphQLResponse,
    CloudflareAPIConfig,
    WorkersAnalyticsResponse,
    DurableObjectsAnalyticsResponse,
    ListDurableObjectsResponse,
    WorkerSummary,
    CloudflareRESTResponse,
    Script,
} from './types';
import {
    GET_WORKERS_ANALYTICS,
    GET_DURABLE_OBJECTS_ANALYTICS,
    LIST_WORKERS,
    LIST_DURABLE_OBJECTS,
    GET_WORKER_SUMMARY,
} from './queries';
import { getConfig } from './config';

const CLOUDFLARE_GRAPHQL_ENDPOINT = 'https://api.cloudflare.com/client/v4/graphql';
const CLOUDFLARE_REST_API_BASE = 'https://api.cloudflare.com/client/v4';

export class CloudflareAPI {
    private config: CloudflareAPIConfig;

    constructor(config: CloudflareAPIConfig) {
        this.config = config;
    }

    /**
     * Execute a GraphQL query
     */
    private async query<T>(
        query: string,
        variables: Record<string, any>
    ): Promise<GraphQLResponse<T>> {
        console.log(this.config);
        const response = await fetch(CLOUDFLARE_GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config?.apiToken || ''}`,
                // 'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {
                    ...variables,
                    accountTag: this.config?.accountTag || '',
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
        }

        const data = (await response.json()) as GraphQLResponse<T>;

        if (data.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
        }

        return data;
    }

    /**
     * Get worker metrics for a specific script
     */
    async getWorkerMetrics(
        scriptName: string,
        datetimeStart: string,
        datetimeEnd: string
    ): Promise<WorkersAnalyticsResponse> {
        const response = await this.query<WorkersAnalyticsResponse>(
            GET_WORKERS_ANALYTICS,
            {
                scriptName,
                datetimeStart,
                datetimeEnd,
            }
        );
        return response.data;
    }

    /**
     * Get durable objects metrics
     */
    async getDurableObjectsMetrics(
        objectName: string | undefined,
        datetimeStart: string,
        datetimeEnd: string
    ): Promise<DurableObjectsAnalyticsResponse> {
        const response = await this.query<DurableObjectsAnalyticsResponse>(
            GET_DURABLE_OBJECTS_ANALYTICS,
            {
                objectName,
                datetimeStart,
                datetimeEnd,
            }
        );
        return response.data;
    }

    /**
     * Execute a REST API request
     */
    private async restRequest<T>(
        endpoint: string,
        method: string = 'GET',
        body?: any
    ): Promise<CloudflareRESTResponse<T>> {
        const url = `${CLOUDFLARE_REST_API_BASE}${endpoint}`;
        const options: RequestInit = {
            method,
            headers: {
                'Authorization': `Bearer ${this.config?.apiToken || ''}`,
                'Content-Type': 'application/json',
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as CloudflareRESTResponse<T>;

        if (!data.success) {
            throw new Error(
                `API error: ${data.errors?.map((e) => e.message).join(', ') || 'Unknown error'}`
            );
        }

        return data;
    }

    /**
     * List all durable objects
     */
    async listDurableObjects(): Promise<string[]> {
        const response = await this.query<ListDurableObjectsResponse>(
            LIST_DURABLE_OBJECTS,
            {}
        );
        const accounts = response.data.viewer.accounts;

        if (accounts.length === 0 || !accounts[0]) {
            return [];
        }

        const objectNames = new Set<string>();
        for (const obj of accounts[0].durableObjectsInvocationsAdaptive) {
            if (obj.dimensions.objectName) {
                objectNames.add(obj.dimensions.objectName);
            }
        }

        return Array.from(objectNames).sort();
    }

    /**
     * Get summary metrics for all workers
     */
    async getWorkerSummary(
        datetimeStart: string,
        datetimeEnd: string
    ): Promise<WorkerSummary[]> {
        let response: GraphQLResponse<WorkersAnalyticsResponse> | null = null;
        try {
            response = await this.query<WorkersAnalyticsResponse>(
                GET_WORKER_SUMMARY,
                {
                    datetimeStart,
                    datetimeEnd,
                }
            );
        } catch (error) {
            console.error('Error getting worker summary:', error);
            return [];
        }

        const accounts = response.data.viewer.accounts;
        if (accounts.length === 0 || !accounts[0]) {
            return [];
        }

        // Aggregate metrics by script name
        const summaries = new Map<string, WorkerSummary>();

        for (const worker of accounts[0].workersInvocationsAdaptive) {
            const scriptName = worker.dimensions.scriptName;

            if (!summaries.has(scriptName)) {
                summaries.set(scriptName, {
                    scriptName,
                    totalRequests: 0,
                    totalErrors: 0,
                    totalSubrequests: 0,
                    cpuTimeP50: 0,
                    cpuTimeP99: 0,
                    statusBreakdown: {},
                    requestDurationP50: 0,
                    requestDurationP99: 0,
                    wallTime: 0,
                    cpuTimeUs: 0,
                });
            }

            const summary = summaries.get(scriptName)!;
            summary.totalRequests += worker.sum.requests || 0;
            summary.totalErrors += worker.sum.errors || 0;
            summary.totalSubrequests += worker.sum.subrequests || 0;
            summary.cpuTimeP50 = Math.max(summary.cpuTimeP50, worker.quantiles.cpuTimeP50 || 0);
            summary.cpuTimeP99 = Math.max(summary.cpuTimeP99, worker.quantiles.cpuTimeP99 || 0);
            summary.requestDurationP50 = Math.max(summary.requestDurationP50, worker.quantiles.requestDurationP50 || 0);
            summary.requestDurationP99 = Math.max(summary.requestDurationP99, worker.quantiles.requestDurationP99 || 0);
            summary.wallTime += worker.sum.wallTime || 0;
            summary.cpuTimeUs += worker.sum.cpuTimeUs || 0;
            const status = worker.dimensions.status || 'unknown';
            summary.statusBreakdown[status] = (summary.statusBreakdown[status] || 0) + (worker.sum.requests || 0);
        }

        return Array.from(summaries.values());
    }

    /**
     * Helper
     */
    static getTimeRange(hoursAgo: number = 24): { start: string; end: string } {
        const end = new Date();
        const start = new Date(end.getTime() - hoursAgo * 60 * 60 * 1000);

        return {
            start: start.toISOString(),
            end: end.toISOString(),
        };
    }

}

