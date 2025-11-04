
function DurableBox({ durableObjects, focussedItem, focussedSection }: { durableObjects: DurableObject[], focussedItem: string, focussedSection: string }) {
    return (

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
    );
}

export default DurableBox;