import useEditPlaylistForm from "../hook/useEditPlaylistForm.js";

/**
 * EditPlaylistModal component provides a modal for editing an existing playlist.
 * The form allows the user to modify the playlist name and privacy status.
 * The modal is controlled through `isOpen` and can be closed using `onClose`.
 * The `onSave` function is called upon successful form submission.
 *
 * @component
 * @param {Object} props - The props for the component.
 * @param {string} props.playlistId - The ID of the playlist to be edited.
 * @param {boolean} props.isOpen - Boolean indicating whether the modal is open or not.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Function} props.onSave - Function to save the edited playlist details.
 * @returns {JSX.Element|null} The modal UI if `isOpen` is true, otherwise returns null.
 */

const EditPlaylistModal = ({ playlistId, isOpen, onClose, onSave }) => {

    /**
   * Custom hook to manage the form state for editing a playlist.
   * It handles the form data and submission process.
   * 
   * @function useEditPlaylistForm
   * @param {string} playlistId - The ID of the playlist to edit.
   * @param {boolean} isOpen - Whether the modal is open.
   * @param {Function} onSave - Function to save the playlist changes.
   * @param {Function} onClose - Function to close the modal.
   * @returns {Object} Form state (`formData`), change handler (`handleChange`), and submit handler (`handleSubmit`).
   */
  
  const { formData, handleChange, handleSubmit } = useEditPlaylistForm(
    playlistId,
    isOpen,
    onSave,
    onClose
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Playlist</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Playlist Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
              className="accent-blue-500"
            />
            <span>Private</span>
          </label>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlaylistModal;
