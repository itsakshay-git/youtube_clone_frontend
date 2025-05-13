import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from '../config/api.js';

/**
 * Custom hook to fetch the playlists of a user.
 * This hook fetches the playlists of a user from the API and provides
 * loading state, error handling, and the fetched data.
 * 
 * @param {string} userId - The ID of the user whose playlists are to be fetched.
 * 
 * @returns {Object} - Contains the following properties:
 *  - playlists: An array of playlists associated with the user.
 *  - loading: A boolean indicating whether the playlists are being loaded.
 *  - error: A string message containing any error encountered while fetching the playlists.
 */

const useUserPlaylists = (userId) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

   // Effect hook to fetch playlists when userId changes
  useEffect(() => {
    if (!userId) return;

    const fetchPlaylists = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
          `${API_BASE_URL}/api/playlists/user/${userId}`,
          config
        );
        setPlaylists(res.data);
      } catch (err) {
        setError("Failed to load playlists");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [userId]);

  return { playlists, loading, error };
};

export default useUserPlaylists;
