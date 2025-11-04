import type { Script } from "cloudflare/resources/workers.mjs";

function WorkersBox({ workers, focussedItem, focussedSection }: { workers: Script[], focussedItem: string, focussedSection: string }) {
    return (
        <box borderStyle="single" width="25%" style={{
            borderColor: focussedSection === 'workers' ? 'orange' : '#FFFFFF'
        }}>
            <text>
                <strong>
                    <u>Workers</u>
                </strong>
            </text>
            {workers.length > 0 ? (
                workers.map((worker) => (
                    <text key={worker.id} bg={focussedItem === worker.id ? 'orange' : 'transparent'}>
                        {worker.id}
                    </text>
                ))
            ) : (
                <box paddingTop={1}>
                    <text>No workers found</text>
                </box>
            )}
        </box>
    );
}

export default WorkersBox;