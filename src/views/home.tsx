import type { Script } from "cloudflare/resources/workers.mjs";
import type { DurableObject } from "cloudflare/resources/durable-objects/namespaces.mjs";
import type { WorkerSummary } from "../types";
import WorkersBox from "../components/workers-box";

function HomeView({ metrics, workers, durableObjects, focussedItem, focussedSection }: { metrics: WorkerSummary[], workers: Script[], durableObjects: DurableObject[], focussedItem: string, focussedSection: string }) {
    return (
        <box>
            <box borderStyle="single" width="100%" flexDirection="row">
                <box width="25%">
                    <text paddingBottom={1}>
                        <u>Requests</u>
                    </text>
                    <text>
                        {metrics.reduce((acc, metric) => acc + metric.totalRequests, 0)}
                    </text>
                </box>
                <box width="25%">
                    <text paddingBottom={1}>
                        <u>Errors</u>
                    </text>
                    <text>
                        {metrics.reduce((acc, metric) => acc + metric.totalErrors, 0)}
                    </text>
                </box>
            </box>
            <box flexDirection="row">
                <WorkersBox workers={workers} focussedItem={focussedItem} focussedSection={focussedSection} />
                <box borderStyle="single" width="25%" style={{ borderColor: focussedSection === 'durables' ? 'orange' : '#FFFFFF' }}>
                    <text>
                        <strong>
                            <u>Durable Objects</u>
                        </strong>
                    </text>
                    {durableObjects.length > 0 ? (
                        durableObjects.map((durableObject) => (
                            durableObject.objects?.map((object) => (
                                <text key={object.id} bg={focussedItem === object.id ? 'orange' : 'transparent'}>{object.id} ({durableObject.namespace})</text>
                            ))
                        ))
                    ) : (
                        <box paddingTop={1}>
                            <text>No durable objects found</text>
                        </box>
                    )}
                </box>
                <box borderStyle="single" width="25%" style={{ borderColor: focussedSection === 'buckets' ? 'orange' : '#FFFFFF' }}>
                    <text>
                        <strong>
                            <u>R2 Buckets</u>
                        </strong>
                    </text>
                </box>
                <box borderStyle="single" width="25%" style={{ borderColor: focussedSection === 'config' ? 'orange' : '#FFFFFF' }}>
                    <text>
                    </text>
                </box>
            </box>
        </box>
    );
}

export default HomeView;