import React from "react";
import ReactDOM from "react-dom/client";
import BoardView from "./components/Board";
import LandscapeGuard from "./components/LandscapeGuard";
import "./main.scss";
import "./styles.scss";

const App = () => {
  return (
    <div className="app-wrapper">
      <BoardView />
      <LandscapeGuard />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
