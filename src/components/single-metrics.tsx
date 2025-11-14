import type { WorkerSummary } from "../types";

function SingleMetrics({ metrics }: { metrics: WorkerSummary | null }) {
    return (
        <box borderStyle="single" width="100%" flexDirection="row" flexWrap="wrap" flexShrink={0}>
            <box width="100%">
                <text paddingBottom={1}>
                    <strong>Worker Summary (Last 24 hours)</strong>
                </text>
                {metrics?.scriptName && (
                    <text paddingBottom={1}>
                        Worker: <strong>{metrics.scriptName}</strong>
                    </text>
                )}
            </box>
            <box width="25%">
                <text paddingBottom={1}>
                    <u>Requests</u>
                </text>
                <text>
                    {metrics?.totalRequests || 0}
                </text>
            </box>
            <box width="25%">
                <text paddingBottom={1}>
                    <u>Errors</u>
                </text>
                <text>
                    {metrics?.totalErrors || 0}
                </text>
            </box>
            <box width="25%">
                <text paddingBottom={1}>
                    <u>Wall Time</u>
                </text>
                <text>
                    {metrics?.wallTime || 0}
                </text>
            </box>
            <box width="25%">
                <text paddingBottom={1}>
                    <u>CPU Time (us)</u>
                </text>
                <text>
                    {metrics?.cpuTimeUs || 0}
                </text>
            </box>
        </box>
    );
}

export default SingleMetrics;