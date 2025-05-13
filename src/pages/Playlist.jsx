/**
 * @file Playlist component
 * Displays a list of playlists for the currently authenticated user.
 * Allows the user to filter playlists by "Recently Added" or "A-Z".
 * Each playlist includes a dropdown for editing or deleting.
 * 
 * @component
 * @returns {JSX.Element} Rendered Playlist page
 */


import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { useSelector } from "react-redux";
import useUserPlaylists from "../hook/useUserPlaylists.js";

const Playlist = () => {
    /** 
   * @state {string} filter - Current filter for sorting playlists
   * @state {Array<Object>} playlists - List of playlists belonging to the user
   * @state {boolean} loading - Loading state for fetching playlists
   * @state {string|null} error - Error message if fetching playlists fails
   */

  const [filter, setFilter] = useState("recent");
  const user = useSelector((state) => state.auth.user);
  const currentUserId = user?._id;

  const { playlists, loading, error } = useUserPlaylists(currentUserId);

  /** Sort playlists based on selected filter */
  const sortedPlaylists = [...playlists].sort((a, b) => {
    if (filter === "a-z") return a.name.localeCompare(b.name);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Loading and error handling states
  if (loading) return <p className="p-4">Loading playlists...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Your Playlists</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-200 rounded-lg px-4 py-2 text-sm my-4 font-semibold focus:outline-none appearance-none"
        >
          <option value="recent" className="hover:bg-gray-100">Recently Added</option>
          <option value="a-z">A-Z</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedPlaylists.map((playlist) => {
          const thumb = playlist.videos[0]?.thumbnailUrl;
           const firstVideo = playlist.videos?.[0];
          return (
            <div
              key={playlist._id}
              className="relative rounded-lg shadow hover:shadow-md bg-white"
            >
              <Link
                to={firstVideo ? `/watch/${firstVideo.videoId}` : "#"}
                state={{ playlist }}
              >
                <img
                  src={thumb || "/default-thumbnail.jpg"}
                  alt={playlist.name}
                  className="w-full aspect-video object-cover rounded-t-lg"
                />
                <div className="p-3">
                  <h3 className="text-sm font-semibold truncate">{playlist.name}</h3>
                  <p className="text-xs text-gray-500">{playlist.videos.length} videos</p>
                </div>
              </Link>

              {/* Dropdown */}
              <div className="absolute top-2 right-2">
                <div className="group relative inline-block">
                  <MoreVertical className="w-5 h-5 cursor-pointer text-gray-600" />
                  <div className="hidden group-hover:block absolute right-0 mt-1 bg-white border rounded shadow-md z-10 w-32">
                    <button className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 w-full">
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </button>
                    <button className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 w-full text-red-600">
                      <Trash className="w-4 h-4 mr-2" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Playlist;
