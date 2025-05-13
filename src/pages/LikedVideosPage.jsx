/**
 * @file LikedVideosPage.jsx
 * @description Displays all videos liked by the user, grouped by date. Each video includes a 3-dot dropdown with various actions.
 * Uses `useLikedVideos` hook for state and handlers. Supports navigation to watch page and removing from liked list.
 */

import { BsThreeDotsVertical } from "react-icons/bs";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { FaRegBookmark, FaClock, FaDownload, FaShareAlt, FaTrashAlt } from "react-icons/fa";
import useLikedVideos from "../hook/useLikedVideos.js";


/**
 * LikedVideosPage component - displays a grouped list of liked videos with actions via a dropdown menu.
 *
 * @component
 * @returns {JSX.Element} Rendered component for the Liked Videos page.
 *
 * @example
 * return (
 *   <LikedVideosPage />
 * )
 */

const LikedVideosPage = () => {
  const {
    groupedVideos,
    dropdownOpenId,
    toggleDropdown,
    handleRemoveFromLiked,
  } = useLikedVideos();

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Liked Videos</h2>

      {Object.keys(groupedVideos).length === 0 ? (
        <p className="text-gray-500">No liked videos found.</p>
      ) : (
        Object.keys(groupedVideos)
          .sort((a, b) => new Date(b) - new Date(a))
          .map((date) => (
            <div key={date} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                {moment(date).format("MMMM Do, YYYY")}
              </h3>
              <div className="grid gap-4">
                {groupedVideos[date].map((video) => (
                  <div
                    key={video._id}
                    className="flex gap-4 items-start bg-white rounded-md relative group cursor-pointer hover:bg-gray-100"
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
                        className="font-medium text-xs sm:text-lg mb-1 w-[80%] sm:w-[90%]"
                      >
                        {video.title}
                      </h4>
                      <p className="text-[10px] sm:text-sm text-gray-700">
                        {video.channel?.name || "Unknown Channel"} •{" "}
                        {video.views.length || 0} views
                      </p>
                      <p className="hidden sm:block text-sm text-gray-600 line-clamp-2">
                        {video.description || "No description available."}
                      </p>
                    </div>

                    {/*====== 3-dot dropdown ====== */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
                      <button
                        onClick={() => toggleDropdown(video._id)}
                        title="Options"
                        className="p-1 hover:bg-gray-200 rounded-full"
                      >
                        <BsThreeDotsVertical className="text-gray-500" />
                      </button>

                      {dropdownOpenId === video._id && (
                        <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md text-sm w-55">
                          <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left">
                           <FaRegBookmark /> Save to Playlist
                          </button>
                          <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left">
                            <FaClock /> Save to Watch Later
                          </button>
                          <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left">
                            <FaDownload /> Download
                          </button>
                          <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left">
                            <FaShareAlt /> Share
                          </button>
                          <hr />
                          <button
                            onClick={() => handleRemoveFromLiked(video._id, video.likes)}
                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-100 text-left"
                          >
                            <FaTrashAlt /> Remove from Liked Videos
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default LikedVideosPage;
