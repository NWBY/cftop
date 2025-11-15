import { useEffect, useState } from "react";
import type { Queue } from "cloudflare/resources/queues/queues.mjs";
import { getQueue, getQueueMessages } from "../../cf";
import type { MessagePullResponse } from "cloudflare/resources/queues.mjs";

function SingleQueueView({ focussedItem }: { focussedItem: string }) {
    const [queue, setQueue] = useState<Queue | null>(null);
    const [messages, setMessages] = useState<MessagePullResponse | null>(null);

    useEffect(() => {
        const fetchQueue = async () => {
            const queue = await getQueue(focussedItem);
            const messages = await getQueueMessages(focussedItem);
            setQueue(queue);
            setMessages(messages);
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
                    {queue?.producers_total_count && queue?.producers_total_count > 0 ? (
                        queue?.producers?.map((producer) => {
                            if (producer.type === "worker") {
                                return <text key={producer.script}>{producer.script}</text>;
                            } else if (producer.type === "r2_bucket") {
                                return <text key={producer.bucket_name}>{producer.bucket_name}</text>;
                            }
                            return null;
                        })
                    ) : (
                        <text>No producers found</text>
                    )}
                </box>
                <box width="50%" borderStyle="single">
                    <text><strong>Consumers ({queue?.consumers_total_count})</strong></text>
                    {queue?.consumers_total_count && queue?.consumers_total_count > 0 ? (
                        queue?.consumers?.map((consumer) => {
                            if (consumer.type === "worker") {
                                return <text key={consumer.script}>{consumer.script}</text>;
                            } else if (consumer.type === "http_pull") {
                                return <text key={consumer.consumer_id}>{consumer.consumer_id} (HTTP Pull)</text>;
                            }
                            return null;
                        })
                    ) : (
                        <text>No consumers found</text>
                    )}
                </box>
            </box>
            <scrollbox borderStyle="single" borderColor="orange" width="100%" focused flexGrow={1} flexShrink={1} minHeight={0} style={{ wrapperOptions: { borderColor: 'orange' } }}>
                <box width="100%">
                    {/* @ts-ignore */}
                    {messages && messages.messages && messages.messages.length > 0 ? (
                        messages.messages.map((message: any) => (
                            <box key={message.id} flexDirection="row">
                                <text flexShrink={0} paddingRight={1}>{new Date(message.timestamp_ms).toISOString()}</text>
                                <text>{message.body}</text>
                            </box>
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