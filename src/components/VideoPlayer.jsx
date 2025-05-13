/**
 * VideoPlayer Component
 *
 * Displays a video player with support for local or YouTube video rendering.
 * Includes like/dislike, share, download, save to playlist, watch later, and subscribe functionality.
 * Shows channel info and full video description.
 *
 * @component
 * @param {Object} props - React props
 * @param {Object} props.video - The video object containing metadata like title, URL, upload date, etc.
 * @returns {JSX.Element} A full video player UI with interaction features.
 */

import { Link } from "react-router-dom";
import PlaylistModal from "../model/PlaylistModal.jsx";
import useVideoPlayer from "../hook/useVideoPlayer";
import { SubscribeButton } from "./SubscribeButton .jsx";
import { BsThreeDots } from "react-icons/bs";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
  AiOutlineArrowDown,
} from "react-icons/ai";
import {
  HiOutlineSave,
  HiOutlineClock,
  HiOutlineScissors,
  HiOutlineFlag,
} from "react-icons/hi";
import { Share } from "lucide-react";

function VideoPlayer({ video }) {
  const {
    isLiked,
    isDisliked,
    isSubscribed,
    isModalOpen,
    playlistName,
    userChannel,
    showAuthModal,
    userPlaylists,
    channelInfo,
    showFullDescription,
    showSaveDropdown,
    setShowSaveDropdown,
    setPlaylistName,
    setIsModalOpen,
    setShowAuthModal,
    setShowFullDescription,
    fetchUserPlaylists,
    requireAuth,
    handleLike,
    handleDislike,
    handleSubscribe,
    handleSaveToPlaylist,
    handleWatchLater,
    getVideoSrc,
    isYouTube,
    getYouTubeId,
    getTimeAgo,
    fullDescription,
    currentUserId,
    youTubeId,
    isInWatchLater,
    navigate,
  } = useVideoPlayer(video);

  /**
   * Returns an avatar div with a random background and first letter of the channel name.
   *
   * @param {string} name - Channel name
   * @returns {JSX.Element} Avatar element
   */

  const getInitialsAvatar = (name) => {
    const initial = name?.charAt(0)?.toUpperCase() || "?";
    const bgColor = "#" + (((1 << 24) * Math.random()) | 0).toString(16); // Random color
    return (
      <div
        className="w-10 h-10 md:w-8 md:h-8 sm:w-10 sm:h-10 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white font-bold"
        style={{ backgroundColor: bgColor }}
      >
        {initial}
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-6">
      <div className="w-full mb-4 rounded-lg overflow-hidden aspect-video sm:aspect-auto sm:h-[450px]">
        {isYouTube && youTubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youTubeId}?autoplay=1&mute=0`}
            title={video.title}
            className="w-full h-full rounded"
            allow="autoplay"
            allowFullScreen
          />
        ) : (
          <video
            autoPlay
            controls
            className="w-full sm:h-full object-cover rounded-lg"
            src={getVideoSrc(video.videoUrl)}
          />
        )}
      </div>
      <h2 className="text-md sm:text-2xl font-semibold">{video.title}</h2>

      <div className="block sm:flex sm:justify-between sm:items-center mb-4">
        {channelInfo && (
          <div className="flex items-center justify-between space-x-4 mt-2 sm:mt-2 md:mt-0 lg:mt-2">
            <div className="flex gap-4 justify-center items-center">
              {channelInfo?.channelImage ? (
                <img
                  src={channelInfo.channelImage}
                  alt={channelInfo.channelName}
                  className="w-10 h-10 md:w-8 md:h-8 sm:w-10 sm:h-10 lg:w-10 lg:h-10 rounded-full"
                />
              ) : (
                getInitialsAvatar(channelInfo.channelName)
              )}
              <div>
                <Link to={`/channel/${channelInfo.channelId}`}>
                  <p className="text-xs sm:text-base md:text-[8px] lg:text-base font-semibold">
                    {channelInfo.channelName}
                  </p>
                </Link>
                <p className="text-xs sm:text-base md:text-[8px] lg:text-base text-gray-500">
                  {channelInfo.subscribers} subscribers
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <SubscribeButton
                isSubscribed={isSubscribed}
                handleSubscribe={handleSubscribe}
                requireAuth={requireAuth}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center gap-2 justify-between w-full space-x-2 py-2 rounded-xl">
            <div className="flex p-1 sm:p-2 md:py-2 lg:p-2 backdrop-blur-sm bg-black/5 rounded-full h-8 sm:h-10 md:h-8 lg:h-10">
              <button
                onClick={() => requireAuth(handleLike)}
                className="cursor-pointer flex items-center gap-2 px-2 py-2 sm:px-2 sm:py-2 md:px-2 md:py-2 lg:px-2 lg:py-2 text-xs sm:text-sm md:text-[10px] lg:text-sm transition duration-300 border-r-2 border-r-gray-400"
              >
                {isLiked ? (
                  <AiFillLike className="text-black" />
                ) : (
                  <AiOutlineLike className="text-black hover:bg-white/30" />
                )}
                <span>{video.likes.length}</span>
              </button>
              <button
                onClick={() => requireAuth(handleDislike)}
                className="cursor-pointer flex items-center gap-2 px-2 py-2 sm:px-2 sm:py-2 md:px-2 md:py-2 lg:px-2 lg:py-2  text-xs sm:text-sm md:text-[10px] lg:text-sm transition duration-300"
              >
                {isDisliked ? (
                  <AiFillDislike className="text-black" />
                ) : (
                  <AiOutlineDislike className="text-black hover:bg-white/30" />
                )}
              </button>
            </div>

            <button className="cursor-pointer flex items-center gap-2 px-2 py-2 rounded-full h-8 sm:h-10 md:h-8 lg:h-10 backdrop-blur-sm bg-black/5 text-black text-xs sm:text-base md:text-[10px] lg:text-base hover:bg-white/30 transition">
              <Share size={12} />
              <span>Share</span>
            </button>

            <button className="cursor-pointer flex items-center gap-2 px-2 py-2 rounded-full h-8 sm:h-10 md:h-8 lg:h-10 backdrop-blur-sm bg-black/5 text-black text-xs sm:text-base md:text-[10px] lg:text-base hover:bg-white/30 transition">
              <AiOutlineArrowDown />
              <span>Download</span>
            </button>

            <div className="relative">
              <button
                className="cursor-pointer flex items-center justify-center px-2 py-2 rounded-full h-8 w-8 sm:h-10 md:w-8 md:h-8 sm:w-10 lg:w-10 lg:h-10 backdrop-blur-sm bg-black/5 text-black text-xs sm:text-base md:text-[10px] lg:text-base hover:bg-white/30 transition"
                onClick={() => setShowSaveDropdown((prev) => !prev)}
              >
                <BsThreeDots />
              </button>

              {/* Dropdown Menu */}
              {showSaveDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <ul className="py-2 text-sm text-gray-700">
                    <li
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        requireAuth(async () => {
                          await fetchUserPlaylists();
                          setIsModalOpen(true);
                          setShowSaveDropdown(false); // Close dropdown after action
                        });
                      }}
                    >
                      <HiOutlineSave className="text-gray-600" />
                      Save
                    </li>
                    <li
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleWatchLater}
                    >
                      <HiOutlineClock className="text-gray-600" />
                      {isInWatchLater ? "Saved" : "Watch Later"}
                    </li>
                    <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <HiOutlineScissors className="text-gray-600" />
                      Clip
                    </li>
                    <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <HiOutlineFlag className="text-gray-600" />
                      Report
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Playlist Modal */}
          {isModalOpen && (
            <PlaylistModal
              videoId={video._id}
              onClose={() => setIsModalOpen(false)}
            />
          )}

          {showAuthModal && (
            <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm">
                <h2 className="text-xl font-semibold mb-2">
                  Sign in to continue
                </h2>
                <p className="text-gray-600 mb-4">
                  You need to sign in to like, dislike, subscribe, or save
                  videos to a playlist.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      navigate("/login");
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* {discription} */}
      <div className="mt-4 backdrop-blur-sm bg-black/5 text-black rounded-2xl p-4">
        <div className="flex gap-5 items-center text-black font-medium mb-2">
          <span>{video.views?.length.toLocaleString() || 0} views</span>
          <span>{getTimeAgo(video.uploadDate)}</span>
        </div>

        {/* Description text */}
        <p className="text-sm text-black whitespace-pre-line">
          {showFullDescription
            ? fullDescription
            : `${fullDescription.slice(0, 150)}...`}
        </p>

        {fullDescription.length > 150 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="mt-2 text-sm font-medium text-blue-600 hover:underline"
          >
            {showFullDescription ? "View Less" : "View More"}
          </button>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
