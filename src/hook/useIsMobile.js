import { useEffect, useState } from "react";


/**
 * Custom hook to determine if the current window width is below a specified breakpoint.
 *
 * @param {number} [breakpoint=768] - The pixel width threshold to determine "mobile" view.
 * @returns {boolean} Whether the current screen width is considered mobile.
 */

export default function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);

  useEffect(() => {
    // Updates the isMobile state based on current window width.
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    handleResize(); // initialize on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}