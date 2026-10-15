import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { trackCurrentPageView } from "@/services/analytics/analytics.service"

declare global {
  interface Window {
    __madvInitialAnalyticsViewRecorded?: boolean
  }
}

if (!window.__madvInitialAnalyticsViewRecorded) {
  window.__madvInitialAnalyticsViewRecorded = true
  trackCurrentPageView()
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
