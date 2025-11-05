import type { Bucket } from "cloudflare/resources/r2.mjs";

function R2Box({ r2Buckets, focussedItem, focussedSection }: { r2Buckets: Bucket[], focussedItem: string, focussedSection: string }) {
    return (
        <box borderStyle="single" width="25%" style={{
            borderColor: focussedSection === 'buckets' ? 'orange' : '#FFFFFF'
        }}>
            <text>
                <strong>
                    <u>R2 Buckets</u>
                </strong>
            </text>
            {r2Buckets.length > 0 ? (
                r2Buckets.map((bucket) => (
                    <text key={bucket.name} bg={focussedItem === bucket.name ? 'orange' : 'transparent'}>
                        {bucket.name}
                    </text>
                ))
            ) : (
                <box paddingTop={1}>
                    <text>No R2 buckets found</text>
                </box>
            )}
        </box>
    );
}

export default R2Box;