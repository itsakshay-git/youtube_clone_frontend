import { useEffect, useState } from "react";
import API_BASE_URL from '../config/api.js';
import axios from "axios";


/**
 * Custom hook to fetch a user's profile data, including their watch history, 
 * liked videos, watch later list, and playlists.
 * 
 * This hook sends multiple API requests to fetch different pieces of data related to the user's profile
 * and returns the data along with loading and error states.
 * 
 * @param {string} userId - The ID of the user whose profile data is to be fetched.
 * 
 * @returns {Object} - Contains the following properties:
 *  - history: An array of the user's watch history.
 *  - liked: An array of videos that the user has liked.
 *  - watchLater: An array of videos that the user has saved to watch later.
 *  - playlists: An array of playlists associated with the user.
 *  - loading: A boolean indicating whether the profile data is still being loaded.
 *  - error: An error object containing any error that occurred during data fetching, or null if no error.
 */

const useUserProfileData = (userId) => {
  const [history, setHistory] = useState([]);
  const [liked, setLiked] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


   // Effect hook to fetch profile data when userId changes
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        // Fetch the user's profile data in parallel using Promise.all
        const [histRes, likedRes, watchLaterRes, playlistRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/users/history`, config),
          axios.get(`${API_BASE_URL}/api/users/liked`, config),
          axios.get(`${API_BASE_URL}/api/users/watch-later`, config),
          axios.get(`${API_BASE_URL}/api/playlists/user/${userId}`, config),
        ]);

        setHistory(histRes.data.history);
        setLiked(likedRes.data.liked);
        setWatchLater(watchLaterRes.data.watchLater);
        setPlaylists(playlistRes.data);
      } catch (err) {
        console.error("Error fetching user profile data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { history, liked, watchLater, playlists, loading, error };
};

export default useUserProfileData;
