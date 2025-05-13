/**
 * @file ManageChannels
 * Component for managing user channels.
 * Renders a list of user's channels with the option to create a new one.
 *
 * @component
 * @returns {JSX.Element} The rendered ManageChannels component.
 */


import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Check, Plus } from 'lucide-react';
import CreateChannelModal from "../model/CreateChannelModal";


function ManageChannels() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

    /**
   * Opens the CreateChannel modal
   * @function
   */
  const openModal = () => setIsModalOpen(true);

    /**
   * Closes the CreateChannel modal
   * @function
   */
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-6 max-w-[1000px] mx-auto">
      <h2 className="text-2xl mb-4">Your Channels</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Channel Card */}
        <div
          onClick={openModal}
          className="cursor-pointer flex items-center justify-center gap-3 p-2 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition h-10 mt-5"
        >
          <Plus className="w-4 h-4 text-blue-500" />
          <span className="text-blue-600 font-semibold">Create New Channel</span>
        </div>

        {/* Existing Channels */}
        {user.channels && user.channels.map((channel) => (
          <Link
            to={`/channel/${channel.channelId}`}
            key={channel._id}
            className="flex p-2 rounded shadow hover:shadow-lg"
          >
            {user.defaultChannel === channel.channelId && (
              <span className="text-green-600 font-semibold flex justify-center items-center px-5">
                <Check />
              </span>
            )}
            <div className="flex gap-5 items-center">
              <img
                src={channel.channelImage}
                alt="banner"
                className="w-10 h-10 object-cover rounded-full cursor-pointer"
                onClick={() => navigate(`/channel/${channel.channelId}`)}
              />
              <div>
                <h3 className="text-lg font-semibold">{channel.channelName}</h3>
                <p className="text-gray-500 text-xs">{channel.description}</p>
                <p className="text-gray-500 text-xs">{channel.subscribers} subscribers</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <CreateChannelModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default ManageChannels;
