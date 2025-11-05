function Keybindings() {
    return (
        <box borderStyle="single" width="100%" flexDirection="row">
            <text fg={'#888888'}>q: quit, tab: next section, w: focus workers, d: focus durable objects, b: focus buckets, c: focus config, up: previous item, down: next item, enter: single worker</text>
        </box>
    );
}

export default Keybindings;