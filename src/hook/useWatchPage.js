import { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api.js";

/**
 * Custom hook for managing the Watch Page logic.
 *
 * This hook handles video playback, video suggestions, playlist management,
 * and fetching the necessary video and channel data for the current video page.
 *
 * @returns {Object} - The hook's return object.
 * @returns {Object|null} video - The currently selected video object.
 * @returns {Object|null} playlist - The playlist object associated with the current video (if any).
 * @returns {Array} videos - List of all videos fetched for suggestions.
 * @returns {Object} channelNames - A map of channel IDs to channel names.
 * @returns {Array} filteredSuggestions - A filtered list of videos not already in the playlist.
 * @returns {Array} playlistVideoIds - A list of video IDs from the current playlist.
 * @returns {boolean} showPlaylist - Boolean indicating whether the playlist is visible.
 * @returns {Function} setShowPlaylist - Function to toggle the visibility of the playlist.
 * @returns {number|null} openDropdownIndex - Index of the dropdown that is currently open.
 * @returns {Function} handleDropdownToggle - Function to toggle dropdown visibility for video options.
 * @returns {Array} dropdownRefs - References to the dropdown elements for managing click outside behavior.
 * @returns {Function} handleSaveToPlaylist - Function to handle saving a video to a playlist.
 * @returns {boolean} showPlaylistModal - Boolean indicating whether the playlist modal is open.
 * @returns {Function} setShowPlaylistModal - Function to open/close the playlist modal.
 * @returns {string|null} selectedVideoId - The ID of the video selected for playlist saving.
 * @returns {Function} handleVideoSelect - Function to handle selecting a video to watch.
 * @returns {Function} handleSelectFromPlaylist - Function to handle selecting a video from a playlist.
 */

const useWatchPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [video, setVideo] = useState(location.state?.video || null);
  const [playlist, setPlaylist] = useState(location.state?.playlist || null);
  const [videos, setVideos] = useState([]);
  const [channelNames, setChannelNames] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  const dropdownRefs = useRef([]);

  /**
   * Handles closing the dropdown menu if clicked outside of it.
   * This effect listens for `mousedown` events and closes any open dropdowns.
   *
   * @returns {void}
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefs.current.every((ref) => ref && !ref.contains(event.target))
      ) {
        setOpenDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Toggles the visibility of the dropdown for a specific video.
   *
   * @param {number} index - The index of the video whose dropdown should be toggled.
   * @returns {void}
   */
  const handleDropdownToggle = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  /**
   * Opens the modal to save the selected video to a playlist.
   *
   * @param {string} videoId - The ID of the video to be saved to the playlist.
   * @returns {void}
   */
  const handleSaveToPlaylist = (videoId) => {
    setSelectedVideoId(videoId);
    setShowPlaylistModal(true);
  };

  /**
   * Navigates to the watch page of a selected video.
   *
   * @param {string} videoId - The ID of the video to be selected and watched.
   * @returns {void}
   */

  const handleVideoSelect = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  /**
   * Navigates to the watch page of a selected video, passing the current playlist.
   *
   * @param {string} videoId - The ID of the video to be selected and watched from the playlist.
   * @returns {void}
   */

  const handleSelectFromPlaylist = (videoId) => {
    navigate(`/watch/${videoId}`, { state: { playlist } });
  };

  /**
   * Fetches a single video based on the video ID.
   *
   * @returns {Promise<void>} Resolves when the video is fetched successfully.
   */
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/videos/${id}`);
        setVideo(res.data);
      } catch (err) {
        console.error("Failed to fetch video", err);
      }
    };

    fetchVideo();
  }, [id]);

  /**
   * Fetches all videos and their associated channels.
   * This function also filters out invalid or non-existing channels.
   *
   * @returns {Promise<void>} Resolves when the videos and channels are successfully fetched.
   */
  useEffect(() => {
    const fetchVideosAndChannels = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/videos`);
        const fetchedVideos = res.data;

        const uniqueChannelIds = [
          ...new Set(fetchedVideos.map((v) => v.channelId)),
        ];
        const channelMap = {};
        const validChannelIds = [];

        await Promise.all(
          uniqueChannelIds.map(async (channelId) => {
            try {
              const channelRes = await axios.get(
                `${API_BASE_URL}/api/channels/${channelId}`
              );
              if (channelRes?.data) {
                channelMap[channelId] = channelRes.data.channelName;
                validChannelIds.push(channelId);
              }
            } catch (err) {
              if (err.response?.status !== 404) {
                console.warn(`Error fetching channel ${channelId}`, err);
              }
            }
          })
        );

        const filtered = fetchedVideos.filter((v) =>
          validChannelIds.includes(v.channelId)
        );

        setVideos(filtered);
        setChannelNames(channelMap);
      } catch (err) {
        console.error("Error fetching videos or channels", err);
      }
    };

    fetchVideosAndChannels();
  }, []);

  /** @type {Array} List of video IDs from the current playlist */
  const playlistVideoIds = playlist?.videos.map((v) => v.videoId);

  /** @type {Array} Filtered list of video suggestions excluding videos already in the playlist */
  const filteredSuggestions = videos.filter(
    (v) => !playlistVideoIds?.includes(v.videoId)
  );

  return {
    video,
    playlist,
    videos,
    channelNames,
    filteredSuggestions,
    playlistVideoIds,
    showPlaylist,
    setShowPlaylist,
    openDropdownIndex,
    handleDropdownToggle,
    dropdownRefs,
    handleSaveToPlaylist,
    showPlaylistModal,
    setShowPlaylistModal,
    setVideo,
    selectedVideoId,
    handleVideoSelect,
    handleSelectFromPlaylist,
  };
};

export default useWatchPage;
