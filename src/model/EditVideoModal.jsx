import useEditVideoForm from "../hook/useEditVideoForm.js";

/**
 * EditVideoModal component provides a modal for editing an existing video.
 * The form allows the user to modify the video's title and description.
 * The modal is controlled through `isOpen` and can be closed using `onClose`.
 * The `onSave` function is called upon successful form submission.
 *
 * @component
 * @param {Object} props - The props for the component.
 * @param {string} props.videoId - The ID of the video to be edited.
 * @param {boolean} props.isOpen - Boolean indicating whether the modal is open or not.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Function} props.onSave - Function to save the edited video details.
 * @returns {JSX.Element|null} The modal UI if `isOpen` is true, otherwise returns null.
 */

const EditVideoModal = ({ videoId, isOpen, onClose, onSave }) => {

    /**
   * Custom hook to manage the form state for editing a video.
   * It handles the form data and submission process.
   * 
   * @function useEditVideoForm
   * @param {string} videoId - The ID of the video to edit.
   * @param {boolean} isOpen - Whether the modal is open.
   * @param {Function} onSave - Function to save the video changes.
   * @param {Function} onClose - Function to close the modal.
   * @returns {Object} Form state (`formData`), change handler (`handleChange`), and submit handler (`handleSubmit`).
   */
  
    const { formData, handleChange, handleSubmit } = useEditVideoForm(
    videoId,
    isOpen,
    onSave,
    onClose
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Video</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/*=========== Video Title Input =========*/}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {/*========== Video Description Textarea ============*/}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={4}
          />

          {/*============== Submit and Cancel Buttons ============*/}
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

export default EditVideoModal;
