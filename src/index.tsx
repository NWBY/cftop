import { TextAttributes } from "@opentui/core";
import { render, useKeyboard, useRenderer } from "@opentui/react";

import { parseArgs } from "util";
import { configExists, createConfig, getConfig } from "./config";
import packageJson from "../package.json";
import {
  getD1Databases,
  getDomains,
  getDurableObjects,
  getKVNamespaces,
  getQueues,
  getR2Buckets,
  getWorkers,
  runObservabilityQuery,
} from "./cf";
import { useEffect, useState, useRef } from "react";
import type { Domain, Script } from "cloudflare/resources/workers.mjs";
import { CloudflareAPI } from "./api";
import type { WorkerSummary } from "./types";
import type { DurableObject } from "cloudflare/resources/durable-objects/namespaces.mjs";
import Cloudflare from "cloudflare";
import WorkersBox from "./components/workers-box";
import SingleWorkerView from "./views/workers/single";
import HomeView from "./views/home";
import Keybindings from "./components/keybindings";
import type { Bucket } from "cloudflare/resources/r2.mjs";
import SingleR2BucketView from "./views/r2/single";
import type { Queue } from "cloudflare/resources/queues/queues.mjs";
import type { DatabaseListResponse } from "cloudflare/resources/d1.mjs";
import SingleD1DatabaseView from "./views/d1/single";
import SingleQueueView from "./views/queues/single";
import { CheckForUpdate } from "./components/utils/check-for-update";
import type { Namespace } from "cloudflare/src/resources/kv.js";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
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

