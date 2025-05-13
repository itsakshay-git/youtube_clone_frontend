import { AiOutlineClose } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import usePlaylistManager from "../hook/usePlaylistManager.js";

/**
 * PlaylistModal component renders a modal for managing playlists.
 * Users can save a video to existing playlists, add it to Watch Later,
 * or create a new playlist with an optional private setting.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Function} props.onClose - Callback to close the modal.
 * @param {string} props.videoId - The ID of the video to save to a playlist.
 * @returns {JSX.Element} The rendered modal for playlist management.
 */

const PlaylistModal = ({ onClose, videoId }) => {

    /**
   * Custom hook for playlist management logic.
   *
   * @function usePlaylistManager
   * @param {Function} onClose - Function to close the modal.
   * @param {string} videoId - ID of the video to manage.
   * @returns {Object} Contains playlist state and handlers for interaction.
   */

  const {
    playlists,
    selectedPlaylistIds,
    watchLaterChecked,
    setWatchLaterChecked,
    isPrivate,
    setIsPrivate,
    newPlaylistName,
    setNewPlaylistName,
    handleCheckboxChange,
    setToggleNewPlaylist,
    toggleNewPlaylist,
    userId,
    handleSave,
} = usePlaylistManager(onClose, videoId);

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] sm:w-full max-w-md">
        {/*====== Header =========*/}
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">Save video to Playlist</h2>
          <button onClick={onClose} className="text-white px-4 py-2 rounded">
            <AiOutlineClose className="text-gray-500 hover:text-red-500" />
          </button>
        </div>

        {/*========= Watch Later Option =========*/}
        <div className="mb-4">

          <div className="mb-4">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="watchLater"
                checked={watchLaterChecked}
                onChange={(e) => setWatchLaterChecked(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="watchLater">Save to Watch Later</label>
            </div>
          </div>

          {/*============== Existing Playlists ==============*/}
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <div key={playlist._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={playlist._id}
                  checked={selectedPlaylistIds.includes(playlist._id)}
                  onChange={() => handleCheckboxChange(playlist._id)}
                  className="mr-2"
                />
                <label htmlFor={playlist._id}>{playlist.name}</label>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No playlists found.</p>
          )}
        </div>
        {/*============== New Playlist Toggle ==============*/}
        <div className="flex justify-center items-center mb-2">
          <button onClick={() => setToggleNewPlaylist((prev) => !prev)} className="flex gap-2 items-center justify-center bg-gray-200 px-4 py-2 rounded-full cursor-pointer">
             {toggleNewPlaylist ? "Cancel" : (
              <>
              <GoPlus /> New Playlist
              </>
              ) }
          </button>
        </div>
          {/*============ New Playlist Form ============*/}
          {toggleNewPlaylist && (
          <div className="pt-4 mt-4">
            <h3 className="text-md font-semibold mb-2"> Create New Playlist:</h3>
            <input
              type="text"
              placeholder="New Playlist Name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                id="private"
                className="mr-2"
              />
              <label htmlFor="private" className="text-sm text-gray-700">Make it Private</label>
            </div>
          </div>
          )}
        {/*========== Save Button ==============*/}
        <div className="flex justify-end space-x-4">
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-full">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistModal;
