/**
 * WatchLaterPage component displays a list of videos saved for later viewing.
 * Each video has options such as saving to a playlist, downloading, sharing, and removing from the "Watch Later" list.
 * 
 * @component
 * @returns {JSX.Element} A page with a list of videos saved in the "Watch Later" section.
 */



import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useWatchLater } from "../hook/useWatchLater.js"; 
import {
  FaRegBookmark,
  FaClock,
  FaDownload,
  FaShareAlt,
  FaTrashAlt,
} from "react-icons/fa";


const WatchLaterPage = () => {
  const navigate = useNavigate();

  /**
   * Custom hook that manages the "Watch Later" functionality.
   * @function useWatchLater
   * @returns {Object} - An object containing videos, dropdownOpenId, removeFromWatchLater, and toggleDropdown.
   */


  const {
    videos,
    dropdownOpenId,
    removeFromWatchLater,
    toggleDropdown,
  } = useWatchLater();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Watch Later</h2>

      {videos.length === 0 ? (
        <p className="text-gray-500">No videos saved for later.</p>
      ) : (
        videos.map((video) => (
          <div
            key={video._id}
            className="flex gap-4 items-start bg-white rounded-md relative group cursor-pointer mb-4"
          >
            <img
              onClick={() => navigate(`/watch/${video.videoId}`)}
              src={video.thumbnailUrl || "/default-thumbnail.jpg"}
              alt={video.title}
              className="w-20 h-15 sm:w-70 sm:h-40 object-cover rounded-md"
            />
            <div className="flex-1">
              <h4
                onClick={() => navigate(`/watch/${video.videoId}`)}
                className="font-medium text-xs sm:text-lg mb-1 w-[90%]"
              >
                {video.title}
              </h4>
              <p className="text-[10px] sm:text-sm text-gray-700">
                {video.channel?.name || "Unknown Channel"} • {video.views.length || 0} views
              </p>
              <p className="hidden sm:block text-sm text-gray-600 line-clamp-2">
                {video.description || "No description available."}
              </p>
            </div>

            {/*========== 3-dot dropdown ==========*/}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
              <button
                onClick={() => toggleDropdown(video._id)}
                title="Options"
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <BsThreeDotsVertical className="text-gray-500" />
              </button>

              {dropdownOpenId === video._id && (
                <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md text-sm w-55 z-20">
                  <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left">
                    <FaRegBookmark /> Save to Playlist
                  </button>
                  <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left">
                    <FaDownload /> Download
                  </button>
                  <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left">
                    <FaShareAlt /> Share
                  </button>
                  <hr />
                  <button
                    onClick={() => removeFromWatchLater(video._id)}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-100 text-left"
                  >
                    <FaTrashAlt /> Remove from Watch Later
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WatchLaterPage;
