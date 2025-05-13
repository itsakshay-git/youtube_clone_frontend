import { useState, useRef, useEffect } from "react";
import { AiFillBell, AiOutlineDown  } from "react-icons/ai";


/**
 * A button component that handles subscribing/unsubscribing to a channel.
 * When subscribed, it shows a dropdown menu with options to manage subscription preferences.
 *
 * @param {Object} props - The props for the component.
 * @param {boolean} props.isSubscribed - Boolean indicating if the user is currently subscribed.
 * @param {Function} props.handleSubscribe - Function to handle subscribing/unsubscribing when clicked.
 * 
 * @returns {JSX.Element} The SubscribeButton component.
 */

export const SubscribeButton = ({ isSubscribed, handleSubscribe, requireAuth }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  // Effect hook that closes the dropdown menu when clicking outside of it.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener when the component is unmounted
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
    <button
      onClick={() => {
        if (isSubscribed) {
          toggleDropdown();
        } else {
          requireAuth(handleSubscribe);
        }
      }}
      className={`flex items-center gap-2 px-2 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm md:text-[10px] lg:text-sm font-medium cursor-pointer ${
        isSubscribed
          ? "backdrop-blur-sm bg-black/5 text-black border border-gray-300"
          : "bg-black text-white"
      }`}
    >
     <AiFillBell /> {isSubscribed ? "Subscribed" : "Subscribe"} <AiOutlineDown  />
    </button>

      {showDropdown && isSubscribed && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg border border-gray-200 bg-white z-10">
          <div className="py-1 text-sm text-gray-700">
            <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">All</button>
            <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">Personalized</button>
            <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">None</button>
            <button
              onClick={() => {
                setShowDropdown(false);
                handleSubscribe();
              }}
              className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
            >
              Unsubscribe
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
