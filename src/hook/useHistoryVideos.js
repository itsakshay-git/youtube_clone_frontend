import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import API_BASE_URL from "../config/api.js";

/**
 * Custom hook for managing and interacting with a user's video watch history.
 *
 * @returns {object} Utility functions and state for history search, filtering, and clearing.
 */

const useHistoryVideos = () => {
  const [videos, setVideos] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  // Fetch history videos on component mount
  useEffect(() => {
    /**
     * Fetches the user's watch history and stores only unique video entries.
     * Uses localStorage token for authorization.
     */
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/users/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const uniqueVideos = Array.from(
          new Map(res.data.history.map((v) => [v._id, v])).values()
        );
        setVideos(uniqueVideos);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  // Clears the current search input and term.
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  /**
   * Triggers search when Enter is pressed in input field.
   * @param {KeyboardEvent} e - Key press event.
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(searchInput.trim());
    }
  };

  // Clears the user's entire video watch history on the server and locally.
  const handleClearHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/users/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  /**
   * Removes a specific video from the user's watch history.
   *
   * @param {string} videoId - The ID of the video to remove.
   */
  const handleRemoveFromHistory = async (videoId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/users/history/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error("Error removing from history", err);
    }
  };

  /**
   * Toggles visibility of the dropdown menu for a specific video.
   *
   * @param {string} id - The ID of the video to toggle the dropdown for.
   */
  const toggleDropdown = (id) => {
    setDropdownOpenId((prev) => (prev === id ? null : id));
  };

  /**
   * Groups videos by the date they were updated (watched).
   *
   * @type {Record<string, Array<object>>}
   */
  const groupedVideos = videos.reduce((acc, video) => {
    const dateKey = moment(video.updatedAt).format("YYYY-MM-DD");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(video);
    return acc;
  }, {});

  /**
   * Filters grouped videos based on the current search term.
   *
   * @type {Record<string, Array<object>>}
   */

  const filteredVideos = Object.keys(groupedVideos).reduce((acc, date) => {
    const filtered = groupedVideos[date].filter((video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) acc[date] = filtered;
    return acc;
  }, {});

  return {
    searchInput,
    setSearchInput,
    handleKeyDown,
    handleClearSearch,
    handleClearHistory,
    handleRemoveFromHistory,
    toggleDropdown,
    dropdownOpenId,
    filteredVideos,
  };
};

export default useHistoryVideos;
