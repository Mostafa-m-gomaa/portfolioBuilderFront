import * as Sentry from "@sentry/react";

export function initSentry() {
  Sentry.init({
    dsn: "https://8785f04c7dfd8dea946ac13bde6aaf51@o4511492630904832.ingest.de.sentry.io/4511492922736720",
    sendDefaultPii: true,
  });
}
