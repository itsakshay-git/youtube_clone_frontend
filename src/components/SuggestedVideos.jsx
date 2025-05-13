import { useState } from "react";
import moment from "moment";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  MdQueue,
  MdWatchLater,
  MdPlaylistAdd,
  MdFileDownload,
  MdShare,
  MdOutlineThumbDown,
  MdBlock,
  MdFlag,
} from "react-icons/md";
import PlaylistModal from "../model/PlaylistModal.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

/**
 * SuggestedVideos component displays a list of suggested videos with a dropdown menu for each video.
 * It includes actions like adding to queue, saving to watch later, saving to a playlist, and more.
 *
 * @param {Object} props - The props for the component.
 * @param {Array} props.suggestions - List of suggested videos to be displayed.
 * @param {Object} props.channelNames - Mapping of channel IDs to channel names for display.
 * @param {Function} props.onSelect - Function to handle video selection when a video is clicked.
 *
 * @returns {JSX.Element} The SuggestedVideos component.
 */

function SuggestedVideos({ suggestions, channelNames, onSelect }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  /**
   * Handles opening the playlist modal when saving a video to a playlist.
   *
   * @param {string} videoId - The ID of the video being saved to a playlist.
   */

  const handleSaveToPlaylist = (videoId) => {
    if (!user) {
    navigate("/login");
    return;
  }
    setSelectedVideoId(videoId);
    setShowPlaylistModal(true);
    setActiveDropdown(null);
  };

  return (
    <div className="bg-white pt-4 rounded space-y-4 scrollbar-hide">
      <h3 className="text-lg font-semibold mb-2 mx-2">Suggested Videos</h3>
      <ul className="space-y-4">
        {suggestions.map((v, index) => (
          <li
            key={v._id}
            className="relative cursor-pointer flex gap-3 hover:bg-gray-100 rounded p-2 transition"
          >
            <img
              onClick={() => onSelect(v.videoId)}
              src={v.thumbnailUrl || "/placeholder-thumbnail.jpg"}
              alt={v.title}
              className="w-32 h-20 object-cover rounded"
            />
            <div className="flex flex-col justify-between text-sm flex-grow">
              <p
                onClick={() => onSelect(v.videoId)}
                className="font-medium line-clamp-2"
              >
                {v.title}
              </p>
              <span className="text-gray-500">
                {channelNames[v.channelId] || "Unknown Channel"}
              </span>
              <span className="text-gray-500 text-xs">
                {v.views.length || 0} views • {moment(v.uploadDate).fromNow()}
              </span>
            </div>

            {/*======== 3-dot icon =========*/}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === index ? null : index);
                }}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <BsThreeDotsVertical />
              </button>

              {/*========== Dropdown ============*/}
              {activeDropdown === index && (
                <ul className="absolute right-0 top-8 w-56 bg-white shadow-md rounded z-50 text-sm">
                  <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-default">
                    <MdQueue /> Add to queue
                  </li>
                  <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-default">
                    <MdWatchLater /> Save to Watch later
                  </li>
                  <li
                    className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSaveToPlaylist(v._id)}
                  >
                    <MdPlaylistAdd /> Save to playlist
                  </li>
                  <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-default">
                    <MdFileDownload /> Download
                  </li>
                  <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-default">
                    <MdShare /> Share
                  </li>
                  <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-default">
                    <MdOutlineThumbDown /> Not interested
                  </li>
                  <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-default">
                    <MdBlock /> Don't recommend channel
                  </li>
                  <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-default">
                    <MdFlag /> Report
                  </li>
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/*========= Playlist Modal ==========*/}
      {showPlaylistModal && (
        <PlaylistModal
          videoId={selectedVideoId}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </div>
  );
}

export default SuggestedVideos;
