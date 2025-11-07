import type { Domain, Script } from "cloudflare/resources/workers.mjs";
import type { DurableObject } from "cloudflare/resources/durable-objects/namespaces.mjs";
import type { Bucket } from "cloudflare/resources/r2.mjs";
import type { WorkerSummary } from "../types";
import WorkersBox from "../components/workers-box";
import R2Box from "../components/r2-box";
import DomainsBox from "../components/domains-box";

function HomeView({ metrics, workers, durableObjects, r2Buckets, domains, focussedItem, focussedSection }: { metrics: WorkerSummary[], workers: Script[], durableObjects: DurableObject[], r2Buckets: Bucket[], domains: Domain[], focussedItem: string, focussedSection: string }) {
    return (
        <box>
            <box borderStyle="single" width="100%" flexDirection="row" flexWrap="wrap">
                <box width="100%">
                    <text paddingBottom={1}>
                        <strong>Workers Summary (Last 24 hours)</strong>
                    </text>
                </box>
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
                <box width="25%">
                    <text paddingBottom={1}>
                        <u>Wall Time</u>
                    </text>
                    <text>
                        {metrics.reduce((acc, metric) => acc + metric.wallTime, 0)}
                    </text>
                </box>
                <box width="25%">
                    <text paddingBottom={1}>
                        <u>CPU Time (us)</u>
                    </text>
                    <text>
                        {metrics.reduce((acc, metric) => acc + metric.cpuTimeUs, 0)}
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
                <R2Box r2Buckets={r2Buckets} focussedItem={focussedItem} focussedSection={focussedSection} />
                <DomainsBox domains={domains} focussedItem={focussedItem} focussedSection={focussedSection} />
            </box>
        </box>
    );
}

export default HomeView;