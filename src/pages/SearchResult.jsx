import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { MdPlaylistAdd } from "react-icons/md";
import useSearchResults from "../hook/useSearchResults.js";


/**
 *@file `SearchResult` component renders a list of search results, with filters and a dropdown menu for each item.
 * Users can click on items (videos or playlists) to navigate to the appropriate page, and interact with additional options in the dropdown.
 * 
 * @component
 * @example
 *  Renders the SearchResult component with active filter and clickable results
 * <SearchResult />
 */

function SearchResult() {
  const userId = "user123";
  const navigate = useNavigate();
  const {
    query,
    filters,
    filteredResults,
    activeFilter,
    setActiveFilter,
    openDropdownId,
    toggleDropdown,
  } = useSearchResults(userId);


    /**
   * Handle a click event on a search result item (either video or playlist).
   * Navigates to the appropriate page based on the item type (video or playlist).
   * 
   * @param {Object} item - The item clicked by the user.
   * @param {string} item.type - Type of item ("video" or "playlist").
   * @param {string} item.videoId - The ID of the video (if item is a video).
   * @param {Object[]} item.videos - List of videos (if item is a playlist).
   */
  
  const handleClick = (item) => {
    if (item.type === "video") {
      navigate(`/watch/${item.videoId}`);
    } else if (item.type === "playlist" && item.videos?.[0]?.videoId) {
      navigate(`/watch/${item.videos[0].videoId}`, {
        state: { playlist: { videos: item.videos } },
      });
    }
  };

  return (
    <div className="p-4">
      {/* Filter chips */}
      <div className="mb-4 flex gap-2 overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`px-4 py-1 h-8 rounded-lg text-sm ${
              activeFilter === filter
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Filtered result list */}
      {filteredResults.length > 0 ? (
        filteredResults.map((item) => (
          <div
            key={item._id}
            className="relative group cursor-pointer p-4 mb-4 flex hover:bg-gray-100 rounded"
          >
            {item.type === "video" ? (
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-20 h-15 sm:w-48 sm:h-28 object-cover rounded mr-4"
                onClick={() => handleClick(item)}
              />
            ) : (
              <div
                className="w-20 h-15 sm:w-48 sm:h-28 bg-gray-300 rounded mr-4 flex items-center justify-center text-black text-3xl"
                onClick={() => handleClick(item)}
              >
                <MdPlaylistAdd />
              </div>
            )}

            <div className="flex-1" onClick={() => handleClick(item)}>
              <p className="font-medium text-sm sm:text-lg text-gray-900">
                {item.title || item.name}
              </p>
              <p className="hidden sm:block text-sm text-gray-600 mt-1">
                {item.description || `${item.videos?.length} videos`}
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => toggleDropdown(item._id)}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <MoreVertical size={20} />
              </button>

              {openDropdownId === item._id && (
                <div className="absolute right-0 top-8 w-48 bg-white shadow-md rounded-md z-10 text-sm border">
                  {[
                    "Save to playlist",
                    "Add to queue",
                    "Save to Watch Later",
                    "Download",
                    "Share",
                    "Report",
                  ].map((option, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 mt-6">No results found.</p>
      )}
    </div>
  );
}

export default SearchResult;
