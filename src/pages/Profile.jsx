import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, CircleUser } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useSelector } from "react-redux";
import { BsCollection } from "react-icons/bs";
import useUserProfileData from "../hook/useUserProfileData.js";

/**
 *@file CarouselSection component renders a horizontally scrollable section of items with navigation buttons.
 *
 * @param {Object} props - The component props
 * @param {string} props.title - The title displayed for the carousel section.
 * @param {Array} [props.items=[]] - The items to be displayed in the carousel.
 * @param {string} props.viewAllLink - The URL to view all the items in the section.
 * @returns {JSX.Element} The rendered CarouselSection component.
 */

const CarouselSection = ({ title, items = [], viewAllLink }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Updates the state of the scroll buttons based on the current scroll position.
  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); // small buffer
    }
  };

  /**
   * Scrolls the carousel left or right by one item's width.
   * @param {string} direction - The direction to scroll ("left" or "right").
   */
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const ref = scrollRef.current;

    // Add event listener
    if (ref) {
      ref.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
    }

    // Cleanup
    return () => {
      if (ref) {
        ref.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      }
    };
  }, []);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center px-2 mb-4">
        <h2 className="text-md sm:text-xl font-semibold">{title}</h2>
        <div className="flex items-center gap-3">
          <Link
            to={viewAllLink}
            className="hover:underline text-[10px] sm:text-sm font-medium rounded-full border border-gray-400 p-1 px-1 sm:p-2 sm:px-4 hover:bg-gray-200"
          >
            View All
          </Link>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-1 sm:p-2 rounded-full border border-gray-400 ${
              canScrollLeft
                ? "hover:bg-gray-100"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-1 sm:p-2 rounded-full border border-gray-400 ${
              canScrollRight
                ? "hover:bg-gray-100"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-2 scroll-smooth"
      >
        {items.map((item, index) => (
          <Link
            to={
              item.isPlaylist
                ? `/watch/${item.videoId}`
                : `/watch/${item.videoId}`
            }
            state={item.isPlaylist ? { playlist: item } : null}
            key={item._id || `${item.videoId}-${index}`}
            className="flex-shrink-0 w-[48%] sm:w-[48%] md:w-[30%] lg:w-[22%] xl:w-[22%]"
          >
            <div className="rounded-lg overflow-hidden transition duration-200 bg-white hover:shadow-md">
              {item.thumbnailUrl ? (
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full aspect-video object-cover rounded-lg"
                />
              ) : (
                <div className="w-full aspect-video bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                  No Thumbnail
                </div>
              )}
              <div className="p-2">
                <h3 className="text-sm font-medium line-clamp-2">
                  {item.title}
                </h3>
                {item.isPlaylist ? (
                  <p className="text-xs text-gray-500">
                    {item.videoCount} videos
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    {item.channel?.name || "Unknown Channel"}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

/**
 * Profile component displays the user's profile information, including their avatar, username, and various sections such as history, liked videos, watch later, and playlists.
 *
 * @returns {JSX.Element} The rendered Profile component.
 */

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const currentUserId = user?._id;
  const { history, liked, watchLater, playlists, loading, error } =
    useUserProfileData(currentUserId);

  /**
   * Returns the initial letter of the username, or "?" if the username is not available.
   * @param {string} name - The name of the user.
   * @returns {string} The initial letter of the username or "?".
   */
  const getInitial = (name) => (name ? name[0].toUpperCase() : "?");

  {
    loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p className="text-red-500">Failed to load profile data.</p>
    ) : null;
  }

  return (
    <div className="p-4">
      {!user ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
          <h2 className="text-2xl font-semibold">Enjoy your favorite videos</h2>
          <p className="text-gray-600 text-sm">
            Sign in to access videos that you’ve liked or saved
          </p>
          <div>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 hover:bg-blue-300 bg-white text-blue-500 text-sm font-semibold border border-gray-300 px-2 py-1 pb-1.5 rounded-full mr-2"
            >
              <CircleUser size={20} /> Sign In
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between p-4 rounded-lg mb-6">
            <div className="block sm:flex items-center gap-4">
              <div>
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-20 h-20 sm:w-30 sm:h-30 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
                    {getInitial(user?.username)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl sm:text-4xl font-semibold">
                  {user?.username}
                </h2>
                <div className="block sm:flex sm:gap-2 sm:items-center my-2">
                  <span className="text-xs sm:text-sm text-gray-600 mr-2 sm:mr-0">
                    @{user?._id}
                  </span>
                  <Link
                    to={`/channel/${user?.defaultChannel}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Channel
                  </Link>
                </div>
                <div className="block sm:flex gap-1">
                  <button
                    className="flex items-center gap-2 px-4 py-2 my-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                    onClick={() => alert("Switch account (dummy action)")}
                  >
                    <BsCollection size={20} />
                    <span className="text-sm font-medium">Switch Account</span>
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 my-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                    onClick={() => alert("Switch account (dummy action)")}
                  >
                    <FcGoogle size={20} />
                    <span className="text-sm font-medium">Google Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 📽️ Carousels */}
          {history.length > 0 ? (
            <CarouselSection
              title="History"
              items={history}
              viewAllLink="/history"
            />
          ) : (
            <p>No history available</p>
          )}

          {liked.length > 0 ? (
            <CarouselSection
              title="Liked Videos"
              items={liked}
              viewAllLink="/liked"
            />
          ) : (
            <p>No liked videos</p>
          )}

          {watchLater.length > 0 ? (
            <CarouselSection
              title="Watch Later"
              items={watchLater}
              viewAllLink="/watch-later"
            />
          ) : (
            <p>No videos in Watch Later</p>
          )}

          {playlists.length > 0 ? (
            <CarouselSection
              title="Playlists"
              items={playlists.map((pl) => ({
                _id: pl._id,
                videoId: pl.videos[0]?.videoId || pl.videos[0]?._id,
                title: pl.name,
                thumbnailUrl: pl.videos[0]?.thumbnailUrl,
                videos: pl.videos,
                videoCount: pl.videos.length,
                isPlaylist: true,
              }))}
              viewAllLink="/playlist"
            />
          ) : (
            <p>No playlists available</p>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
