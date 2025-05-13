/**
 * @file EditChannel Component
 * 
 * @component
 * @description
 * This component provides a full-featured interface for editing an existing YouTube-like channel's details.
 * It allows the user to update the channel banner, profile picture, name, and description.
 * Users can also set the channel as default or delete it entirely.
 * 
 * @returns {JSX.Element} The UI form for editing the channel.
 * 
 * @hooks
 * - useParams: To extract `id` of the channel from the route.
 * - useSelector: To get the current logged-in user from the Redux state.
 * - useChannelEdit: Custom hook handling the logic for fetching channel data, updating form fields, and performing actions like delete and set default.
 * 
 */

/**
* useChannelEdit hook
* 
* @description
* Custom hook to manage the editing logic of a YouTube-like channel. It handles:
* - Fetching initial channel data
* - Managing form fields (name, description, images)
* - Handling async operations: submit, delete, make default
* 
* @param {string} id - The ID of the channel to edit
* @param {Object} user - The current authenticated user from Redux
* 
* @returns {Object} - All necessary state and handlers used in the EditChannel component:
*  - channel: Channel data fetched from API
*  - name, setName: Channel name state
*  - description, setDescription: Channel description state
*  - banner, setBanner: Banner image file
*  - channelImage, setChannelImage: Profile image file
*  - loading: Boolean indicating whether submit/make default is in progress
*  - deleting: Boolean indicating whether delete action is in progress
*  - handleSubmit: Function to publish the updated channel info
*  - handleMakeDefault: Function to set current channel as user's default
*  - handleDelete: Function to delete the channel
*/


import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useChannelEdit from "../hook/useChannelEdit";


function EditChannel() {
  // Extracts the `id` from the URL parameters (channel ID)
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);

  const {
    channel,
    name,
    setName,
    description,
    setDescription,
    banner,
    setBanner,
    channelImage,
    setChannelImage,
    loading,
    deleting,
    handleSubmit,
    handleMakeDefault,
    handleDelete,
  } = useChannelEdit(id, user);
  
  

  if (!channel){
      return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[50%] h-[50%] shadow-2xl rounded-3xl flex justify-center items-center text-black">
        <p>Loading...</p>
      </div>
    </div>
)};

  return (
  <div className="p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Customize Channel</h2>
    </div>

    <div className="flex justify-between border-b mb-4">
      <div>
        <button className="py-3 px-4 border-b-2 border-blue-600 text-blue-600 font-medium">Profile</button>
        <button className="py-3 px-4 text-gray-500">Home</button>
      </div>
      <div className="hidden sm:flex sm:gap-5 mb-2">
        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleMakeDefault}
            disabled={user.defaultChannel === id || loading}
            className={`${
              user.defaultChannel === id
                ? "bg-gray-200"
                : "bg-black text-white"
            } text-black px-4 py-2 rounded-full text-sm cursor-pointer`}
          >
            {user.defaultChannel === id ? "Default Channel" : loading ? "Setting..." : "Make Default"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-500 bg-gray-200 px-4 py-2 rounded-full flex items-center justify-center text-sm cursor-pointer"
          >
            {deleting ? (
              <div className="w-5 h-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Delete Channel"
            )}
          </button>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="bg-gray-300 text-black px-4 py-2 rounded-full cursor-pointer hover:bg-gray-400 text-sm">{loading ? "Publishing..." : "Publish"}</button>
      </div>
    </div>

    <div className="space-y-8 w-full sm:w-[60%]">
      {/* ========== Banner ========== */}
      <div>
        <h3 className="text-lg font-semibold mb-1">Banner image</h3>
        <p className="text-sm text-gray-600 mb-2">
          This image will appear across the top of your channel. For the best results on all devices,
          use an image that’s at least 2048 x 1152 pixels and 6MB or less.
        </p>
        <div className="block sm:flex sm:gap-5">
          <div>
            {/* <img src={channel.channelBanner} alt="Current Banner" className="w-full max-h-64 object-cover rounded mb-2" /> */}
            {banner ? (
              <img src={URL.createObjectURL(banner)} alt="Banner Preview" className="w-full max-h-64 object-cover rounded mb-2" />
            ) : channel.channelBanner && (
              <img src={channel.channelBanner} alt="Current Banner" className="w-full max-h-64 object-cover rounded mb-2" />
            )}
          </div>
        <div className="flex gap-2 justify-center items-center">
          <label className="bg-gray-200 px-4 py-2 rounded-full font-semibold cursor-pointer">
            Change
            <input type="file" accept="image/*" onChange={(e) => setBanner(e.target.files[0])} hidden />
          </label>
          <button type="button" className="bg-gray-200 px-4 py-2 rounded-full">Remove</button>
        </div>
      </div>
        </div>

      {/*========== Profile Picture ========== */}
      <div>
        <h3 className="text-lg font-semibold mb-1">Picture</h3>
        <p className="text-sm text-gray-600 mb-2">
          Your profile picture will appear where your channel is presented on YouTube,
          like next to your videos and comments. It’s recommended to use a picture that’s at least
          98 x 98 pixels and 4MB or less. Use a PNG or GIF (no animations) file.
        </p>
        <div className="flex items-center gap-4 mb-2">
          {channelImage ? (
            <img src={URL.createObjectURL(channelImage)} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
          ) : channel.channelImage ? (
            <img src={channel.channelImage} alt="Current" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 bg-gray-300 rounded-full" />
          )}
          <label className="bg-gray-200 px-4 py-1 rounded cursor-pointer">
            Upload
            <input type="file" accept="image/*" onChange={(e) => setChannelImage(e.target.files[0])} hidden />
          </label>
        </div>
      </div>

      {/*========== Name ========== */}
      <div>
        <h3 className="text-lg font-semibold mb-1">Name</h3>
        <p className="text-sm text-gray-600 mb-2">
          Choose a channel name that represents you and your content. Changes made to your name
          and picture are visible only on YouTube and not other Google services. You can change
          your name twice in 14 days.
        </p>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Channel Name"
          required
        />
      </div>

      {/*========== Description + Reset ========== */}
      <div>
        <h3 className="text-lg font-semibold mb-1">Description</h3>
        <textarea
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Channel Description"
          rows={4}
        />
        <button
          type="button"
          onClick={() => {
            setName(channel.channelName);
            setDescription(channel.description);
          }}
          className="mt-2 text-sm text-gray-500 underline"
        >
          Reset to channel default
        </button>
      </div>
      <div className="flex sm:hidden gap-5 mb-2">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleMakeDefault}
            disabled={user.defaultChannel === id || loading}
            className={`${
              user.defaultChannel === id
                ? "bg-gray-200"
                : "bg-black text-white"
            } text-black px-4 py-2 rounded-full flex items-center justify-center text-xs cursor-pointer h-9`}
          >
            {user.defaultChannel === id ? "Default Channel" : loading ? "Setting..." : "Make Default"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="hover:bg-red-500 hover:text-white bg-gray-200 px-4 py-2 h-9 rounded-full flex items-center justify-center text-xs cursor-pointer"
          >
            {deleting ? (
              <div className="w-5 h-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Delete Channel"
            )}
          </button>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="bg-gray-300 text-black px-4 py-2 h-9 rounded-full cursor-pointer text-xs hover:bg-blue-500 hover:text-white">{loading ? "Publishing..." : "Publish"}</button>
      </div>
    </div>
  </div>
  );
}

export default EditChannel;
