import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import toast from "react-hot-toast";
import API_BASE_URL from "../config/api.js";

/**
 * Custom hook to fetch and manage liked videos for the current user.
 *
 * @returns {{
 *   groupedVideos: Object.<string, Array<Object>>,
 *   dropdownOpenId: string | null,
 *   toggleDropdown: function(string): void,
 *   handleRemoveFromLiked: function(string): Promise<void>
 * }}
 */

const useLikedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/users/liked`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideos(res.data.liked);
      } catch (err) {
        console.error("Error fetching liked videos", err);
      }
    };
    fetchLiked();
  }, []);

  /**
   * Removes a video from the liked videos list.
   *
   * @param {string} videoId - The ID of the video to remove.
   * @returns {Promise<void>}
   */

  const handleRemoveFromLiked = async (videoId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/users/liked/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
      setDropdownOpenId(null);
      toast.success("Removed from liked videos");
    } catch (err) {
      console.error("Error removing from liked", err);
    }
  };

  /**
   * Toggles the dropdown for a specific video.
   *
   * @param {string} id - The ID of the video for which to toggle the dropdown.
   */
  const toggleDropdown = (id) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  /**
   * Groups videos by the date they were last updated.
   *
   * @type {Object.<string, Array<Object>>}
   */
  const groupedVideos = videos.reduce((acc, video) => {
    const dateKey = moment(video.updatedAt).format("YYYY-MM-DD");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(video);
    return acc;
  }, {});

  return {
    groupedVideos,
    dropdownOpenId,
    toggleDropdown,
    handleRemoveFromLiked,
  };
};

export default useLikedVideos;
