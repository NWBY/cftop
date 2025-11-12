import type { Queue } from "cloudflare/resources/queues/queues.mjs";

function QueuesBox({ queues, focussedItem, focussedSection }: { queues: Queue[], focussedItem: string, focussedSection: string }) {
    return (
        <box borderStyle="single" width="25%" style={{
            borderColor: focussedSection === 'queues' ? 'orange' : '#FFFFFF'
        }}>
            <text>
                <strong>
                    <u>Queues</u>
                </strong>
            </text>
            {queues.length > 0 ? (
                queues.map((queue) => (
                    <text key={queue.queue_id} bg={focussedItem === queue.queue_id ? 'orange' : 'transparent'}>
                        {queue.queue_name}
                    </text>
                ))
            ) : (
                <box paddingTop={1}>
                    <text>No queues found</text>
                </box>
            )}
        </box>
    );
}

export default QueuesBox;