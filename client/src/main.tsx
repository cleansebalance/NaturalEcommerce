import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Display a confirmation message in the console
console.log("main.tsx is being executed - attempting to render App");

// Try to get the root element
const rootElement = document.getElementById("root");
console.log("Root element found:", rootElement);

// Render the app with error handling
try {
  createRoot(rootElement!).render(<App />);
  console.log("App rendered successfully");
} catch (error) {
  console.error("Error rendering App:", error);
}
