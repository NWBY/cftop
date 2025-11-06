import { text } from "stream/consumers";

function SingleWorkerView({ focussedItemLogs, focussedItem }: { focussedItemLogs: any[], focussedItem: string }) {
    const logCount = Array.isArray(focussedItemLogs) ? focussedItemLogs.length : 0;

    return (
        <scrollbox borderStyle="single" width="100%" focused>
            <box>
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
    );
}

export default SingleWorkerView;