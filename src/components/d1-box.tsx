import type { DatabaseListResponse } from "cloudflare/resources/d1.mjs";

function D1Box({ d1Databases, focussedSection, focussedItem }: { d1Databases: DatabaseListResponse[], focussedSection: string, focussedItem: string }) {
    return (
        <box borderStyle="single" width="25%" style={{
            borderColor: focussedSection === 'd1' ? 'orange' : '#FFFFFF'
        }}>
            <text>
                <strong>
                    <u>D1</u>
                </strong>
            </text>
            {d1Databases.length > 0 ? (
                d1Databases.map((database) => (
                    <text key={database.uuid} bg={focussedItem === database.uuid ? 'orange' : 'transparent'}>
                        {database.name}
                    </text>
                ))
            ) : (
                <box>
                    <text>No D1 databases found</text>
                </box>
            )}
        </box>
    );
}

export default D1Box;