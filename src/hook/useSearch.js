import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api.js";

/**
 * Custom hook to manage search functionality with suggestions and recent searches.
 * Handles user input, displays suggestions, manages recent searches, and navigation.
 *
 * @returns {{
 *   query: string,
 *   setQuery: React.Dispatch<React.SetStateAction<string>>,
 *   suggestions: Array<{ type: string, videoId: string, playlistId: string, videos: Array }>,
 *   activeIndex: number,
 *   activeRecentIndex: number,
 *   showRecent: boolean,
 *   recentSearches: string[],
 *   searchInputRef: React.RefObject<HTMLInputElement>,
 *   suggestionsRef: React.RefObject<HTMLDivElement>,
 *   handleSearch: () => void,
 *   handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void,
 *   handleSuggestionClick: (s: { type: string, videoId: string, playlistId: string, videos: Array }) => void,
 *   handleRecentSearchClick: (search: string) => void,
 *   handleRemoveRecentSearch: (search: string) => void,
 *   handleClearSearch: () => void,
 *   setShowRecent: React.Dispatch<React.SetStateAction<boolean>>
 * }}
 */

const useSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeRecentIndex, setActiveRecentIndex] = useState(-1);
  const [showRecent, setShowRecent] = useState(false);

  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  const recentSearches =
    JSON.parse(localStorage.getItem("recentSearches")) || [];

  // Effect to close the recent searches list when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        setShowRecent(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === "") return setSuggestions([]);
      const res = await axios.get(
        `${API_BASE_URL}/api/search/suggestions?q=${query}`
      );
      setSuggestions(res.data);
      // Reset on new fetch
      setActiveIndex(-1);
    };
    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  /**
   * Handles the search action and navigates to the search results page.
   * Adds search term to recent searches and updates localStorage.
   */

  const handleSearch = () => {
    if (query.trim()) {
      // Add to recent searches in localStorage
      if (!recentSearches.includes(query.trim())) {
        recentSearches.unshift(query.trim());
        // Keep only 5 recent searches
        if (recentSearches.length > 5) recentSearches.pop();
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
      }
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSuggestions([]);
      setShowRecent(false);
    }
  };

  //  Clears the search query and hides recent searches.
  const handleClearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowRecent(false);
  };

  /**
   * Handles keyboard events for navigation between suggestions and recent searches.
   * @param {React.KeyboardEvent<HTMLInputElement>} e
   */

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && activeIndex >= 0) {
      handleSuggestionClick(suggestions[activeIndex]);
    } else if (e.key === "ArrowDown") {
      if (query.trim() === "") {
        // Move down in recent searches
        setActiveRecentIndex((prev) => (prev + 1) % recentSearches.length);
      } else {
        // Move down in suggestions
        setActiveIndex((prev) => (prev + 1) % suggestions.length);
      }
    } else if (e.key === "ArrowUp") {
      if (query.trim() === "") {
        // Move up in recent searches
        setActiveRecentIndex(
          (prev) => (prev - 1 + recentSearches.length) % recentSearches.length
        );
      } else {
        // Move up in suggestions
        setActiveIndex(
          (prev) => (prev - 1 + suggestions.length) % suggestions.length
        );
      }
    } else if (e.key === "Enter") {
      handleSearch();
    }
  };

  /**
   * Handles clicking on a suggestion to navigate to the appropriate page.
   * @param {{ type: string, videoId: string, playlistId: string, videos: Array }} s
   */

  const handleSuggestionClick = (s) => {
    if (s.type === "video") {
      navigate(`/watch/${s.videoId}`);
    } else if (s.type === "playlist" && s.videos.length > 0) {
      const firstVideoId = s.videos[0].videoId;
      if (firstVideoId) {
        navigate(`/watch/${firstVideoId}`, {
          state: { playlist: { videos: s.videos } },
        });
      }
    }
    setSuggestions([]);
    setActiveIndex(-1);
    setShowRecent(false);
  };

  /**
   * Handles clicking on a recent search to navigate to the search results.
   * @param {string} search
   */

  const handleRecentSearchClick = (search) => {
    setQuery(search);
    navigate(`/search?q=${encodeURIComponent(search)}`);
    setShowRecent(false);
  };

  /**
   * Removes a recent search from the localStorage.
   * @param {string} search
   */
  const handleRemoveRecentSearch = (search) => {
    const updatedSearches = recentSearches.filter((item) => item !== search);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    setActiveRecentIndex(-1);
  };

  return {
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
    setShowRecent,
  };
};

export default useSearch;
