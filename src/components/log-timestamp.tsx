export type LogLevel = "error" | "warning" | "info" | "debug" | "default";

function getLogLevelFromString(level: string): LogLevel {
  const normalized = level.toLowerCase();

  if (normalized.includes("error") || normalized.includes("err")) return "error";
  if (normalized.includes("warn")) return "warning";
  if (normalized.includes("info")) return "info";
  if (normalized.includes("debug")) return "debug";
  return "default";
}

export function getLogLevel(log: any): LogLevel {
  const levelValue =
    log?.$metadata?.level ??
    log?.$metadata?.severity ??
    log?.level ??
    log?.severity ??
    log?.logLevel ??
    "";
  return getLogLevelFromString(String(levelValue));
}

export function getLogColor(level: LogLevel): string {
  switch (level) {
    case "error":
      return "#ff4444"; // Red
    case "warning":
      return "#ffaa00"; // Orange/Yellow
    case "info":
      return "#4488ff"; // Blue
    case "debug":
      return "#888888"; // Grey
    default:
      return "#cccccc"; // Light grey
  }
}

function formatTimestamp(timestamp?: number | string): string {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

  // Get timezone abbreviation dynamically
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeZoneName =
    new Intl.DateTimeFormat(locale, {
      timeZoneName: "short",
      timeZone: timeZone,
    })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value || "UTC";

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${milliseconds} ${timeZoneName}`;
}

export function LogTimestamp({ log }: { log: any }) {
  // Extract timestamp from log (check common locations)
  const timestamp =
    log?.$metadata?.timestamp ||
    log?.$metadata?.time ||
    log?.timestamp ||
    log?.time;

  const logLevel = getLogLevel(log);
  const logColor = getLogColor(logLevel);
  const timestampStr = formatTimestamp(timestamp);

  return (
    <>
      <text bg={logColor}> </text>
      <text> </text>
      <text fg="#cccccc">{timestampStr}</text>
      <text> </text>
    </>
  );
}
