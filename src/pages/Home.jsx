/**
 * @file Home.jsx
 * @description Home page component that displays a grid of videos and a category chip filter.
 * Uses the custom `useVideos` hook to fetch, filter, and manage categories.
 */

import useVideos from "../hook/useVideos.js";
import VideoCard from "../components/VideoCard.jsx";
import CategoryChips from "../components/CategoryChips.jsx";
import { useSidebar } from "../context/SidebarContext.jsx";


/**
 * Home component - displays video content with category filtering options.
 *
 * @component
 * @returns {JSX.Element} Rendered Home page with categories and video cards.
 *
 * @example
 * return (
 *   <Home />
 * )
 */

function Home() {
    const {
    filtered,
    categories,
    selectedCategory,
    handleCategorySelect,
  } = useVideos();

  return (
    <>
      <CategoryChips
        categories={categories}
        selected={selectedCategory}
        onSelect={handleCategorySelect}
      />

      <div className="px-2 py-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((video) => (
          <VideoCard video={video} key={video.videoId} />
        ))}
      </div>
    </>
  );
}

export default Home;
