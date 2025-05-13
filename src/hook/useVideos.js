import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from '../config/api.js';

/**
 * Custom hook to manage the fetching, filtering, and selection of videos.
 * 
 * @returns {Object} - The hook's return object.
 * @returns {Array} videos - List of all videos fetched from the API.
 * @returns {Array} filtered - List of videos filtered based on the selected category.
 * @returns {Array} categories - List of unique video categories.
 * @returns {string} selectedCategory - The category currently selected by the user.
 * @returns {Function} handleCategorySelect - Function to update the selected category and filter videos based on it.
 */

const useVideos = () => {
  const [videos, setVideos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  useEffect(() => {
    //  Fetch videos from the API and categorize them.
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/videos`);
        setVideos(res.data);
        setFiltered(res.data);

        const uniqueCategories = [
          ...new Set(res.data.map((video) => video.category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };

    fetchVideos();
  }, []);

    /**
   * Updates the selected category and filters the list of videos.
   * 
   * @param {string} category - The category to be selected for filtering videos.
   */
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFiltered(videos);
    } else {
      setFiltered(videos.filter((v) => v.category === category));
    }
  };

  return {
    videos,
    filtered,
    categories,
    selectedCategory,
    handleCategorySelect,
  };
};

export default useVideos;
