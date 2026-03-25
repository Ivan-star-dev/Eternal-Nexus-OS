import { createRoot } from "react-dom/client";
import "cesium/Build/Cesium/Widgets/widgets.css"; // CesiumWidget base styles
import App from "./App.tsx";
import "./index.css";
import { setDefaultBus } from "@/lib/events/bus";
import { createPersistedBus } from "@/lib/events/persistence";

// V4-SESSION-001: boot persisted event bus before any component mounts.
// Events now survive page reloads (localStorage, 500-event bounded ring buffer).
setDefaultBus(createPersistedBus({ devOnly: false }));

createRoot(document.getElementById("root")!).render(<App />);
