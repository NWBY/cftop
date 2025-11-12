import SingleMetrics from "../../components/single-metrics";
import { useEffect, useState } from "react";
import type { WorkerSummary } from "../../types";
import { getConfig } from "../../config";
import { CloudflareAPI } from "../../api";
import { S3Client } from "bun";
import type { Queue } from "cloudflare/resources/queues/queues.mjs";
import { getQueue } from "../../cf";

function SingleQueueView({ focussedItem }: { focussedItem: string }) {
    const [queue, setQueue] = useState<Queue | null>(null);
    const [messages, setMessages] = useState<any[] | null>(null);

    useEffect(() => {
        const fetchQueue = async () => {
            const queue = await getQueue(focussedItem);
            setQueue(queue);
        };
        fetchQueue();
    }, [focussedItem]);

    return (
        <box flexGrow={1} flexShrink={1} minHeight={0}>
            <box borderStyle="single">
                <text><strong>{focussedItem} queue</strong></text>
            </box>
            <box width="100%" flexDirection="row" flexShrink={0}>
                <box width="50%" borderStyle="single">
                    <text><strong>Producers ({queue?.producers_total_count})</strong></text>

                </box>
                <box width="50%" borderStyle="single">
                    <text><strong>Consumers ({queue?.consumers_total_count})</strong></text>
                </box>
            </box>
            <scrollbox borderStyle="single" borderColor="orange" width="100%" focused flexGrow={1} flexShrink={1} minHeight={0} style={{ wrapperOptions: { borderColor: 'orange' } }}>
                <box width="100%">
                    {/* @ts-ignore */}
                    {messages && messages.length > 0 ? (
                        messages.map((message) => (
                            <text key={message.id}>{message.body}</text>
                        ))
                    ) : (
                        <text>No messages found</text>
                    )}
                </box>
            </scrollbox>
        </box>
    );
}

export default SingleQueueView;