import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";
import "./index.css";

Sentry.init({
	dsn: "https://8785f04c7dfd8dea946ac13bde6aaf51@o4511492630904832.ingest.de.sentry.io/4511492922736720",
	// Setting this option to true sends default PII data (for example IP address).
	sendDefaultPii: true,
});

createRoot(document.getElementById("root")!).render(<App />);
