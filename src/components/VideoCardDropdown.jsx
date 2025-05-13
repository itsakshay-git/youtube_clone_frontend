import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

/**
 * VideoCardDropdown is a dropdown menu component with Edit and Delete options.
 * It appears on clicking the three-dot icon and closes when clicking outside.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onEdit - Callback function to handle Edit action
 * @param {Function} props.onDelete - Callback function to handle Delete action
 *
 * @returns {JSX.Element} The rendered dropdown menu
 */

function VideoCardDropdown({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

//  useEffect hook to listen for clicks outside the dropdown menu and close it.
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-600 hover:text-black"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <button
            onClick={onEdit}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            ✏️ Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoCardDropdown;
