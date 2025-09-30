import React from "react";
import { Routes, Route, Outlet, BrowserRouter } from "react-router-dom";
import { Auth } from "./auth/PrivateRoute"; // Yangi PrivateRoute
import Login from "./components/login/Login";
import Layout from "./components/layout/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Outlet />}>
          <Route element={<Auth />}>
            <Route path="/*" element={<Layout />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
