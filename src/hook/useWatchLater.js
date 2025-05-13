import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API_BASE_URL from "../config/api.js";

/**
 * Custom hook to manage the Watch Later functionality.
 *
 * This hook fetches videos added to the "Watch Later" list, provides functionality to remove videos,
 * and manages the dropdown state for each video.
 *
 * @returns {Object} - The hook's return object.
 * @returns {Array} videos - List of videos in the "Watch Later" list.
 * @returns {string|null} dropdownOpenId - The ID of the video whose dropdown is currently open.
 * @returns {Function} removeFromWatchLater - Function to remove a video from the "Watch Later" list.
 * @returns {Function} toggleDropdown - Function to toggle the dropdown for a video.
 */

export const useWatchLater = () => {
  const [videos, setVideos] = useState([]);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  /**
   * Fetches the "Watch Later" videos for the currently authenticated user.
   * This is called once on component mount.
   *
   * @returns {Promise<void>} Resolves when videos are successfully fetched.
   */
  useEffect(() => {
    const fetchWatchLater = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/users/watch-later`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideos(res.data.watchLater);
      } catch (err) {
        console.error("Failed to fetch Watch Later videos", err);
        toast.error("Failed to fetch Watch Later videos");
      }
    };
    fetchWatchLater();
  }, []);

  /**
   * Removes a video from the "Watch Later" list.
   *
   * @param {string} videoId - The ID of the video to be removed.
   * @returns {Promise<void>} Resolves when the video is successfully removed.
   */
  const removeFromWatchLater = async (videoId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/users/watch-later/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
      toast.success("Removed from Watch Later");
      setDropdownOpenId(null);
    } catch (err) {
      console.error("Error removing from watch later", err);
      toast.error("Failed to remove video");
    }
  };

  /**
   * Toggles the visibility of the dropdown for a given video.
   *
   * @param {string} id - The ID of the video whose dropdown should be toggled.
   */
  const toggleDropdown = (id) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  return {
    videos,
    dropdownOpenId,
    removeFromWatchLater,
    toggleDropdown,
  };
};
