import { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiEdit, FiTrash2 } from "react-icons/fi";

/**
 * VideoPlaylistDropdown Component
 *
 * A dropdown menu for playlist/video cards providing edit and delete options.
 * Automatically closes when clicking outside the menu.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} [props.onEdit] - Callback function invoked when "Edit" is clicked
 * @param {Function} [props.onDelete] - Callback function invoked when "Delete" is clicked
 *
 * @returns {JSX.Element} A dropdown menu with Edit and Delete actions
 */

const VideoPlaylistDropdown = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Closes dropdown when clicking outside the menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-1 rounded-full hover:bg-gray-100"
      >
        <FiMoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-white shadow-md rounded z-50">
          <button
            onClick={() => {
              setOpen(false);
              onEdit?.();
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-sm"
          >
            <FiEdit /> Edit
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onDelete?.();
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-sm text-red-600"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlaylistDropdown;