if (positionals.length == 2) {
  const configExistsResult = await configExists();

  if (!configExistsResult) {
    console.error("Config not found, please run `cftop init`");
    process.exit(1);
  }

  // user has just called cftop
  function App() {
    const views = [
      "home",
      "single-worker",
      "single-r2-bucket",
      "single-d1-database",
      "single-queue",
    ];
    const panels = [
      "workers",
      "durables",
      "buckets",
      "domains",
      "queues",
      "d1",
      "kv",
    ];
    const renderer = useRenderer();
    const [view, setView] = useState<string>("home");
    const [workers, setWorkers] = useState<Script[]>([]);
    const [durableObjects, setDurableObjects] = useState<
      { namespace: string; objects: DurableObject[] | undefined }[]
    >([]);
    const [r2Buckets, setR2Buckets] = useState<Bucket[]>([]);
    const [domains, setDomains] = useState<Domain[]>([]);
    const [queues, setQueues] = useState<Queue[]>([]);
    const [d1Databases, setD1Databases] = useState<DatabaseListResponse[]>([]);
    const [kvNamespaces, setKVNamespaces] = useState<Namespace[]>([]);
    const [focussedSection, setFocussedSection] = useState<string>("workers");
    const [focussedItem, setFocussedItem] = useState<string>("");
    const [showFocussedItemLogs, setShowFocussedItemLogs] =
      useState<boolean>(false);
    const [focussedItemLogs, setFocussedItemLogs] = useState<any[] | null>(
      null,
    );
    const [metrics, setMetrics] = useState<WorkerSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { start, end } = CloudflareAPI.getTimeRange(24);
    const nowTimestamp = Date.now();
    const startTimestamp = nowTimestamp - 24 * 60 * 60 * 1000;
    const lastSuccessfulFocussedItemLogsTimestampRef =
      useRef<number>(startTimestamp);
    const focussedItemRef = useRef<string>(focussedItem);

    // Keep ref in sync with state
    useEffect(() => {
      focussedItemRef.current = focussedItem;
    }, [focussedItem]);

    // Initial data fetch
    useEffect(() => {
      setLoading(true);

      const fetchAll = async () => {
        await Promise.all([
          (async () => {
            const workers = await getWorkers();
            setWorkers(workers);
          })(),
          (async () => {
            const durableObjects = await getDurableObjects();
            setDurableObjects(durableObjects);
          })(),
          (async () => {
            const config = await getConfig();
            const api = new CloudflareAPI({
              apiToken: config.apiToken,
              accountTag: config.accountId,
            });
            const metrics = await api.getWorkerSummary(start, end);
            setMetrics(metrics);
          })(),
          (async () => {
            const r2Buckets = await getR2Buckets();
            setR2Buckets(r2Buckets || []);
          })(),
          (async () => {
            const domains = await getDomains();
            setDomains(domains || []);
          })(),
          (async () => {
            const queues = await getQueues();
            setQueues(queues || []);
          })(),
          (async () => {
            const d1Databases = await getD1Databases();
            setD1Databases(d1Databases || []);
          })(),
          (async () => {
            const kvNamespaces = await getKVNamespaces();
            setKVNamespaces(kvNamespaces || []);
          })(),
        ]);
        setLoading(false);
      };

      fetchAll();
    }, []);

    // Interval for fetching logs when in single-worker view
    useEffect(() => {
      if (view === "single-worker" && focussedItem) {
        // Reset the timestamp when entering single-worker view to the current time
        // This ensures we only fetch NEW logs from this point forward
        lastSuccessfulFocussedItemLogsTimestampRef.current = Date.now();

        const interval = setInterval(() => {
          const nowTimestamp = Date.now();
          const fromTimestamp =
            lastSuccessfulFocussedItemLogsTimestampRef.current;
          const currentFocussedItem = focussedItemRef.current;

          runObservabilityQuery(currentFocussedItem, {
            from: fromTimestamp,
            to: nowTimestamp,
          })
            .then((response) => {
              if (response && Array.isArray(response) && response.length > 0) {
                setFocussedItemLogs((prevLogs) => {
                  if (prevLogs === null) return response;
                  const updated = [...response, ...prevLogs];
                  return updated;
                });
                // Only update timestamp after successful fetch
                lastSuccessfulFocussedItemLogsTimestampRef.current =
                  nowTimestamp;
              } else {
                // Still update timestamp to avoid fetching the same time range again
                // lastFocussedItemLogsTimestampRef.current = nowTimestamp;
              }
            })
            .catch((error) => {
              // Update timestamp even on error to avoid getting stuck
              // lastFocussedItemLogsTimestampRef.current = nowTimestamp;
            });
        }, 10000); // 10 seconds as requested

        return () => {
          clearInterval(interval);
        };
      } else {
        // Reset logs when leaving single-worker view
        setFocussedItemLogs(null);
      }
    }, [view, focussedItem]);

    useKeyboard((key) => {
      if (key.name === "q") {
        process.exit(0);
      }

      if (key.name === "tab") {
        setFocussedSection(
          panels[
            (panels.indexOf(focussedSection) + 1) % panels.length
          ] as string,
        );
      }

      if (key.name === "h") {
        setFocussedSection("workers");
        setFocussedItem("");
        setView("home");
      }

      if (key.name === "w") {
        setFocussedSection("workers");
        setFocussedItem(workers[0]?.id || "");
      }
      if (key.name === "d") {
        setFocussedSection("durables");
        setFocussedItem(durableObjects[0]?.objects?.[0]?.id || "");
      }
      if (key.name === "b") {
        setFocussedSection("buckets");
        setFocussedItem(r2Buckets[0]?.name || "");
      }
      if (key.name === "c") {
        setFocussedSection("config");
      }

      if (key.ctrl && key.name === "k") {
        renderer?.toggleDebugOverlay();
        renderer?.console.toggle();
      }

      if (key.name === "up") {
        if (view === "home") {
          if (focussedSection === "workers") {
            const currentIndex = workers.findIndex(
              (w) => w.id === focussedItem,
            );
            const prevIndex =
              currentIndex <= 0 ? workers.length - 1 : currentIndex - 1;
            setFocussedItem(workers[prevIndex]?.id || "");
          } else if (focussedSection === "buckets") {
            const currentIndex = r2Buckets.findIndex(
              (b) => b.name === focussedItem,
            );
            const prevIndex =
              currentIndex <= 0 ? r2Buckets.length - 1 : currentIndex - 1;
            setFocussedItem(r2Buckets[prevIndex]?.name || "");
          } else if (focussedSection === "d1") {
            const currentIndex = d1Databases.findIndex(
              (d) => d.uuid === focussedItem,
            );
            console.log(currentIndex);
            const prevIndex =
              currentIndex <= 0 ? d1Databases.length - 1 : currentIndex - 1;
            console.log(prevIndex);
            console.log(d1Databases[prevIndex]?.uuid);
            setFocussedItem(d1Databases[prevIndex]?.uuid || "");
          } else if (focussedSection === "queues") {
            const currentIndex = queues.findIndex(
              (q) => q.queue_id === focussedItem,
            );
            const prevIndex =
              currentIndex <= 0 ? queues.length - 1 : currentIndex - 1;
            setFocussedItem(queues[prevIndex]?.queue_id || "");
          } else {
            setFocussedItem("");
          }
        }
      }
      if (key.name === "down") {
        if (view === "home") {
          if (focussedSection === "workers") {
            const currentIndex = workers.findIndex(
              (w) => w.id === focussedItem,
            );
            const nextIndex = (currentIndex + 1) % workers.length;
            setFocussedItem(workers[nextIndex]?.id || "");
          } else if (focussedSection === "buckets") {
            const currentIndex = r2Buckets.findIndex(
              (b) => b.name === focussedItem,
            );
            const nextIndex = (currentIndex + 1) % r2Buckets.length;
            setFocussedItem(r2Buckets[nextIndex]?.name || "");
          } else if (focussedSection === "d1") {
            const currentIndex = d1Databases.findIndex(
              (d) => d.uuid === focussedItem,
            );
            const nextIndex = (currentIndex + 1) % d1Databases.length;
            setFocussedItem(d1Databases[nextIndex]?.uuid || "");
          } else if (focussedSection === "queues") {
            console.log("down in queues");
            const currentIndex = queues.findIndex(
              (q) => q.queue_id === focussedItem,
            );
            console.log(`queues current index: ${currentIndex}`);
            const nextIndex = (currentIndex + 1) % queues.length;
            console.log(`queues next index: ${nextIndex}`);
            setFocussedItem(queues[nextIndex]?.queue_id || "");
            console.log(`queues focussed item: ${focussedItem}`);
          } else {
            setFocussedItem("");
          }
        }
      }

      if (key.name === "return") {
        if (focussedSection === "workers") {
          const worker = workers.find((w) => w.id === focussedItem);
          if (worker) {
            setFocussedItemLogs(null);
            runObservabilityQuery(worker?.id || "", {
              from: startTimestamp,
              to: nowTimestamp,
            })
              .then((response) => {
                if (response && Array.isArray(response)) {
                  setFocussedItemLogs(response);
                } else {
                  setFocussedItemLogs([]);
                }
              })
              .catch(() => {
                setFocussedItemLogs([]);
              });
            setShowFocussedItemLogs(true);
            setView("single-worker");
          }
        } else if (focussedSection === "buckets") {
          const bucket = r2Buckets.find((b) => b.name === focussedItem);
          if (bucket) {
            setView("single-r2-bucket");
          }
        } else if (focussedSection === "d1") {
          const database = d1Databases.find((d) => d.uuid === focussedItem);
          if (database) {
            setView("single-d1-database");
          }
        } else if (focussedSection === "queues") {
          const queue = queues.find((q) => q.queue_id === focussedItem);
          if (queue) {
            setView("single-queue");
          }
        }
      }
    });

    const dbName = d1Databases.find((d) => d.uuid === focussedItem)?.name || "";

    let visibleView: React.ReactNode;

    if (view === "home") {
      visibleView = (
        <HomeView
          metrics={metrics}
          workers={workers}
          durableObjects={durableObjects}
          r2Buckets={r2Buckets}
          domains={domains}
          queues={queues}
          d1Databases={d1Databases}
          kvNamespaces={kvNamespaces}
          focussedItem={focussedItem}
          focussedSection={focussedSection}
        />
      );
    } else if (view === "single-worker") {
      visibleView = (
        <SingleWorkerView
          focussedItemLogs={focussedItemLogs}
          focussedItem={focussedItem}
        />
      );
    } else if (view === "single-r2-bucket") {
      visibleView = <SingleR2BucketView focussedItem={focussedItem} />;
    } else if (view === "single-d1-database") {
      visibleView = (
        <SingleD1DatabaseView focussedItem={focussedItem} dbName={dbName} />
      );
    } else if (view === "single-queue") {
      visibleView = <SingleQueueView focussedItem={focussedItem} />;
    }

    return (
      <box height="100%">
        <box
          borderStyle="single"
          flexShrink={0}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <ascii-font font="tiny" text="cftop" />
          <box flexDirection="row" alignItems="center">
            <CheckForUpdate />
            <text>v{packageJson.version}</text>
          </box>
        </box>
        {loading ? (
          <box borderStyle="single" flexGrow={1}>
            <text>Loading...</text>
          </box>
        ) : (
          visibleView
        )}
        <box flexShrink={0}>
          <Keybindings />
        </box>
      </box>
    );
  }

  render(<App />);
} else if (positionals.length == 3) {
  // user has called cftop with a command
  const cmd = positionals[2];

  switch (cmd) {
    case "init":
      // initialize the config
      const configExistsResult = await configExists();
      if (configExistsResult) {
        console.error("Config already exists");
        process.exit(1);
      }

      // create the config
      if (!values.apiToken) {
        console.error("API token is required");
        process.exit(1);
      }

      if (!values.accountId) {
        console.error("Account ID is required");
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
