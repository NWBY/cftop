import type { Domain } from "cloudflare/resources/workers.mjs";

function DomainsBox({ domains, focussedItem, focussedSection }: { domains: Domain[], focussedItem: string, focussedSection: string }) {
    return (
        <box borderStyle="single" width="25%" style={{
            borderColor: focussedSection === 'domains' ? 'orange' : '#FFFFFF'
        }}>
            <text>
                <strong>
                    <u>Domains</u>
                </strong>
            </text>
            {domains.length > 0 ? (
                domains.map((domain) => (
                    <text key={domain.id} bg={focussedItem === domain.id ? 'orange' : 'transparent'}>
                        {domain.id}
                    </text>
                ))
            ) : (
                <box paddingTop={1}>
                    <text>No domains found</text>
                </box>
            )}
        </box>
    );
}

export default DomainsBox;