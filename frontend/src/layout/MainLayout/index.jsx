import React from "react";
import { Header, Sidebar, Footer } from "../../components";
import { Outlet } from "react-router-dom";
import "./index.css";
const MainLayout = () => {
  return (
    <>
      <div className="app-layout">
        <aside className="app-layout__sidebar">
          <Sidebar />
        </aside>
        <div className="app-layout__main">
          <header className="app-layout__header">
            <Header />
          </header>
          <main className="app-layout__content">
            <Outlet />
          </main>
          <footer className="app-layout__footer">
            <Footer />
          </footer>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
