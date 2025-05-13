/**
 * UserDropdown Component
 * 
 * Renders a user profile dropdown menu that includes avatar, account details, 
 * and a list of navigational and action items such as viewing channels, managing channels,
 * signing out, and accessing settings. It also conditionally displays the CreateChannelModal.
 * 
 * @component
 * 
 * @param {Object} props - Props object
 * @param {boolean} props.showUserMenu - Determines whether the dropdown is visible
 * @param {Object} props.user - Authenticated user object
 * @param {Function} props.onLogout - Callback to handle logout action
 * @param {Object} props.userMenuRef - Ref object for detecting outside clicks
 * @param {Function} props.setShowUserMenu - Function to toggle dropdown visibility
 * 
 * @returns {JSX.Element|null} The rendered dropdown component or null
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateChannelModal from "../model/CreateChannelModal.jsx";
import {
  LogOut,
  UserCircle,
  Settings,
  HelpCircle,
  Sun,
  Languages,
  ShieldCheck,
  BadgeDollarSign,
  LayoutDashboard,
  Globe,
  KeySquare,
} from "lucide-react";

const UserDropdown = ({
  showUserMenu,
  user,
  onLogout,
  userMenuRef,
  setShowUserMenu,
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  /** Navigates to the user's default channel */
  const handleViewChannels = () => {
    if (user.defaultChannel) {
      navigate(`/channel/${user.defaultChannel}`);
      setShowUserMenu(false);
    } else {
      alert("No default channel set. Please create or set one.");
    }
  };

  /** Navigates to manage channels page */
  const handleManageChannels = () => {
    navigate("/manage-channels");
    setShowUserMenu(false);
  };

    /**
   * Returns the user avatar as an <img> tag if available,
   * otherwise a placeholder with the user's initial.
   * 
   * @returns {JSX.Element} Avatar element
   */
  const getAvatar = () => {
    if (
      !user?.avatar ||
      user.avatar.includes("placeholder") ||
      user.avatar.trim() === ""
    ) {
      const letter =
        user?.username?.[0]?.toUpperCase() ||
        user?.title?.[0]?.toUpperCase() ||
        "U";
      return (
        <Link to={"/profile"}>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {letter}
          </div>
        </Link>
      );
    } else {
      return (
        <Link to={"/profile"}>
        <img
          src={user.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        </Link>
      );
    }
  };

  return (
    showUserMenu && (
      <div
        ref={userMenuRef}
        className="absolute top-2 right-10 bg-white shadow-lg rounded-md w-60 sm:w-72 z-50"
      >
        {/* Fixed Header */}
        <div className="p-4 border-b border-gray-300 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3 mb-2">
            {getAvatar()}
            <div>
              <p className="font-semibold">{user?.username}</p>
              {user?.channels?.length > 0 ? (
                <>
                  {user.channels.find(
                    (c) => c.channelId === user.defaultChannel
                  ) ? (
                    <p className="text-sm text-gray-500">
                      {
                        user.channels.find(
                          (c) => c.channelId === user.defaultChannel
                        ).channelName
                      }
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Channel not found
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500 italic">No Channel</p>
              )}
            </div>
          </div>
          {user?.channels?.length > 0 ? (
            <>
              <button
                onClick={handleViewChannels}
                className="text-blue-600 text-sm font-semibold hover:underline block ml-12"
              >
                View Your Channel
              </button>
              <button
                onClick={handleManageChannels}
                className="text-blue-600 text-sm font-semibold hover:underline block ml-12"
              >
                Manage Channel
              </button>
            </>
          ) : (
            <button
              onClick={openModal}
              className="text-blue-600 text-sm font-semibold hover:underline block ml-12"
            >
              Create Channel
            </button>
          )}
        </div>

        {/* Scrollable Sections */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-sm thin-scrollbar">
          {/* Section 2 */}
          <div className="space-y-2">
            <MenuItem icon={<UserCircle />} text="Google Account" />
            <MenuItem icon={<Globe />} text="Switch Account" />
            <button
              onClick={onLogout}
              className="flex items-center font-bold w-full hover:bg-gray-100 px-2 py-1 rounded gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Section 3 */}
          <div className="border-t border-gray-300 pt-2 space-y-2">
            <MenuItem icon={<LayoutDashboard />} text="YouTube Studio" />
            <MenuItem
              icon={<BadgeDollarSign />}
              text="Purchases and Memberships"
            />
          </div>

          {/* Section 4 */}
          <div className="border-t border-gray-300 pt-2 space-y-2">
            <MenuItem icon={<ShieldCheck />} text="Your Data in YouTube" />
            <MenuItem icon={<Sun />} text="Appearance: Light" />
            <MenuItem icon={<Languages />} text="Language: English" />
            <MenuItem icon={<ShieldCheck />} text="Restricted Mode: Off" />
            <MenuItem icon={<KeySquare />} text="Keyboard Shortcuts" />
          </div>

          {/* Section 5 */}
          <div className="border-t border-gray-300 pt-2 space-y-2">
            <MenuItem icon={<Settings />} text="Settings" />
          </div>

          {/* Section 6 */}
          <div className="border-t border-gray-300 pt-2 space-y-2">
            <MenuItem icon={<HelpCircle />} text="Help" />
            <MenuItem icon={<HelpCircle />} text="Send Feedback" />
          </div>
        </div>
        <CreateChannelModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    )
  );
};


/**
 * MenuItem Component
 * 
 * Renders a simple menu row with an icon and text label.
 * Used inside UserDropdown for listing options.
 * 
 * @component
 * 
 * @param {Object} props - Props object
 * @param {JSX.Element} props.icon - Icon element (from lucide-react)
 * @param {string} props.text - Text label for the menu item
 * 
 * @returns {JSX.Element} The rendered menu item row
 */

const MenuItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer text-gray-700">
    <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
    <span>{text}</span>
  </div>
);

export default UserDropdown;
