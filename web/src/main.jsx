import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"

/** React Router DOM */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

/** Stylesheets */
import "./assets/css/globals.css"
import "./assets/css/tooltips.css"
import "./assets/css/scrollbar.css"

/** Components */
import Auth from "./pages/Auth.jsx"

/** Redux related */
import { Providers } from "./redux/Provider"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Providers>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Providers>
  </React.StrictMode>,
)
