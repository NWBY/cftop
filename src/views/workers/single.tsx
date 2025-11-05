function SingleWorkerView({ focussedItemLogs, focussedItem }: { focussedItemLogs: any[], focussedItem: string }) {
    return (
        <scrollbox borderStyle="single" width="100%" focused>
            <box>
                <text>
                    <strong><u>{focussedItem} events</u></strong>
                </text>
                {/* @ts-ignore */}
                {focussedItemLogs?.events?.map((log: any) => (
                    <text key={log.$workers.requestId}>
                        {log.$metadata.messageTemplate}
                    </text>
                ))}
            </box>
        </scrollbox>
    );
}

export default SingleWorkerView;