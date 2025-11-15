interface Tab {
    label: string;
    value: string;
}

export default function Tabs({ tabs, activeTab }: { tabs: Tab[], activeTab: string }) {
    return (
        <box borderStyle="single" width="100%" flexDirection="row" flexShrink={0} columnGap={1}>
            {tabs.map((tab) => (
                <text key={tab.value} bg={activeTab === tab.value ? 'orange' : 'transparent'}>
                    {tab.label}
                </text>
            ))}
        </box>
    );
}