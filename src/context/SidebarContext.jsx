/**
 * @file SidebarContext.js
 * @description Provides context for managing sidebar state, including open/close and collapse functionality.
 */

import { createContext, useContext, useState, useEffect } from "react";

// Create a context to manage sidebar state
const SidebarContext = createContext();

/**
 * SidebarProvider component to wrap the application and provide sidebar state context.
 * @component
 * @example
 * Usage in App component:
 * <SidebarProvider>
 *   <App />
 * </SidebarProvider>
 */

export const SidebarProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = localStorage.getItem("sidebarOpen");
    return stored === null ? false : stored === "true";
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // For home route

  /**
   * Toggles the sidebar open/close state.
   * Also stores the new state in localStorage to persist across reloads.
   * @function
   * @returns {void}
   */
  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarOpen", newState);
      return newState;
    });
  };

  /**
   * Toggles the sidebar collapse/uncollapse state.
   * @function
   * @returns {void}
   */
  const toggleCollapse = () => setSidebarCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{ sidebarOpen, toggleSidebar, sidebarCollapsed, toggleCollapse }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

/**
 * Custom hook to access the sidebar context.
 * @returns {Object} - Returns the sidebar context values: `sidebarOpen`, `toggleSidebar`, `sidebarCollapsed`, `toggleCollapse`
 */

export const useSidebar = () => useContext(SidebarContext);
