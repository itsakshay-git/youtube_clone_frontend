import { useState } from "react";
import { Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import PlaylistModal from "../model/PlaylistModal";

/**
 * VideoCard component displays a video thumbnail, title, uploader, and a dropdown
 * menu with actions like saving to a playlist.
 *
 * @component
 * @param {Object} props - React props
 * @param {Object} props.video - The video data object
 * @param {string} props.video._id - The unique database ID of the video
 * @param {string} props.video.videoId - The route-safe ID for the video used in URLs
 * @param {string} props.video.title - The title of the video
 * @param {string} props.video.thumbnailUrl - The URL of the video thumbnail image
 * @param {Object} props.video.uploader - The uploader's user object
 * @param {string} props.video.uploader.username - The uploader's username
 * @param {Array} props.video.views - Array of views on the video
 *
 * @returns {JSX.Element} The rendered VideoCard component
 */

function VideoCard({ video }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /**
   * Toggles the visibility of the dropdown menu
   * @param {React.MouseEvent} e - The mouse event
   */

  const handleToggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  /**
   * Opens the playlist modal and closes the dropdown
   */
  const handleSaveToPlaylist = () => {
    setShowModal(true);
    setDropdownOpen(false);
  };

  return (
    <>
      <div className="p-2 hover:shadow-md transition rounded-md relative">
        <Link to={`/watch/${video.videoId}`} className="block">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <img
              src={video.thumbnailUrl?.length ? video.thumbnailUrl : ""}
              alt={video.title}
              className="absolute w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Title + 3-dot dropdown */}
        <div className="flex justify-between items-start mt-2 relative">
          <h3
            className="font-semibold text-base sm:text-lg truncate w-4/5"
            title={video.title}
          >
            {video.title}
          </h3>

          <div className="relative">
            <button
              onClick={handleToggleDropdown}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <BsThreeDotsVertical size={18} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 bg-white rounded shadow-md w-48 z-10">
                <ul className="text-sm">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleSaveToPlaylist}
                  >
                    Save to Playlist
                  </li>
                  <li className="px-4 py-2 text-gray-400">Add to Queue</li>
                  <li className="px-4 py-2 text-gray-400">Download</li>
                  <li className="px-4 py-2 text-gray-400">Share</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <Link to={`/watch/${video.videoId}`} className="block">
          <p className="text-sm text-gray-600 mt-1">
            {video.uploader.username}
          </p>
          <p className="text-xs text-gray-500">{video.views.length} views</p>
        </Link>
      </div>

      {/* Modal */}
      {showModal && (
        <PlaylistModal
          videoId={video._id}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default VideoCard;
