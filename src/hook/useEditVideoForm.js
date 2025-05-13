import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API_BASE_URL from '../config/api.js';

/**
 * Custom hook for managing the edit video form logic.
 *
 * @param {string} videoId - The ID of the video to be edited.
 * @param {boolean} isOpen - Whether the form/modal is currently open.
 * @param {Function} onSave - Callback to execute after a successful update.
 * @param {Function} onClose - Callback to execute when the form/modal is closed.
 * @returns {{
 *   formData: { title: string, description: string },
 *   handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
 *   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
 * }} An object containing the form state and event handlers.
 */

const useEditVideoForm = (videoId, isOpen, onSave, onClose) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Fetches video details when form is opened and a valid videoId is provided.
  useEffect(() => {
    if (videoId && isOpen) {
      axios
        .get(`${API_BASE_URL}/api/videos/${videoId}`)
        .then((res) => {
          setFormData({
            title: res.data.title || "",
            description: res.data.description || "",
          });
        })
        .catch((err) => {
          console.error("Error fetching video:", err);
          toast.error("Failed to fetch video data.");
        });
    }
  }, [videoId, isOpen]);


  /**
   * Handles input field changes and updates form state.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The change event from input/textarea.
   */
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles form submission and updates video data via API.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE_URL}/api/videos/${videoId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Video updated successfully!");
      onSave();
      onClose();
    } catch (err) {
      console.error("Error updating video:", err);
      toast.error("Failed to update video.");
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
};

export default useEditVideoForm;
