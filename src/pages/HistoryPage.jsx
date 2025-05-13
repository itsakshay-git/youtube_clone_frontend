/**
 * @file HistoryPage.jsx
 * @description Displays the user's watch history with search, delete, and dropdown options.
 * Utilizes custom hook `useHistoryVideos` for state and logic handling.
 */

import moment from "moment";
import { Link } from "react-router-dom"; 
import { AiOutlineClose, AiOutlineSearch  } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdPauseCircleOutline, MdManageHistory, MdDeleteSweep } from "react-icons/md";
import useHistoryVideos from "../hook/useHistoryVideos.js";


/**
 * HistoryPage component renders a list of watched videos grouped by date,
 * with features like search, remove individual history entries, clear all,
 * and a dropdown menu for more options per video.
 *
 * @component
 * @returns {JSX.Element} The rendered history page component.
 */

const HistoryPage = () => {

    const {
    searchInput,
    setSearchInput,
    handleKeyDown,
    handleClearSearch,
    handleClearHistory,
    handleRemoveFromHistory,
    toggleDropdown,
    dropdownOpenId,
    filteredVideos,
  } = useHistoryVideos();

  return (
    <div className="p-4 max-w-7xl mx-auto overflow-y-auto max-h-[calc(100vh-100px)] pr-2 scrollbar-hide">
      <h2 className="text-2xl font-bold mb-6">Watch History</h2>

      <div className="flex flex-col-reverse md:flex-row gap-6 relative">
        {/* LEFT SECTION: Watch History List */}
        <div className="flex-1">
          {Object.keys(filteredVideos).length === 0 ? (
            <p className="text-gray-500">No history found.</p>
          ) : (
            Object.keys(filteredVideos)
              .sort((a, b) => new Date(b) - new Date(a))
              .map((date) => (
                <div key={date} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {moment(date).format("MMMM Do, YYYY")}
                  </h3>
                  <div className="grid gap-4">
                    {filteredVideos[date].map((video) => (
                      <div
                      key={video._id}
                      className="flex gap-4 items-start bg-white rounded-md relative group hover:bg-gray-100"
                    >
                      <Link to={`/watch/${video.videoId}`} className="flex gap-4 w-full">
                        <img
                          src={video.thumbnailUrl || "/default-thumbnail.jpg"}
                          alt={video.title}
                          className="w-20 h-15 sm:w-70 sm:h-40 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-[10px] sm:text-xl w-[60%] sm:w-[85%]">{video.title}</h4>
                          <p className="text-[10px] sm:text-sm text-gray-700">
                            {video.channel?.name || "Unknown Channel"} • {video.views.length || 0} views
                          </p>
                          <p className="hidden sm:block text-sm text-gray-600 line-clamp-2">
                            {video.description || "No description available."}
                          </p>
                        </div>
                      </Link>

                      {/* Clear Icon */}
                      <button
                        onClick={() => handleRemoveFromHistory(video._id)}
                        title="Remove from history"
                        className="absolute top-2 right-10"
                      >
                        <AiOutlineClose className="text-gray-500 hover:text-red-500" />
                      </button>

                      {/* 3-Dot Dropdown */}
                      <div className="absolute top-2 right-2">
                        <button onClick={() => toggleDropdown(video._id)} title="Options">
                          <BsThreeDotsVertical className="text-gray-500 hover:text-black" />
                        </button>
                        {dropdownOpenId === video._id && (
                          <div className="absolute right-0 z-10 mt-2 bg-white shadow-md rounded-md text-sm w-40">
                            <button className="block w-full px-4 py-2 hover:bg-gray-100 text-left">
                              Save to Playlist
                            </button>
                            <button className="block w-full px-4 py-2 hover:bg-gray-100 text-left">
                              Save to Watch Later
                            </button>
                            <button className="block w-full px-4 py-2 hover:bg-gray-100 text-left">
                              Download
                            </button>
                            <button className="block w-full px-4 py-2 hover:bg-gray-100 text-left">
                              Share
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


        {/* RIGHT SECTION: Search & Controls */}
        <div className="flex justify-center w-full md:w-[50%] lg:w-[40%] sm:sticky sm:top-20 self-start h-fit rounded-md p-4 bg-white">
        <div className="flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative border-b-2 flex justify-center items-center">
            <AiOutlineSearch />
            <input
              type="text"
              placeholder="Search watch history"
              className="w-full px-3 py-2 pr-8 text-sm rounded-md outline-none border-none focus:ring-0"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 text-lg"
                title="Clear search"
              >
                <AiOutlineClose />
              </button>
            )}

          </div>

          {/* Dummy Buttons */}
          <button
            onClick={handleClearHistory}
            className="text-left font-medium text-sm hover:underline flex items-center gap-1"
          >
            <MdDeleteSweep className="text-lg" />
            Clear All History
          </button>
          <button className="text-left font-medium text-sm hover:underline flex items-center gap-1">
            <MdPauseCircleOutline className="text-lg" />
            Pause Watch History
          </button>
          <button className="text-left font-medium text-sm hover:underline flex items-center gap-1">
            <MdManageHistory className="text-lg" />
            Manage All History
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
