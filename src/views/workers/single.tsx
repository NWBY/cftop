import SingleMetrics from "../../components/single-metrics";
import { LogTimestamp } from "../../components/log-timestamp";
import { useEffect, useState } from "react";
import type { WorkerSummary } from "../../types";
import { getConfig } from "../../config";
import { CloudflareAPI } from "../../api";
import { useKeyboard } from "@opentui/react";

function SingleWorkerView({
    focussedItemLogs,
    focussedItem,
}: {
    focussedItemLogs: any[];
    focussedItem: string;
}) {
    const logCount = Array.isArray(focussedItemLogs)
        ? focussedItemLogs.length
        : 0;
    const [metrics, setMetrics] = useState<WorkerSummary | null>(null);
    const [showTimestamp, setShowTimestamp] = useState<boolean>(true);
    const { start, end } = CloudflareAPI.getTimeRange(24);

    useKeyboard((key) => {
        if (key.name === "t") {
            setShowTimestamp((prev) => !prev);
        }
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            const config = await getConfig();
            const api = new CloudflareAPI({
                apiToken: config.apiToken,
                accountTag: config.accountId,
            });
            const metrics = await api.getSingleWorkerSummary(
                focussedItem,
                start,
                end,
            );
            setMetrics(metrics);
        };
        fetchMetrics();
    }, [focussedItem]);

    return (
        <box flexGrow={1} flexShrink={1} minHeight={0}>
            <SingleMetrics metrics={metrics} />

            <Keybindings />

            <scrollbox
                borderStyle="single"
                borderColor="orange"
                width="100%"
                focused
                flexGrow={1}
                flexShrink={1}
                minHeight={0}
                style={{ wrapperOptions: { borderColor: "orange" } }}
            >
                <box width="100%">
                    <box marginBottom={1}>
                        <text>
                            <strong>
                                <u>
                                    {focussedItem} events ({logCount} total)
                                </u>
                            </strong>
                        </text>
                    </box>
                    {/* @ts-ignore */}
                    {focussedItemLogs &&
                        Array.isArray(focussedItemLogs) &&
                        focussedItemLogs.length > 0 ? (
                        focussedItemLogs.map((log: any, index: number) => {
                            const logMessage =
                                log.$metadata?.messageTemplate || JSON.stringify(log);

                            return (
                                <box
                                    key={`${log.$metadata?.id || index}-${index}`}
                                    flexDirection="column"
                                >
                                    <box flexDirection="row">
                                        {showTimestamp && <LogTimestamp log={log} />}
                                        <text>{logMessage}</text>
                                    </box>
                                </box>
                            );
                        })
                    ) : (
                        <text>No logs yet...</text>
                    )}
                </box>
            </scrollbox>
        </box>
    );
}

function Keybindings() {
    return (
        <box borderStyle="single" width="100%" flexDirection="row" flexShrink={0}>
            <text fg={"#888888"}>t: toggle timestamp</text>
        </box>
    );
}

export default SingleWorkerView;
