import type { Namespace } from "cloudflare/src/resources/kv.js";

function KVBox({ kvNamespaces, focussedSection, focussedItem }: { kvNamespaces: Namespace[], focussedSection: string, focussedItem: string }) {
    return (
        <box borderStyle="single" width="25%" style={{
            borderColor: focussedSection === 'kv' ? 'orange' : '#FFFFFF'
        }}>
            <text>
                <strong>
                    <u>KV</u>
                </strong>
            </text>
            {kvNamespaces.length > 0 ? (
                kvNamespaces.map((kv) => (
                    <text key={kv.id} bg={focussedItem === kv.id ? 'orange' : 'transparent'}>
                        {kv.title}
                    </text>
                ))
            ) : (
                <box>
                    <text>No KV found</text>
                </box>
            )}
        </box>
    );
}

export default KVBox;