import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useFetchCurrentUser from "./useFetchCurrentUser";
import API_BASE_URL from "../config/api.js";

/**
 * Custom React hook to manage video playlists including:
 * - Fetching user's playlists
 * - Toggling video inclusion in playlists
 * - Creating a new playlist
 * - Adding/removing videos from Watch Later
 *
 * @module usePlaylistManager
 */

const usePlaylistManager = (onClose, videoId) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState([]);
  const [watchLaterChecked, setWatchLaterChecked] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [toggleNewPlaylist, setToggleNewPlaylist] = useState(false);
  const userId = useSelector((state) => state.auth.user?._id);
  const fetchUser = useFetchCurrentUser();

  // Checks if the current video is in the Watch Later list.
  useEffect(() => {
    const checkWatchLater = async () => {
      try {
        const token = localStorage.getItem("token");
        if(token){
          const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          const watchLaterList = res.data?.watchLater || [];
          if (watchLaterList.includes(videoId)) {
            setWatchLaterChecked(true);
          }
        }

      } catch (err) {
        console.error("Error fetching Watch Later list", err);
      }
    };

    checkWatchLater();
  }, [videoId]);

  // Fetches all playlists for the current user and determines which ones include the video.
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/api/playlists/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data;

        const selected = data
          .filter((playlist) => playlist.videos.some((v) => v._id === videoId))
          .map((playlist) => playlist._id);

        setPlaylists(data);
        setSelectedPlaylistIds(selected);
      } catch (err) {
        console.error("Error fetching playlists", err);
      }
    };

    if (userId) fetchPlaylists();
  }, [userId, videoId]);

  /**
   * Toggles video presence in a playlist.
   * @param {string} playlistId - The ID of the playlist to update.
   */
  const handleCheckboxChange = async (playlistId) => {
    const token = localStorage.getItem("token");
    const isAlreadySelected = selectedPlaylistIds.includes(playlistId);

    try {
      const url = isAlreadySelected
        ? `${API_BASE_URL}/api/playlists/${playlistId}/remove-video`
        : `${API_BASE_URL}/api/playlists/${playlistId}/add-video`;

      await axios.put(
        url,
        { videoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedPlaylistIds((prev) =>
        isAlreadySelected
          ? prev.filter((id) => id !== playlistId)
          : [...prev, playlistId]
      );
    } catch (err) {
      console.error("Error updating playlist:", err);
    }
  };

  /**
   * Saves changes:
   * - Adds video to Watch Later (if checked)
   * - Adds video to selected playlists
   * - Creates a new playlist (if provided)
   */
  const handleSave = async () => {
    const token = localStorage.getItem("token");

    try {
      // 1. Save to Watch Later if checked
      if (watchLaterChecked) {
        await axios.put(
          `${API_BASE_URL}/api/videos/watch-later/${videoId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // 2. Add video to selected playlists
      await Promise.all(
        selectedPlaylistIds.map((playlistId) =>
          axios.put(
            `${API_BASE_URL}/api/playlists/${playlistId}/add-video`,
            { videoId },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      // 3. Optionally create a new playlist
      if (newPlaylistName.trim()) {
        await axios.post(
          `${API_BASE_URL}/api/playlists/create`,
          {
            name: newPlaylistName,
            userId,
            videoId,
            isPrivate,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      await fetchUser();
      onClose();
    } catch (err) {
      console.error("Error saving playlists or Watch Later:", err);
    }
  };

  return {
    playlists,
    selectedPlaylistIds,
    watchLaterChecked,
    setWatchLaterChecked,
    isPrivate,
    setIsPrivate,
    newPlaylistName,
    setNewPlaylistName,
    handleCheckboxChange,
    setToggleNewPlaylist,
    toggleNewPlaylist,
    userId,
    handleSave,
  };
};

export default usePlaylistManager;
