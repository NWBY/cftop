import SingleMetrics from "../../components/single-metrics";
import { useEffect, useState } from "react";
import type { WorkerSummary } from "../../types";
import { getConfig } from "../../config";
import { CloudflareAPI } from "../../api";

function SingleWorkerView({ focussedItemLogs, focussedItem }: { focussedItemLogs: any[], focussedItem: string }) {
    const logCount = Array.isArray(focussedItemLogs) ? focussedItemLogs.length : 0;
    const [metrics, setMetrics] = useState<WorkerSummary | null>(null);
    const { start, end } = CloudflareAPI.getTimeRange(24);

    useEffect(() => {
        const fetchMetrics = async () => {
            const config = await getConfig();
            const api = new CloudflareAPI({
                apiToken: config.apiToken,
                accountTag: config.accountId,
            });
            const metrics = await api.getSingleWorkerSummary(focussedItem, start, end);
            setMetrics(metrics);
        };
        fetchMetrics();
    }, [focussedItem]);

    return (
        <box flexGrow={1} flexShrink={1} minHeight={0}>
            <SingleMetrics metrics={metrics} />
            <scrollbox borderStyle="single" width="100%" focused flexGrow={1} flexShrink={1} minHeight={0} style={{ borderColor: 'orange' }}>
                <box width="100%">
                    <text>
                        <strong><u>{focussedItem} events ({logCount} total)</u></strong>
                    </text>
                    {/* @ts-ignore */}
                    {focussedItemLogs && Array.isArray(focussedItemLogs) && focussedItemLogs.length > 0 ? (
                        focussedItemLogs.map((log: any, index: number) => (
                            <text key={`${log.$metadata?.id || index}-${index}`}>
                                {log.$metadata?.messageTemplate || JSON.stringify(log)}
                            </text>
                        ))
                    ) : (
                        <text>No logs yet...</text>
                    )}
                </box>
            </scrollbox>
        </box>
    );
}

export default SingleWorkerView;