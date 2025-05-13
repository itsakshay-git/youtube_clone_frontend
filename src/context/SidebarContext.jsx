/**
 * @file SidebarContext.js
 * @description Provides context for managing sidebar state, including open/close and collapse functionality.
 */

import { createContext, useContext, useState } from "react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false); // For overlay
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // For home route

  /**
   * Toggles the sidebar open/close state.
   * @function
   * @returns {void}
   */
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

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
