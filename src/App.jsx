import { Outlet, useLocation } from 'react-router';
import Header from './components/Header';
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import { useSidebar } from './context/SidebarContext.jsx';
import { useEffect } from 'react';
import "./App.css"


/**
 * App Component
 *
 * Main layout wrapper that includes the header, sidebar, and router outlet.
 * Manages sidebar visibility based on current route and handles auto-closing of sidebar overlays
 * on non-home pages.
 *
 * @component
 * @returns {JSX.Element} The main application layout with routing outlet.
 */

function App() {
  const { sidebarOpen, toggleSidebar, toggleCollapse, sidebarCollapsed } = useSidebar();
  const location = useLocation();
  
  const isHome =
  location.pathname === "/" ||
  location.pathname.startsWith("/channel") ||
  location.pathname.startsWith("/search") || 
  location.pathname.startsWith("/history") || 
  location.pathname.startsWith("/liked") || 
  location.pathname.startsWith("/watch-later") ||
  location.pathname.startsWith("/profile") ||
  location.pathname.startsWith("/playlist") ||
  location.pathname.startsWith("/manage");

  //  Effect to auto-close sidebar overlay on non-home pages when navigation occurs.
  useEffect(() => {
    if (!isHome && sidebarOpen) {
      // closes overlay sidebar if it's open
      toggleSidebar(); 
    }
  }, [location.pathname]);

  return (
    <>
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 3000,
          style: {
            border: '1px solid #dadce0',
            padding: '12px 16px',
            color: '#202124',
            fontSize: '14px',
            borderRadius: '8px',
            background: '#fff',
            boxShadow: '0px 2px 6px rgba(60,64,67,0.3)',
          },
        }}
      />

      <div className="sticky top-0 z-50 bg-white">
        <Header />
      </div>

      <div className="relative block sm:flex">
        {(isHome || sidebarOpen) && (
          <Sidebar overlay={!isHome} />
        )}

        <div
          className={`flex-1 h-[calc(100vh-56px)] overflow-x-auto transition-all ${
            isHome ? (sidebarCollapsed ? "pl-0 sm:pl-20" : "pl-64") : ""
          }`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
