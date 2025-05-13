/**
 * @file MyChannels component
 * Displays a list of channels owned by the currently authenticated user.
 * Allows navigation to a specific channel or to the create channel page.
 *
 * @component
 * @returns {JSX.Element} Rendered MyChannels page
 */


import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../config/api.js';


function MyChannels() {
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate();


  /**
   * Fetch the user's channels on component mount.
   * Sends a GET request to the API with Authorization header.
   */
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/channels/my-channels`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChannels(response.data);
      } catch (error) {
        console.error("Failed to fetch channels:", error);
      }
    };

    fetchChannels();
  }, []);


  /**
   * Navigate to a specific channel's page.
   *
   * @function
   * @param {string} channelId - The ID of the selected channel
   */
  const handleChannelClick = (channelId) => {
    navigate(`/channel/${channelId}`);
  };

  /**
   * Navigate to the create channel page.
   *
   * @function
   */
  const handleCreateChannel = () => {
    navigate("/channel/create");
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Your Channels</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleCreateChannel}
        >
          Create New Channel
        </button>
      </div>

      {channels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {channels.map((channel) => (
            <div
              key={channel._id}
              className="border rounded p-4 cursor-pointer hover:shadow-md"
              onClick={() => handleChannelClick(channel._id)}
            >
              <img
                src={channel.channelBanner}
                alt="Channel Banner"
                className="w-full h-32 object-cover rounded"
              />
              <h3 className="mt-2 text-lg font-semibold">{channel.channelName}</h3>
              <p className="text-sm text-gray-600">{channel.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>You don't have any channels yet. Create one!</p>
      )}
    </div>
  );
}

export default MyChannels;
