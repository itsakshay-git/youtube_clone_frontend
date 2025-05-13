/**
 * Watch component displays the video player, playlist, comment section, and related suggested videos.
 * It manages the playback of a video, playlist interactions, and user comments.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered component.
 */

import { MoreVertical, Repeat, Shuffle, ChevronDown, ChevronUp, XIcon } from "lucide-react";
import VideoPlayer from "../components/VideoPlayer.jsx";
import CommentSection from "../components/CommentSection.jsx";
import SuggestedVideos from "../components/SuggestedVideos.jsx";
import PlaylistModal from "../model/PlaylistModal.jsx";
import useWatchPage from "../hook/useWatchPage.js";
import moment from "moment";
import {
  MdPlaylistAdd,
  MdFileDownload,
  MdShare,
} from "react-icons/md";

function Watch() {

  const {
  video,
  playlist,
  videos,
  channelNames,
  filteredSuggestions,
  playlistVideoIds,
  showPlaylist,
  setShowPlaylist,
  openDropdownIndex,
  handleDropdownToggle,
  dropdownRefs,
  handleSaveToPlaylist,
  showPlaylistModal,
  setShowPlaylistModal,
  setVideo,
  selectedVideoId,
  handleVideoSelect,
  handleSelectFromPlaylist,
} = useWatchPage();

// Display loading message until the video is loaded
if (!video) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[50%] h-[50%] shadow-2xl rounded-3xl flex justify-center items-center text-black">
        <p>Loading...</p>
      </div>
    </div>
)};

  return (
    <div className="w-full max-w-[1350px] mx-auto px-0 md:px-4 lg:px-6">
    <div className="flex flex-col md:flex-row gap-2">
      <div className="flex-1">
        <VideoPlayer video={video} />

          <CommentSection video={video} setVideo={setVideo} />

        {/* Mobile Suggestions */}
        <div className="block md:hidden my-4">
          <SuggestedVideos
            suggestions={filteredSuggestions}
            channelNames={channelNames}
            onSelect={handleVideoSelect}
          />
        </div>
      </div>

      {/*======= Desktop Sidebar Suggestions ========*/}
      <div className="w-full md:w-[360px] flex-col gap-6 top-20 overflow-y-auto pr-1 hidden md:block scrollbar-hide">
      {playlist && (
        <div className="bg-white p-4 rounded border border-gray-400 mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Playlist: {playlist.name}</h3>
            <div className="flex gap-2">
              <button onClick={() => setShowPlaylist(!showPlaylist)}className="cursor-pointer">
                {showPlaylist ? <XIcon size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
          </div>

          {showPlaylist && (
            <>
              <div className="flex gap-5">
                  <button title="Shuffle"><Shuffle size={18} /></button>
                  <button title="Loop"><Repeat size={18} /></button>
              </div>
              <ul className="space-y-3">
                {playlist.videos?.map((v, idx) => (
                  <li
                    key={v._id}
                    className={`relative flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-gray-100 transition ${
                      v.videoId === video.videoId ? "bg-blue-100" : ""
                    }`}
                  >
                    <img
                      onClick={() => handleSelectFromPlaylist(v.videoId)}
                      src={v.thumbnailUrl || "/placeholder-thumbnail.jpg"}
                      onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder-thumbnail.jpg"; }}
                      alt={v.title}
                      className="w-20 h-12 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex flex-col w-full">
                      <p
                        onClick={() => handleSelectFromPlaylist(v.videoId)}
                        className="text-sm font-medium truncate w-44"
                      >
                        {v.title}
                      </p>
                      <p className="text-xs text-gray-500">{moment(v.createdAt).fromNow()}</p>
                    </div>
                    <div className="relative ml-auto" ref={(el) => (dropdownRefs.current[idx] = el)}>
                      <button onClick={() => handleDropdownToggle(idx)} className="cursor-pointer">
                        <MoreVertical size={18} />
                      </button>
                      {openDropdownIndex === idx && (
                        <div className="absolute right-0 mt-1 w-40 bg-white shadow rounded z-10">
                          <ul className="text-sm text-gray-700">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => handleSaveToPlaylist(v._id)}><MdPlaylistAdd /> Save to playlist</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-not-allowed flex items-center gap-2"><MdFileDownload /> Download</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-not-allowed flex items-center gap-2"><MdShare />Share</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
      {showPlaylistModal && selectedVideoId && (
        <PlaylistModal
          videoId={selectedVideoId}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
      <SuggestedVideos
        suggestions={filteredSuggestions}
        channelNames={channelNames}
        onSelect={handleVideoSelect}
      />
      </div>
    </div>
  </div>
  );
}

export default Watch;
