import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useFetchCurrentUser from "./useFetchCurrentUser";
import { useNavigate } from "react-router";
import API_BASE_URL from '../config/api.js';

/**
 * Custom hook for managing the edit functionality of a channel.
 *
 * @param {string} id - The ID of the channel to edit.
 * @param {Object} currentUser - The currently logged-in user object.
 * @returns {{
 *   channel: Object|null,
 *   name: string,
 *   setName: Function,
 *   description: string,
 *   setDescription: Function,
 *   banner: File|null,
 *   setBanner: Function,
 *   channelImage: File|null,
 *   setChannelImage: Function,
 *   loading: boolean,
 *   deleting: boolean,
 *   handleSubmit: Function,
 *   handleMakeDefault: Function,
 *   handleDelete: Function
 * }}
 */

const useChannelEdit = (id, currentUser) => {
  const fetchUser = useFetchCurrentUser();
  const [channel, setChannel] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState(null);
  const [channelImage, setChannelImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();


  // Fetches the channel data from the server and sets initial state.
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/channels/${id}`);
        setChannel(res.data);
        setName(res.data.channelName);
        setDescription(res.data.description);
      } catch (err) {
        console.error("Error fetching channel:", err);
      }
    };
    fetchChannel();
  }, [id]);

    /**
   * Submits the updated channel details to the server.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("channelName", name);
    formData.append("description", description);
    if (banner) formData.append("channelBanner", banner);
    if (channelImage) formData.append("channelImage", channelImage);

    const token = localStorage.getItem("token");
    const loadingToast = toast.loading("Updating channel...");

    try {
      const res = await axios.put(`${API_BASE_URL}/api/channels/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.updatedUser) {
        await fetchUser();
      }

      toast.success("Channel updated successfully!", { id: loadingToast });
    } catch (err) {
      console.error("Error updating channel:", err);
      toast.error("Failed to update channel", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  // Sets the current channel as the user's default channel.
  const handleMakeDefault = async () => {
    const loadingToast = toast.loading("Saving changes...");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/api/users/set-default-channel`,
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        await fetchUser();
        toast.success("Default channel set!", { id: loadingToast });
      }
    } catch (error) {
      console.error("Failed to set default channel:", error);
      toast.error("Failed to set default channel", { id: loadingToast });
    }
  };

  // Deletes the current channel and navigates back to the manage channels page.
  const handleDelete = async () => {
    setDeleting(true);
    const loadingToast = toast.loading("Deleting channel...");
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(`${API_BASE_URL}/api/channels/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data) {
        await fetchUser();
        toast.success("Channel deleted!", { id: loadingToast });
        navigate("/manage-channels")
      }
    } catch (error) {
      console.error("Failed to delete channel:", error);
      toast.error("Failed to delete channel", { id: loadingToast });
    } finally {
      setDeleting(false);
    }
  };

  return {
    channel,
    name,
    setName,
    description,
    setDescription,
    banner,
    setBanner,
    channelImage,
    setChannelImage,
    loading,
    deleting,
    handleSubmit,
    handleMakeDefault,
    handleDelete,
  };
};

export default useChannelEdit;
