/**
 * ChannelPage Component
 *
 * Displays a YouTube-style channel interface for a specific creator/channel.
 * It features the channel's videos and playlists, handles subscriptions,
 * and allows owners to edit or delete their videos/playlists.
 */

/**
 * Custom hook useFetchChannel that fetches :
 * @property {Object} channel - The channel's metadata (name, banner, videos, etc.)
 * @property {Object} user - The logged-in user (used to compare ownership)
 * @property {Boolean} isSubscribed - Whether the current user is subscribed
 * @function handleDeleteVideo - Deletes a video
 * @function handleDeletePlaylist - Deletes a playlist
 * @function handleSubscribeToggle - Subscribes or unsubscribes from the channel
 */


import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import VideoPlaylistDropdown from "../components/VideoPlaylistDropdown.jsx";
import EditVideoModal from "../model/EditVideoModal.jsx";
import EditPlaylistModal from "../model/EditPlaylistModal.jsx";
import useFetchChannel from "../hook/useFetchChannel.js";
import { FaPlay } from "react-icons/fa";
import moment from "moment";


function ChannelPage() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("videos");
  const [showEditVideoModal, setShowEditVideoModal] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState(null);
  const [showEditPlaylistModal, setShowEditPlaylistModal] = useState(false);
  const [playlistToEdit, setPlaylistToEdit] = useState(null);

  const {
    channel,
    user,
    isSubscribed,
    handleDeleteVideo,
    handleDeletePlaylist,
    handleSubscribeToggle,
  } = useFetchChannel(channelId);

  // Show loading while channel is being fetched
  if (!channel){
      return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[50%] h-[50%] shadow-2xl rounded-3xl flex justify-center items-center text-black">
        <p>Loading...</p>
      </div>
    </div>
)};

  return (
    <div className="p-4 space-y-6 max-w-[1100px] mx-auto">

      {/* ========== Channel Banner Section ========== */}
      {channel.channelBanner && (
        <img
          src={channel.channelBanner}
          alt="Banner"
          className="w-full h-36 sm:h-48 object-cover rounded-2xl"
        />
      )}

      {/* ========== Channel Profile Info Section ========== */}
      <div className="block sm:flex gap-10">
        <div>
          {channel.channelImage && (
            <img
              src={channel.channelImage}
              alt="Channel"
              className="w-20 h-20 sm:w-40 sm:h-40 rounded-full object-cover"
            />
          )}
        </div>

        {/* Channel Info */}
        <div className="pl-2 sm:pl-0">
          <div>
            <h2 className="text-md sm:text-3xl font-bold">
              {channel.channelName}
            </h2>
            <p className="text-sm sm:text-md text-gray-600">{channel.handle}</p>
            <p className="text-sm text-gray-500 mt-1">
              {channel.subscribers} subscribers
            </p>
          </div>
          {user?._id == channel.owner ? (
            <div className="flex gap-3 mt-5">
              <Link to={`/channel/edit/${channel.channelId}`}>
                <button className="bg-gray-200 text-black text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow hover:bg-gray-300 mb-2">
                  Customize Channel
                </button>
              </Link>
              <button
                to={`/channel/edit/${channel.channelId}`}
                className="bg-gray-200 text-black text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow hover:bg-gray-300 cursor-not-allowed mb-2"
              >
                Manage Videos
              </button>
            </div>
          ) : (
            <button
              onClick={handleSubscribeToggle}
              className={`px-4 py-2 mt-3 rounded-full font-semibold cursor-pointer ${
                isSubscribed ? "bg-gray-300 text-black" : "bg-black text-white"
              }`}
            >
              {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          )}
        </div>
      </div>

      {/* ========== Tabs for Videos and Playlists ========== */}
      <div className="mt-6 border-b border-gray-300">
        <button
          onClick={() => setActiveTab("videos")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "videos"
              ? "border-b-2 border-black text-black"
              : "text-gray-500"
          }`}
        >
          Videos
        </button>
        <button
          onClick={() => setActiveTab("playlists")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "playlists"
              ? "border-b-2 border-black text-black"
              : "text-gray-500"
          }`}
        >
          Playlists
        </button>
      </div>

      {/* ========== Videos Tab ========== */}
      {activeTab === "videos" && (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4">Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {channel.videos.map((video) => (
              <div
                key={video._id}
                className="bg-white rounded transition relative"
              >
                <Link to={`/watch/${video.videoId}`}>
                  <img
                    src={video.thumbnailUrl || "/placeholder-thumbnail.png"}
                    className="w-full h-35 object-cover rounded-lg"
                    alt={video.title}
                  />
                </Link>
                <div className="absolute bottom-2 right-2">
                  {user?._id === video.uploader && (
                    <VideoPlaylistDropdown
                      onEdit={() => {
                        setVideoToEdit(video);
                        setShowEditVideoModal(true);
                      }}
                      onDelete={() => handleDeleteVideo(video.videoId)}
                    />
                  )}
                </div>
                <Link key={video.videoId} to={`/watch/${video.videoId}`}>
                  <h3 className="font-semibold text-xs sm:text-sm mt-2 w-[80%]">
                    {video.title}
                  </h3>
                  <p className="text-gray-500 text-xs">
                    {video.views.length} views ·{" "}
                    {moment(video.uploadDate).fromNow()}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== Playlists Tab ========== */}
      {activeTab === "playlists" && (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4">Playlists</h3>
          {!user || user.playlists?.length === 0 ? (
            <p>No playlists available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {user.playlists.map((playlist) => {
                const firstVideo = playlist.videos?.[0];

                return (
                  <div
                    key={playlist._id}
                    className="bg-white p-1 rounded cursor-pointer group relative"
                  >
                    <Link
                      to={firstVideo ? `/watch/${firstVideo.videoId}` : "#"}
                      state={{ playlist }}
                    >
                      <div className="relative w-full h-35 rounded-lg overflow-hidden">
                        {firstVideo?.thumbnailUrl ? (
                          <img
                            src={firstVideo.thumbnailUrl}
                            alt={firstVideo.title}
                            className="w-full h-35 object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                            No Thumbnail
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity">
                          <FaPlay className="text-white mr-2" />
                          <span className="text-white font-medium">
                            Play All
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="flex justify-between items-center mt-2">
                      <Link
                        to={firstVideo ? `/watch/${firstVideo.videoId}` : "#"}
                        state={{ playlist }}
                      >
                        <h4 className="font-semibold">{playlist.name}</h4>
                      </Link>
                      {user?._id === playlist.userId && (
                        <VideoPlaylistDropdown
                          onEdit={() => {
                            setPlaylistToEdit(playlist);
                            setShowEditPlaylistModal(true);
                          }}
                          onDelete={() => handleDeletePlaylist(playlist._id)}
                        />
                      )}
                    </div>
                    <Link
                      to={firstVideo ? `/watch/${firstVideo.videoId}` : "#"}
                      state={{ playlist }}
                    >
                      <p className="text-sm text-gray-600">
                        View full playlist
                      </p>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========== Edit Video Modal ========== */}
      {showEditVideoModal && videoToEdit && (
        <EditVideoModal
          videoId={videoToEdit._id}
          isOpen={showEditVideoModal}
          onClose={() => {
            setShowEditVideoModal(false);
            setVideoToEdit(null);
          }}
          onSave={() => {
            navigate(`/channel/${channelId}`);
            window.location.reload();
          }}
        />
      )}

      {/* ========== Edit Playlist Modal ========== */}
      {showEditPlaylistModal && (
        <EditPlaylistModal
          playlistId={playlistToEdit._id}
          isOpen={showEditPlaylistModal}
          onClose={() => {
            setShowEditPlaylistModal(false);
            setSelectedPlaylist(null);
          }}
          onSave={() => {
            navigate(`/channel/${channelId}`);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

export default ChannelPage;
