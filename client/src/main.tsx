import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import client from "./apollo/client";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import "./styles/common.css";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/forms.css";
import "./styles/navbar.css";
import "./styles/readings.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
