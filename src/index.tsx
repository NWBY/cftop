import Cloudflare from "cloudflare";
import { parseArgs } from "util";
import packageJson from "../package.json";
import { showHelp } from "./commands/help";
import { start } from "./commands/start";
import { configExists, createConfig, getConfig } from "./config";

const { values, positionals } = parseArgs({
    args: Bun.argv,
    options: {
        help: {
            type: "boolean",
            short: "h",
        },
        apiToken: {
            type: "string",
            short: "t",
        },
        accountId: {
            type: "string",
            short: "a",
        },
        accessKey: {
            type: "string",
            default: undefined,
        },
        secretKey: {
            type: "string",
            default: undefined,
        },
    },
    strict: true,
    allowPositionals: true,
});

if (values.help) {
    // show help when using --help or -h
    showHelp();
    process.exit(0);
}

if (positionals.length == 2) {
    await start();
}

if (positionals.length == 3) {
    const cmd = positionals[2];

    switch (cmd) {
        case "start":
            start();
            break;
        case "help":
            showHelp();
            process.exit(0);
        case "init":
            // initialize the config
            const configExistsResult = await configExists();
            if (configExistsResult) {
                console.error("Config already exists");
                process.exit(1);
            }

            // create the config
            if (!values.apiToken) {
                console.error("Missing API token: use --apiToken=<api-token>");
                process.exit(1);
            }

            if (!values.accountId) {
                console.error("Missing account ID: use --accountId=<account-id>");
                process.exit(1);
            }

            await createConfig(
                values.apiToken,
                values.accountId,
                values.accessKey,
                values.secretKey,
            );
            console.log("Config created successfully");
            process.exit(0);
        case "test-observability":
            const config = await getConfig();

            // Calculate a proper timeframe (last 24 hours)
            const now = Date.now();
            const yesterday = now - 24 * 60 * 60 * 1000;

            // Test the observability using SDK
            const client = new Cloudflare({
                apiToken: config.apiToken,
            });

            // For temporary queries, provide parameters
            // SDK requires queryId but API treats it as temporary query when parameters are provided
            try {
                const response = await client.workers.observability.telemetry.query({
                    account_id: config.accountId,
                    queryId: "", // Empty string to satisfy SDK validation - API will use parameters instead
                    timeframe: { from: yesterday, to: now },
                    parameters: {
                        limit: 100,
                    },
                    view: "events",
                } as any);
                console.log(JSON.stringify(response, null, 2));
            } catch (error: any) {
                console.error("Error:", error.message);
                if (error.body) {
                    console.error("Response body:", JSON.stringify(error.body, null, 2));
                }
                process.exit(1);
            }
            process.exit(0);
        case "version":
            console.log(packageJson.version);
            process.exit(0);
        case "config":
            const configResult = await getConfig();
            console.log(JSON.stringify(configResult, null, 2));
            process.exit(0);
        default:
            console.error(`Unknown command: ${cmd}`);
            process.exit(1);
    }
}
