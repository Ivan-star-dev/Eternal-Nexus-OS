import { createRoot } from "react-dom/client";
import "cesium/Build/Cesium/Widgets/widgets.css"; // CesiumWidget base styles
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
