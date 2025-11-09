import SingleMetrics from "../../components/single-metrics";
import { useEffect, useState } from "react";
import type { WorkerSummary } from "../../types";
import { getConfig } from "../../config";
import { CloudflareAPI } from "../../api";
import { S3Client } from "bun";

function SingleR2BucketView({ focussedItem }: { focussedItem: string }) {
    const [objects, setObjects] = useState<any[] | undefined>(undefined);
    const [metrics, setMetrics] = useState<WorkerSummary | null>(null);
    const { start, end } = CloudflareAPI.getTimeRange(24);

    useEffect(() => {
        const fetchMetrics = async () => {
            const config = await getConfig();
            const bucket = new S3Client({
                accessKeyId: config.accessKey,
                secretAccessKey: config.secretKey,
                bucket: focussedItem,
                endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
            });

            const topLevel = await bucket.list();
            setObjects(topLevel.contents);
        };
        fetchMetrics();
    }, [focussedItem]);

    function bytesToSize(bytes: number) {
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) return 'n/a'
        // @ts-ignore
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
        if (i === 0) return `${bytes}${sizes[i]}`
        return `${(bytes / (1024 ** i)).toFixed(1)}${sizes[i]}`
    }

    return (
        <box flexGrow={1} flexShrink={1} minHeight={0}>
            <box borderStyle="single">
                <text><strong>{focussedItem} objects</strong></text>
            </box>
            <scrollbox borderStyle="single" borderColor="orange" width="100%" focused flexGrow={1} flexShrink={1} minHeight={0} style={{ wrapperOptions: { borderColor: 'orange' } }}>
                <box width="100%">
                    {/* @ts-ignore */}
                    {objects && objects.length > 0 ? (
                        objects.map((object) => (
                            <box key={object.etag} flexDirection="row" justifyContent="space-between">
                                <text>{object.key}</text>
                                <text>{bytesToSize(object.size)}</text>
                            </box>
                        ))
                    ) : (
                        <text>No objects found</text>
                    )}
                </box>
            </scrollbox>
        </box>
    );
}

export default SingleR2BucketView;