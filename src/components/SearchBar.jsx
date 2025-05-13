import { XIcon, History, Search, Mic } from "lucide-react";
import useSearch from "../hook/useSearch.js";

/**
 * SearchBar component that handles search functionality, including user input,
 * recent searches, and suggestion display.
 *
 * @component
 * @returns {JSX.Element} The SearchBar component.
 *
 * @description 
 * This component provides a search input field with various interactive features. 
 * It supports:
 * - Searching with a text input field.
 * - Displaying recent searches when the query is empty and the user interacts with the input field.
 * - Displaying suggestions based on the input query.
 * - Handling search actions with the `handleSearch` function.
 * - Managing the recent search list with options to remove or click recent searches.
 * - Supporting microphone button (hidden on small screens).
 * 
 * It uses the `useSearch` custom hook to manage the search state and behavior.
 */

function SearchBar() {
  const {
  query,
  setQuery,
  suggestions,
  activeIndex,
  activeRecentIndex,
  showRecent,
  recentSearches,
  searchInputRef,
  suggestionsRef,
  handleSearch,
  handleKeyDown,
  handleSuggestionClick,
  handleRecentSearchClick,
  handleRemoveRecentSearch,
  handleClearSearch,
  setShowRecent
} = useSearch();

  return (
    <div className="relative w-[100%] md:w-[70%]">
      <div className="flex items-center">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (query.trim() === "") setShowRecent(true);
              }}
              className="border rounded-l-full px-3 py-2 w-full border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />

            {query && (
              <button
                onClick={handleClearSearch}
                className="bg-gray-300 text-gray-700 p-3"
              >
                <XIcon size={16} />
              </button>
            )}

            <button
              onClick={handleSearch}
              className="bg-gray-200 text-white border border-gray-400 px-6 rounded-r-full hover:bg-gray-300 py-2"
            >
              <Search className="text-black" />
            </button>

            {/* Mic icon button */}
            <button className="hidden sm:block ml-2 p-3 rounded-full bg-gray-100 hover:bg-gray-200">
              <Mic className="text-black" size={18} />
            </button>
      </div>

      {/* Show recent searches if query is empty and showRecent is true */}
      {showRecent && !query && recentSearches.length > 0 && (
        <ul ref={suggestionsRef} className="absolute bg-white rounded-lg shadow w-[100%] md:w-[90%] z-10 max-h-60 overflow-y-auto mt-2">
          {recentSearches.map((search, index) => (
            <li
              key={search}
              onClick={() => handleRecentSearchClick(search)}
              className={`p-2 cursor-pointer ${
                index === activeRecentIndex ? "bg-gray-200" : "hover:bg-gray-100"
              } flex justify-between items-center`}
            >
              <div className="flex gap-2 justify-center items-center">
                <History  size={14} />
                <span>{search}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleRemoveRecentSearch(search); }} className="text-blue-400 text-sm">
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Show suggestions */}
      {suggestions.length > 0 && query && (
        <ul ref={suggestionsRef} className="absolute bg-white w-full z-10 max-h-60 shadow-2xl rounded-lg overflow-y-auto mt-2 scrollbar-hide">
          {suggestions.map((s, index) => (
            <li
              key={s.videoId || s.playlistId}
              onClick={() => handleSuggestionClick(s)}
              className={`p-2 cursor-pointer ${
                index === activeIndex ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              {s.title} ({s.type})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
