import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API_BASE_URL from '../config/api.js';


/**
 * Custom hook to manage the edit playlist form functionality.
 *
 * @param {string} playlistId - The ID of the playlist to be edited.
 * @param {boolean} isOpen - Flag indicating if the modal/form is currently open.
 * @param {Function} onSave - Callback function to execute after a successful save.
 * @param {Function} onClose - Callback function to execute after the form/modal is closed.
 * @returns {{
 *   formData: { name: string, isPrivate: boolean },
 *   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 *   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
 * }} An object containing form state, input handler, and submission handler.
 */

const useEditPlaylistForm = (playlistId, isOpen, onSave, onClose) => {
  const [formData, setFormData] = useState({
    name: "",
    isPrivate: false,
  });

  // Fetches playlist data when the modal/form is opened and a playlistId is provided.
  useEffect(() => {
    if (playlistId && isOpen) {
      axios
        .get(`${API_BASE_URL}/api/playlists/${playlistId}`)
        .then((res) => {
          setFormData({
            name: res.data.name || "",
            isPrivate: res.data.isPrivate || false,
          });
        })
        .catch((err) => {
          console.error("Error fetching playlist:", err);
          toast.error("Failed to fetch playlist data.");
        });
    }
  }, [playlistId, isOpen]);


  /**
   * Handles changes in the form inputs.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /**
   * Handles the form submission to update the playlist.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE_URL}/api/playlists/${playlistId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Playlist updated successfully!");
      onSave();
      onClose();
    } catch (err) {
      console.error("Error updating playlist:", err);
      toast.error("Failed to update playlist.");
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
};

export default useEditPlaylistForm;
