import "./App.css";
import { useState } from "react";
import { StoreContextProvider } from "./common/Store";
import HomePage from "./common/HomePage";
import IconButton from "./ui/IconButton";
import { Sun, Moon } from "./ui/icons";

function App() {
  const [mode, setMode] = useState(
    () => document.documentElement.dataset.theme || localStorage.getItem("colorMode") || "light"
  );

  const toggleColorMode = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("colorMode", next);
      document.documentElement.dataset.theme = next;
      return next;
    });
  };

  return (
    <StoreContextProvider>
      <HomePage />
      <IconButton
        onClick={toggleColorMode}
        aria-label="toggle dark mode"
        className="fixed top-3 right-3 z-[20000] bg-surface shadow-md hover:bg-surface"
      >
        {mode === "dark" ? <Sun /> : <Moon />}
      </IconButton>
    </StoreContextProvider>
  );
}

export default App;
