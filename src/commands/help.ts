import packageJson from "../../package.json";

export function showHelp() {
    console.log(`cftop v${packageJson.version}
Terminal UI for viewing and monitoring Cloudflare Workers

USAGE:
    cftop <command> [options]

COMMANDS:
    start              Start the interactive terminal UI
    init               Initialize configuration
    help               Show this help message
    version            Show version number
    config             Show current configuration
    test-observability Test observability API connection

OPTIONS:
    -h, --help                    Show this help message
    -t, --apiToken <token>        Cloudflare API token
    -a, --accountId <id>           Cloudflare account ID
    --accessKey <key>              R2 access key ID (optional)
    --secretKey <key>              R2 secret access key (optional)

EXAMPLES:
    cftop init --apiToken=<token> --accountId=<id>
    cftop start
    cftop help
    cftop --help

For more information, visit: https://github.com/NWBY/cftop
`);
}
