/**
 * CreateChannelModal component allows users to create a new channel.
 * It provides a form where users can upload a channel image, name, handle, and banner.
 * The form is validated and submitted via the `useCreateChannel` custom hook.
 *
 * @component
 * @param {Object} props - The props for the component.
 * @param {boolean} props.isOpen - Determines if the modal is open or not.
 * @param {Function} props.onClose - Function to close the modal.
 * @returns {JSX.Element|null} The modal UI if `isOpen` is true, otherwise returns null.
 */

import { useSelector } from "react-redux";
import useCreateChannel from "../hook/useCreateChannel.js";

const CreateChannelModal = ({ isOpen, onClose }) => {

    /**
   * Custom hook for creating a new channel.
   * Provides the state for channel name, handle, images, form validation, and form submission.
   * 
   * @function useCreateChannel
   * @param {Function} onClose - Function to close the modal after channel creation.
   * @returns {Object} An object containing channel data, validation state, and handlers.
   */
    const {
    channelName,
    setChannelName,
    handle,
    setHandle,
    channelBanner,
    setChannelBanner,
    channelImage,
    setChannelImage,
    isLoading,
    isFormValid,
    handleSubmit,
  } = useCreateChannel(onClose);

   // Accessing user data from Redux store
  const user = useSelector((state) => state.auth.user);

  // If modal is not open, return null
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
      <div className="bg-white p-3 rounded-2xl w-[90%] sm:w-full sm:max-w-2xl relative mx-auto">
        <h2 className="text-md sm:text-2xl font-semibold mb-4">How you'll appear</h2>
        <form onSubmit={handleSubmit}>
            <div className="sm:space-y-4 flex flex-col sm:px-[100px]">
              {/*=========== Channel Image Upload Section ============*/}
            <div className="flex flex-col items-center space-y-2">
                <div
                onClick={() => document.getElementById("channelImageInput").click()}
                className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
                >
                {channelImage ? (
                    <img
                    src={URL.createObjectURL(channelImage)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-500 text-sm">+</span>
                )}
                </div>
                <span
                onClick={() => document.getElementById("channelImageInput").click()}
                className="cursor-pointer text-blue-600 font-semibold hover:underline text-sm"
                >
                Select Image
                </span>
                <input
                type="file"
                id="channelImageInput"
                accept="image/*"
                onChange={(e) => setChannelImage(e.target.files[0])}
                className="hidden"
                />
            </div>

            {/*========== Channel Name Input Section ===========*/}
            <div>
                <label className="block text-sm font-medium">Channel Name</label>
                <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-300"
                />
            </div>

            {/*============ Channel Handle Input Section ==========*/}
            <div>
                <label className="block text-sm font-medium">Handle</label>
                <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                required
                placeholder="@example123"
                className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-300"
                />
            </div>

            {/*=========== Channel Banner Upload Section ===========*/}
            <div>
                <label className="block text-sm font-medium">Channel Banner</label>
                <input
                type="file"
                onChange={(e) => setChannelBanner(e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-300"
                />
            </div>
            {/*========== Terms and Google Account Info ============*/}
            <div>
                <p className="text-xs text-gray-500 pt-6">
                    You can view and change your Google Account settings anytime at
                    . Your channel name will be linked to a Brand Account which is managed by 
                    <span className="font-medium text-blue-400"> {user.email} </span>. Learn more about channels.
                    By selecting "Create", you agree to YouTube's Terms of Service.
                </p>
            </div>
          </div>

          {/*========== Submit and Cancel Buttons ==========*/}
          <div className="flex justify-end items-center gap-5 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-black hover:text-gray-500 cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-4 py-2 rounded text-sm ${
                isFormValid ? "cursor-pointer text-blue-400 font-semibold" : "text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Creating..." : "Create Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChannelModal;
