/**
 * Cloudflare GraphQL API Queries
 */

export const GET_WORKERS_ANALYTICS = `
  query GetWorkersAnalytics(
    $accountTag: String!
    $datetimeStart: String!
    $datetimeEnd: String!
    $scriptName: String
  ) {
    viewer {
      accounts(filter: {accountTag: $accountTag}) {
        workersInvocationsAdaptive(
          limit: 100
          filter: {
            scriptName: $scriptName
            datetime_geq: $datetimeStart
            datetime_leq: $datetimeEnd
          }
        ) {
          sum {
            subrequests
            requests
            errors
          }
          quantiles {
            cpuTimeP50
            cpuTimeP99
          }
          dimensions {
            datetime
            scriptName
            status
          }
        }
      }
    }
  }
`;

export const GET_DURABLE_OBJECTS_ANALYTICS = `
  query GetDurableObjectsMetrics(
    $accountTag: String!
    $datetimeStart: String!
    $datetimeEnd: String!
    $objectName: String
  ) {
    viewer {
      accounts(filter: {accountTag: $accountTag}) {
        durableObjectsInvocationsAdaptive(
          limit: 100
          filter: {
            objectName: $objectName
            datetime_geq: $datetimeStart
            datetime_leq: $datetimeEnd
          }
        ) {
          sum {
            requests
            errors
          }
          quantiles {
            cpuTimeP50
            cpuTimeP99
          }
          dimensions {
            datetime
            objectName
            status
          }
        }
      }
    }
  }
`;

export const LIST_WORKERS = `
  query ListWorkers($accountTag: String!) {
    viewer {
      accounts(filter: {accountTag: $accountTag}) {
        workersInvocationsAdaptive(
          limit: 1000
          filter: {
            datetime_geq: "2024-01-01T00:00:00Z"
          }
        ) {
          dimensions {
            scriptName
          }
        }
      }
    }
  }
`;

export const LIST_DURABLE_OBJECTS = `
  query ListDurableObjects($accountTag: String!) {
    viewer {
      accounts(filter: {accountTag: $accountTag}) {
        durableObjectsInvocationsAdaptive(
          limit: 1000
          filter: {
            datetime_geq: "2024-01-01T00:00:00Z"
          }
        ) {
          dimensions {
            objectName
          }
        }
      }
    }
  }
`;

export const GET_WORKER_SUMMARY = `
  query GetWorkerSummary(
    $accountTag: string!
    $datetimeStart: Time
    $datetimeEnd: Time
  ) {
    viewer {
      accounts(filter: {accountTag: $accountTag}) {
        workersInvocationsAdaptive(
          limit: 1000
          filter: {
            datetime_geq: $datetimeStart
            datetime_leq: $datetimeEnd
          }
        ) {
          sum {
            subrequests
            requests
            errors
          }
          quantiles {
            cpuTimeP50
            cpuTimeP99
            requestDurationP50
            requestDurationP99
          }
          dimensions {
            scriptName
            status
          }
        }
      }
    }
  }
`;

