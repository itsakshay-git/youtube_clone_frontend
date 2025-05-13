import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import useFetchCurrentUser from "./useFetchCurrentUser";
import API_BASE_URL from '../config/api.js';


/**
 * Custom hook to handle video player interactions, including like, dislike, subscribe,
 * and other video functionalities like history, watch later, and playlist management.
 *
 * @param {Object} video - The video object containing video details.
 * @returns {Object} - An object containing all the state and methods for video player functionality.
 */

const useVideoPlayer = (video) => {
  const currentUserId = useSelector((state) => state.auth.user?._id);
  const [isLiked, setIsLiked] = useState(video.likes.includes(currentUserId));
  const [isDisliked, setIsDisliked] = useState(
    video.dislikes.includes(currentUserId)
  );
  const [channelInfo, setChannelInfo] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [userChannel, setUserChannel] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const [isInWatchLater, setIsInWatchLater] = useState(false);
  const dropdownRef = useRef();

  const navigate = useNavigate();
  const fetchCurrentUser = useFetchCurrentUser();

    /**
   * Default channel ID from Redux state
   * @type {string|null}
   */

  const defaultChannelId = useSelector(
    (state) => state.auth.user?.defaultChannel
  );
  const user = useSelector((state) => state.auth.user);

    /**
   * Helper function to trigger an authentication modal if the user is not logged in
   * @param {function} callback - The callback to run after successful authentication.
   */

  const requireAuth = (callback) => {
    if (!currentUserId) {
      setShowAuthModal(true);
      return;
    }
    callback();
  };

    // Effect to add video to the history when the video is played
  useEffect(() => {
    const addToHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        if (video?._id && token) {
          await axios.put(
            `${API_BASE_URL}/api/videos/history/${video._id}`,
            {},
            config
          );
      }
      } catch (err) {
        console.error("Error adding to history", err.response?.data || err.message);
      }
    };
  
    if (video?._id) addToHistory();
  }, [video?._id]);


    // Effect to update like and dislike states when the video state changes
  useEffect(() => {
    setIsLiked(video.likes.includes(currentUserId));
    setIsDisliked(video.dislikes.includes(currentUserId));
  }, [video]);

    // Effect to register view count for the video when the video is played
  useEffect(() => {
    if (!video || !currentUserId) return;

    const token = localStorage.getItem("token");
    // Register the view
    const registerView = async () => {
      try {
        await axios.post(
          `${API_BASE_URL}/api/videos/${video.videoId}/view`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("Error registering view:", err);
      }
    };

    registerView();

  }, [video, currentUserId]);

   // Effect to handle closing dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    // Effect to fetch user’s channel information
  useEffect(() => {
    const fetchUserChannel = async () => {
      try {
        const token = localStorage.getItem("token");
        if(defaultChannelId){
          const res = await axios.get(
            `${API_BASE_URL}/api/channels/${defaultChannelId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserChannel(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch user channel:", error);
      }
    };

    if (currentUserId) {
      fetchUserChannel();
    }
  }, [currentUserId]);

  // Effect to fetch channel information (subscribe/unsubscribe, etc.)
  useEffect(() => {
    const fetchChannelInfo = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/channels/${video.channelId}`
        );
        setChannelInfo(res.data);
        setIsSubscribed(res.data.subscribersList.includes(currentUserId));
      } catch (error) {
        console.error("Error fetching channel info:", error);
      }
    };

    if (video.channelId) {
      fetchChannelInfo();
    }
  }, [video.channelId, currentUserId]);

  // useEffect(() => {
  //   setIsLiked(video.likes);
  //   setIsDisliked(video.dislikes);
  // }, [video.likes, video.dislikes, currentUserId]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.put(
        `${API_BASE_URL}/api/videos/like/${video._id}`,
        {},
        config
      );

      // Update local video state
      video.likes = res.data.likes;
      video.dislikes = res.data.dislikes;
      
      setIsLiked(res.data.likes.includes(currentUserId));
      setIsDisliked(false);
    } catch (error) {
      console.error(
        "Error liking video:",
        error.response?.data || error.message
      );
    }
  };

  const handleDislike = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.put(
        `${API_BASE_URL}/api/videos/dislike/${video._id}`,
        {},
        config
      );

      // Update local video state
      video.likes = res.data.likes;
      video.dislikes = res.data.dislikes;
      setIsLiked(false);
      setIsDisliked(res.data.dislikes.includes(currentUserId));
    } catch (error) {
      console.error(
        "Error disliking video:",
        error.response?.data || error.message
      );
    }
  };


  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      const channelId = video?.channelId;

      if (!channelId) {
        console.error("No channelId found in video object.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const url = isSubscribed
        ? `${API_BASE_URL}/api/channels/unsubscribe/${channelId}`
        : `${API_BASE_URL}/api/channels/subscribe/${channelId}`;

      const response = await axios.put(url, {}, { headers });

      // Refresh channel info
      const res = await axios.get(
        `${API_BASE_URL}/api/channels/${channelId}`
      );
      const updatedChannel = res.data;
      setChannelInfo(updatedChannel);

      const subscribed = updatedChannel.subscribersList.includes(userId);
      setIsSubscribed(subscribed);
    } catch (error) {
      console.error(
        "Subscription toggle failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  const updateVideoLikes = (updatedLikes) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `${API_BASE_URL}/api/videos/like/${video.videoId}`,
        { likes: updatedLikes },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => console.log("Likes updated", res.data))
      .catch((error) => console.error("Error updating likes:", error));
  };

  const updateVideoDislikes = (updatedDislikes) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `${API_BASE_URL}/api/videos/dislike/${video.videoId}`,
        { dislikes: updatedDislikes },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => console.log("Dislikes updated", res.data))
      .catch((error) => console.error("Error updating dislikes:", error));
  };

  const fetchUserPlaylists = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/api/playlists/user/${currentUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserPlaylists(res.data);
    } catch (err) {
      console.error("Failed to fetch playlists:", err);
    }
  };

  const handleSaveToPlaylist = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `${API_BASE_URL}/api/playlists/create`,
        {
          name: playlistName,
          videoId: video._id,
          userId: currentUserId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setIsModalOpen(false);
        console.log("Video added to playlist:", res.data);
      })
      .catch((error) => {
        console.error(
          "Error saving to playlist:",
          error.response?.data || error
        );
      });
  };

  const handleWatchLater = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
  
      const res = await axios.put(
        `${API_BASE_URL}/api/videos/watch-later/${video._id}`,
        {},
        config
      );
  
      setIsInWatchLater(res.data.watchLater.includes(video._id));
    } catch (error) {
      console.error(
        "Error updating Watch Later:",
        error.response?.data || error.message
      );
    }
  };
  

  const isYouTube =
    video.videoUrl.includes("youtube.com") ||
    video.videoUrl.includes("youtu.be");

  const getYouTubeId = (url) => {
    try {
      const urlObj = new URL(url);
      return url.includes("youtu.be")
        ? urlObj.pathname.slice(1)
        : urlObj.searchParams.get("v");
    } catch {
      return null;
    }
  };

  const youTubeId = isYouTube ? getYouTubeId(video.videoUrl) : null;

  const getVideoSrc = (url) => {
    const cleanedUrl = url.replaceAll("\\", "/");
    return cleanedUrl.startsWith("http")
      ? cleanedUrl
      : `${API_BASE_URL}${cleanedUrl}`;
  };

  const getTimeAgo = (uploadDate) => moment(uploadDate).fromNow();

  const dummyContent = `
  This is additional dummy content to simulate a longer video description. 
  It can include:
  - Details about the creator
  - Links to social media
  - Sponsor information
  - Hashtags, timestamps, FAQs, etc.
  
  Thank you for watching! Don't forget to like and subscribe!
  `;
  const fullDescription = `${video.description || ""}\n\n${dummyContent}`;

  return {
    isLiked,
    isDisliked,
    isSubscribed,
    isModalOpen,
    playlistName,
    userChannel,
    showAuthModal,
    userPlaylists,
    channelInfo,
    showFullDescription,
    showDropdown,
    showSaveDropdown,
    setShowSaveDropdown,
    setShowDropdown,
    setPlaylistName,
    setIsModalOpen,
    setShowAuthModal,
    setShowFullDescription,
    fetchUserPlaylists,
    requireAuth,
    handleLike,
    handleDislike,
    handleSubscribe,
    handleSaveToPlaylist,
    handleWatchLater,
    getVideoSrc,
    isYouTube,
    getYouTubeId,
    getTimeAgo,
    fullDescription,
    currentUserId,
    youTubeId,
    dropdownRef,
    isInWatchLater,
    navigate,
  };
};

export default useVideoPlayer;
