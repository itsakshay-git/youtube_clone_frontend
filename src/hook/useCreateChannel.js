import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useFetchCurrentUser from "./useFetchCurrentUser";
import API_BASE_URL from '../config/api.js';

/**
 * Custom hook for creating a new channel.
 *
 * @param {Function} onClose - Function to be called after successfully creating the channel (e.g., to close a modal).
 * @returns {{
 *   channelName: string,
 *   setChannelName: Function,
 *   handle: string,
 *   setHandle: Function,
 *   channelBanner: File|null,
 *   setChannelBanner: Function,
 *   channelImage: File|null,
 *   setChannelImage: Function,
 *   isLoading: boolean,
 *   isFormValid: boolean,
 *   handleSubmit: Function
 * }} Object containing state variables and handler functions.
 */

const useCreateChannel = (onClose) => {
  const [channelName, setChannelName] = useState("");
  const [handle, setHandle] = useState("");
  const [channelBanner, setChannelBanner] = useState(null);
  const [channelImage, setChannelImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const fetchCurrentUser = useFetchCurrentUser();

  // Form validation to check if all fields are filled
  const isFormValid = channelName && handle && channelBanner && channelImage;


   /**
   * Handles the form submission for channel creation.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("channelName", channelName);
    formData.append("handle", handle.startsWith("@") ? handle : `@${handle}`);
    formData.append("channelImage", channelImage);
    formData.append("channelBanner", channelBanner);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/channels/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.channelId) {
        await fetchCurrentUser();
        onClose();
        navigate(`/channel/${response.data.channelId}`);
      }
    } catch (error) {
      console.error("Error creating channel:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    channelName,
    setChannelName,
    handle,
    setHandle,
    channelBanner,
    setChannelBanner,
    channelImage,
    setChannelImage,
    isLoading,
    isFormValid,
    handleSubmit,
  };
};

export default useCreateChannel;
