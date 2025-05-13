import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import { FaSortDown, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { MdDelete, MdReport } from "react-icons/md";
import API_BASE_URL from "../config/api.js";

/**
 * @file CommentSection.js
 * @description A component that handles displaying and managing the comments section for a video. Users can add, delete, and report comments.
 */

/**
 * CommentSection component that allows users to add, delete, and interact with video comments.
 * @component
 * @param {Object} props - The component's props.
 * @param {Object} props.video - The video object that contains the video information and associated comments.
 * @param {function} props.setVideo - A callback function to update the video object with new comment data after adding or deleting comments.
 * @example
 * <CommentSection video={video} setVideo={setVideo} />
 */

function CommentSection({ video, setVideo }) {
  const [comment, setComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { token, user } = useSelector((state) => state.auth);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Handles posting a new comment to the API.
   * @async
   * @function
   * @returns {void}
   */

  const handleComment = async () => {
    if (!comment.trim()) return;

    const res = await axios.post(
      `${API_BASE_URL}/api/comments/${video.videoId}/comments`,
      { text: comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setVideo((prev) => ({ ...prev, comments: res.data }));
    setComment("");
    setIsFocused(false);
  };

  /**
   * Deletes a comment from the API.
   * @async
   * @function
   * @param {string} commentId - The ID of the comment to delete.
   * @returns {void}
   */

  const deleteComment = async (commentId) => {
    const res = await axios.delete(
      `${API_BASE_URL}/api/comments/${video.videoId}/comments/${commentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setVideo((prev) => ({ ...prev, comments: res.data }));
  };

  /**
   * Generates a random avatar with initials for a user.
   * @function
   * @param {string} name - The user's name to extract initials from.
   * @returns {JSX.Element} A div element representing the user's avatar with a random background color.
   */

  const getInitialsAvatar = (name) => {
    const initial = name?.charAt(0)?.toUpperCase() || "?";
    const bgColor = "#" + (((1 << 24) * Math.random()) | 0).toString(16); // Random color
    return (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
        style={{ backgroundColor: bgColor }}
      >
        {initial}
      </div>
    );
  };

  return (
    <div className="mt-6 p-6">
      <div className="flex items-center gap-5 mb-4">
        <h3 className="font-semibold text-lg">
          {video?.comments?.length || 0} Comments
        </h3>
        <div className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer">
          <FaSortDown />
          Sort by
        </div>
      </div>

      {token && (
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-start gap-3">
            {/* <img
              src={user?.avatar || "/default-avatar.png"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            /> */}
            {user?.avatar ? (
              <img
                src={user?.avatar}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              getInitialsAvatar(user?.name)
            )}
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 border-b focus:outline-none focus:border-gray-500 py-2"
              value={comment}
              onFocus={() => setIsFocused(true)}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {(isFocused || comment) && (
            <div className="flex justify-end gap-2 mt-1 ml-12">
              <button
                className="text-sm font-medium text-black hover:text-black hover:bg-gray-200 hover:rounded-full p-2 px-4"
                onClick={() => {
                  setComment("");
                  setIsFocused(false);
                }}
              >
                Cancel
              </button>
              <button
                className={`text-sm px-4 py-1 rounded-full ${
                  comment.trim()
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!comment.trim()}
                onClick={handleComment}
              >
                Comment
              </button>
            </div>
          )}
        </div>
      )}

      {video.comments.map((c) => (
        <div key={c._id} className="flex gap-3 mb-4 mt-10">
          {c.userImage ? (
            <img
              src={c.userImage}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            getInitialsAvatar(c.userId?.username || "U")
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between relative">
              <div className="text-sm font-semibold">
                @{c.userId?.username || "unknown"}
                <span className="ml-2 text-gray-500 text-xs">
                  {moment(c.timestamp).fromNow()}
                </span>
              </div>
              <div className="relative">
                <FiMoreVertical
                  className="text-gray-500 cursor-pointer"
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === c.commentId ? null : c.commentId
                    )
                  }
                />
                {activeDropdown === c.commentId && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 top-6 bg-white rounded shadow-md z-10 w-32"
                  >
                    <button
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-sm"
                      onClick={() => {
                        alert("Reported!");
                        setActiveDropdown(null);
                      }}
                    >
                      <MdReport className="text-gray-600" /> Report
                    </button>
                    {c.userId === user?._id && (
                      <button
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-sm text-red-600"
                        onClick={() => {
                          deleteComment(c.commentId);
                          setActiveDropdown(null);
                        }}
                      >
                        <MdDelete /> Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <p className="mt-1">{c.text}</p>
            <div className="flex gap-4 mt-2 text-gray-600 text-sm items-center">
              <FaThumbsUp className="cursor-pointer" />
              <FaThumbsDown className="cursor-pointer" />
              <span className="cursor-pointer">Reply</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentSection;
