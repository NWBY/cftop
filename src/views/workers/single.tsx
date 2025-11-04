function SingleWorkerView({ focussedItemLogs }: { focussedItemLogs: any[] }) {
    return (
        <scrollbox borderStyle="single" width="100%" focused>
            <box>
                <text>
                    Single Worker View
                </text>
                {/* @ts-ignore */}
                {focussedItemLogs?.events?.map((log: any) => (
                    <text key={log.$workers.requestId} paddingBottom={1}>
                        {log.$metadata.messageTemplate}
                    </text>
                ))}
            </box>
        </scrollbox>
    );
}

export default SingleWorkerView;