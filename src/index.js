import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return <h1>Hello React!!</h1>;
}

// React v18 and above uses createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// React v17 and below
// ReactDOM.render(<App />, document.getElementById("root"));
