import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import API_BASE_URL from '../config/api.js';

/**
 * Custom hook for handling search results in the search page.
 * Fetches search results from the API, applies filters based on user selection, 
 * and provides the necessary data for rendering search results.
 * 
 * @param {string} userId - The ID of the user, used for filtering watched/unwatched videos.
 * 
 * @returns {Object} - Contains the following properties:
 *  - query: The search query extracted from the URL.
 *  - filters: An array of filter options available to the user.
 *  - filteredResults: The list of search results after applying the selected filter.
 *  - activeFilter: The currently selected filter.
 *  - setActiveFilter: Function to update the active filter.
 *  - openDropdownId: The ID of the dropdown that's currently open (for filtering results).
 *  - toggleDropdown: Function to toggle the visibility of the filter dropdown.
 */

const useSearchResults = (userId) => {
  const [originalResults, setOriginalResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const query = new URLSearchParams(useLocation().search).get("q");

  const filters = [
    "All",
    "Shorts",
    "Videos",
    "Playlists",
    "Watched",
    "Unwatched",
    "Recently Uploaded",
  ];

  // Fetches search results from the API based on the query from the URL
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/search?q=${query}`);
        const videoResults = (res.data.videos || []).map((v) => ({ ...v, type: "video" }));
        const playlistResults = (res.data.playlists || []).map((p) => ({ ...p, type: "playlist" }));
        const mixed = [...videoResults, ...playlistResults];
        setOriginalResults(mixed);
        setFilteredResults(mixed);
      } catch (err) {
        console.error("Error fetching search results:", err);
      }
    };

    if (query?.trim()) fetchResults();
  }, [query]);

    // Filters the search results based on the selected filter
  useEffect(() => {
    const now = dayjs();
    const filtered = originalResults.filter((item) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "Shorts") return item.type === "video" && item.isShort;
      if (activeFilter === "Videos") return item.type === "video" && !item.isShort;
      if (activeFilter === "Playlists") return item.type === "playlist";
      if (activeFilter === "Watched") return item.type === "video" && item.watchedBy?.includes(userId);
      if (activeFilter === "Unwatched") return item.type === "video" && !item.watchedBy?.includes(userId);
      if (activeFilter === "Recently Uploaded") return item.type === "video" && dayjs(item.createdAt).isAfter(now.subtract(7, "day"));
      return true;
    });
    setFilteredResults(filtered);
  }, [activeFilter, originalResults]);


    /**
   * Toggles the visibility of the filter dropdown.
   * 
   * @param {string} id - The ID of the dropdown to toggle.
   */
  
  const toggleDropdown = (id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  return {
    query,
    filters,
    filteredResults,
    activeFilter,
    setActiveFilter,
    openDropdownId,
    toggleDropdown,
  };
};

export default useSearchResults;
