import React from "react";
import "./Layout.css";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "../../pages/home/Home";
import Expenses from "../../pages/expenses/Expenses";
import Agents from "../../pages/agents/Agents";
import Ombor from "../../pages/ombor/Ombor";
import Sale from "../../pages/sale/Sale";
import Suppliers from "../../pages/suppliers/Suppliers";
import Debtors from "../../pages/debtors/Debtors";

function Layout() {
  const sidebarState = useSelector((state) => state.sidebar);
  return (
    <div className="layout">
      <div className={"layout_left" + (sidebarState ? " open_s" : "")}>
        <Sidebar />
      </div>

      <div className="layout_right">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/ombor" element={<Ombor />} />
            <Route path="/sale" element={<Sale />} />
            <Route path="/expense" element={<Expenses />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/debtors" element={<Debtors />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Layout;
