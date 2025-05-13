import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useFetchCurrentUser from "./useFetchCurrentUser";
import API_BASE_URL from "../config/api.js";

/**
 * Custom hook to fetch and manage channel-related state and actions such as
 * subscription toggle and deletion of videos/playlists.
 *
 * @param {string} channelId - The ID of the channel to fetch and manage.
 * @returns {{
 *   channel: object|null,
 *   user: object|null,
 *   isSubscribed: boolean,
 *   handleDeleteVideo: (videoId: string) => Promise<void>,
 *   handleDeletePlaylist: (playlistId: string) => Promise<void>,
 *   handleSubscribeToggle: () => Promise<void>
 * }} Object containing the channel info, subscription state, and action handlers.
 */

const useFetchChannel = (channelId) => {
  const [channel, setChannel] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const user = useSelector((state) => state.auth.user);
  /** Custom hook to fetch the latest user data from the server */
  const fetchUser = useFetchCurrentUser();

  // Sync subscription status when component mounts or channelId changes
  useEffect(() => {
    const init = async () => {
      const freshUser = await fetchUser(); // use your hook
      if (!freshUser) return;

      const subscribed = freshUser.subscriptions?.some(
        (sub) => sub === channelId || sub._id === channelId
      );

      setIsSubscribed(subscribed);
    };

    init();
  }, [channelId]);

  // Update subscription state when either user or channel info changes
  useEffect(() => {
    if (channel && user?.subscriptions?.includes(channel.owner)) {
      setIsSubscribed(true);
    } else {
      setIsSubscribed(false);
    }
  }, [user, channel]);

  /**
   * Toggles subscription status for the current user and channel.
   * Makes API call to either subscribe or unsubscribe.
   */
  const handleSubscribeToggle = async () => {
    if (!channel || !user) return;

    try {
      const endpoint = isSubscribed
        ? `${API_BASE_URL}/api/channels/unsubscribe/${channelId}`
        : `${API_BASE_URL}/api/channels/subscribe/${channelId}`;

      await axios.put(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Then fetch updated user info and re-evaluate
      const updatedUser = await fetchUser();

      const isNowSubscribed = updatedUser?.subscriptions?.some(
        (sub) => sub === channel._id || sub._id === channel._id
      );

      setIsSubscribed(isNowSubscribed);
    } catch (err) {
      console.error("Subscription error:", err.response?.data || err.message);
    }
  };

  // Fetch channel details when the channelId changes
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/channels/${channelId}`
        );
        setChannel(res.data);
      } catch (error) {
        console.error("Error fetching channel:", error);
      }
    };
    fetchChannel();
  }, [channelId]);

  /**
   * Deletes a video by its ID.
   *
   * @param {string} videoId - The ID of the video to delete.
   * @returns {Promise<void>}
   */

  const handleDeleteVideo = async (videoId) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 200) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to delete video", err);
    }
  };

  /**
   * Deletes a playlist by its ID.
   *
   * @param {string} playlistId - The ID of the playlist to delete.
   * @returns {Promise<void>}
   */

  const handleDeletePlaylist = async (playlistId) => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/api/playlists/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to delete playlist", err);
    }
  };

  return {
    channel,
    user,
    isSubscribed,
    handleDeleteVideo,
    handleDeletePlaylist,
    handleSubscribeToggle,
  };
};

export default useFetchChannel;
