import SingleMetrics from "../../components/single-metrics";
import { useEffect, useState } from "react";
import type { WorkerSummary } from "../../types";
import { getD1Database, queryD1Database } from "../../cf";
import type { D1 } from "cloudflare/resources/d1/d1.mjs";

function SingleD1DatabaseView({ focussedItem, dbName }: { focussedItem: string, dbName: string }) {
    const [database, setDatabase] = useState<D1 | null>(null);
    const [tables, setTables] = useState<any[] | undefined>(undefined);
    const [fullTables, setFullTables] = useState<any[] | undefined>(undefined);
    const [metrics, setMetrics] = useState<WorkerSummary | null>(null);

    useEffect(() => {
        const fetchDatabase = async () => {
            const database = await getD1Database(focussedItem);
            setDatabase(database);
        };
        fetchDatabase();
    }, [focussedItem]);

    useEffect(() => {
        const fetchDatabaseSchema = async () => {
            const tables = await queryD1Database(focussedItem, 'select * from sqlite_master;');

            const filteredTables = tables?.result[0]?.results.filter((table: any) => table.type === 'table');

            let tableNames = [];
            for (const table of filteredTables) {
                tableNames.push(table.name);
            }

            setTables(tableNames);

            let fullTableSchemas = [];

            for (const tableName of tableNames) {
                const fullTable = await queryD1Database(focussedItem, `pragma table_info('${tableName}');`);
                // @ts-ignore
                if (fullTable?.result[0]?.results.length > 0) {
                    fullTableSchemas.push({
                        name: tableName,
                        schema: fullTable?.result[0]?.results,
                    });
                }
            }

            setFullTables(fullTableSchemas);
        };
        fetchDatabaseSchema();
    }, [focussedItem]);

    function getFilteredTables() {
        // @ts-ignore
        return tables.filter((table: any) => table.type === 'table');
    }

    return (
        <box flexGrow={1} flexShrink={1} minHeight={0}>
            <box borderStyle="single" flexShrink={0}>
                <text><strong>{dbName}</strong></text>
                <box flexDirection="row" paddingTop={0.5}>
                    <box width="25%">
                        <text><u>Size (bytes)</u></text>
                        <text>{database?.file_size}</text>
                    </box>
                    <box width="25%">
                        <text><u>Number of tables</u></text>
                        <text>{database?.num_tables}</text>
                    </box>
                </box>
            </box>
            <scrollbox borderStyle="single" borderColor="orange" width="100%" focused flexGrow={1} flexShrink={1} minHeight={0} style={{ wrapperOptions: { borderColor: 'orange' } }}>
                <box width="100%" flexDirection="row">
                    {/* @ts-ignore */}
                    {/* <text>{JSON.stringify(tables?.result[0]?.results)}</text> */}
                    {/* @ts-ignore */}
                    {fullTables && fullTables.length > 0 ? (
                        // @ts-ignore
                        fullTables?.map((table: any) => {
                            return (
                                <box key={table.name} borderStyle="single" minWidth={20}>
                                    <text key={table.name}><strong>{table.name}</strong></text>
                                    {table.schema.map((column: any) => (
                                        <text key={column.name}>{column.name}</text>
                                    ))}
                                </box>
                            )
                        })
                    ) : (
                        <text>No tables found</text>
                    )}
                </box>
            </scrollbox>
        </box>
    );
}

export default SingleD1DatabaseView;