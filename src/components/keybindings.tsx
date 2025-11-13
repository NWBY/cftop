function Keybindings() {
    return (
        <box borderStyle="single" width="100%" flexDirection="row" flexShrink={0}>
            <text fg={'#888888'}>q: quit, esc: back, tab: next section, w: focus workers, d: focus durable objects, b: focus buckets, up: previous item, down: next item, enter: single worker</text>
        </box>
    );
}

export default Keybindings;