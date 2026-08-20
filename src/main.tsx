import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

const scheduleDeferred = () => {
  void import("./sentry").then(({ initSentry }) => initSentry());
  void import("./lib/deferredAnalytics").then(({ initDeferredAnalytics }) => initDeferredAnalytics());
};

if ("requestIdleCallback" in window) {
  window.requestIdleCallback(scheduleDeferred, { timeout: 4000 });
} else {
  window.setTimeout(scheduleDeferred, 2000);
}
