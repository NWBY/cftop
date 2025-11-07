/**
 * TypeScript types for Cloudflare API responses
 */

export interface WorkersAnalyticsResponse {
    viewer: {
        accounts: Array<{
            workersInvocationsAdaptive: Array<{
                sum: {
                    subrequests: number;
                    requests: number;
                    errors: number;
                    wallTime: number;
                    cpuTimeUs: number;
                };
                quantiles: {
                    cpuTimeP50: number;
                    cpuTimeP99: number;
                    requestDurationP50: number;
                    requestDurationP99: number;
                };
                dimensions: {
                    datetime: string;
                    scriptName: string;
                    status: string;
                };
            }>;
        }>;
    };
}

export interface DurableObjectsAnalyticsResponse {
    viewer: {
        accounts: Array<{
            durableObjectsInvocationsAdaptive: Array<{
                sum: {
                    requests: number;
                    errors: number;
                };
                quantiles: {
                    cpuTimeP50: number;
                    cpuTimeP99: number;
                };
                dimensions: {
                    datetime: string;
                    objectName: string;
                    status: string;
                };
            }>;
        }>;
    };
}

export interface ListWorkersResponse {
    viewer: {
        accounts: Array<{
            workersInvocationsAdaptive: Array<{
                dimensions: {
                    scriptName: string;
                };
            }>;
        }>;
    };
}

export interface ListDurableObjectsResponse {
    viewer: {
        accounts: Array<{
            durableObjectsInvocationsAdaptive: Array<{
                dimensions: {
                    objectName: string;
                };
            }>;
        }>;
    };
}

export interface WorkerSummary {
    scriptName: string;
    totalRequests: number;
    totalErrors: number;
    totalSubrequests: number;
    cpuTimeP50: number;
    cpuTimeP99: number;
    wallTime: number;
    cpuTimeUs: number;
    statusBreakdown: Record<string, number>;
    requestDurationP50: number;
    requestDurationP99: number;
}

export interface GraphQLResponse<T> {
    data: T;
    errors?: Array<{
        message: string;
        locations?: Array<{ line: number; column: number }>;
        path?: Array<string | number>;
    }>;
}

export interface CloudflareAPIConfig {
    apiToken: string;
    accountTag: string;
}

/**
 * REST API response types
 */
export interface CloudflareRESTResponse<T> {
    result: T;
    success: boolean;
    errors?: Array<{
        code: number;
        message: string;
        documentation_url?: string;
    }>;
    messages?: Array<{
        code: number;
        message: string;
    }>;
}

export interface Script {
    id: string;
    compatibility_date: string;
    compatibility_flags: string[];
    created_on: string;
    modified_on: string;
    script_name: string;
    logpush?: {
        enabled: boolean;
    };
    observability?: {
        enabled: boolean;
    };
    tags?: string[];
    usage_model?: string;
    handlers?: string[];
    routes?: Array<{
        id: string;
        pattern: string;
        script: string;
    }>;
    tail_consumers?: Array<{
        service: string;
        environment: string;
        namespace: string;
    }>;
    migrations?: {
        tag: string;
        new_classes?: string[];
        renamed_classes?: Array<{
            from: string;
            to: string;
        }>;
        deleted_classes?: string[];
        renamed_scripts?: Array<{
            from: string;
            to: string;
        }>;
        new_sqlite_classes?: string[];
    };
    bindings?: Array<{
        name: string;
        type: string;
        [key: string]: any;
    }>;
}

export interface ListWorkersRESTResponse {
    result: Script[];
    success: boolean;
    errors?: Array<{
        code: number;
        message: string;
    }>;
}

