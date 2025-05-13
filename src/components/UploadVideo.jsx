import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import {
  ArrowUpFromLine,
  ChartColumnStacked,
  File,
  FileCog,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useFetchCurrentUser from "../hook/useFetchCurrentUser";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api.js";

/**
 * UploadVideo component for handling the video upload process.
 * It allows users to select a video, provide details (title, description, thumbnail),
 * and choose the channel for the video upload.
 *
 * @component
 * @example
 * return <UploadVideo onClose={handleClose} />;
 *
 * @param {Function} onClose - Function to close the modal.
 *
 * @returns {JSX.Element} The UploadVideo component.
 */

const UploadVideo = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [channelId, setChannelId] = useState("");
  const [channels, setChannels] = useState([]);
  const token = localStorage.getItem("token");
  const fetchCurrentUser = useFetchCurrentUser();
  const navigate = useNavigate();

  /**
   * Fetches the list of channels for the current user.
   * This hook runs on component mount (when the token is available).
   */
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/channels/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChannels(res.data);
        if (res.data.length > 0) setChannelId(res.data[0].channelId);
      } catch (err) {
        console.error("Error fetching channels:", err);
      }
    };
    fetchChannels();
  }, [token]);

  /**
   * Handles video upload when the user submits the form.
   * Sends the video data to the server and navigates the user to their channel page.
   *
   * @param {React.FormEvent} e - The form submission event.
   *
   * @returns {void}
   */

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("channelId", channelId);
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/videos/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res) {
        toast.success("Video uploaded successfully!");
        await fetchCurrentUser();
        navigate(`/channel/${channelId}`);
        window.location.reload()
      }
      onClose();
    } catch (err) {
      console.error("Video upload failed:", err);
      toast.error("Video upload failed.");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      {!videoFile ? (
        <div className="bg-white p-6 rounded-2xl w-[92%] sm:w-full max-w-2xl mx-auto text-center relative shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold mb-4">Upload Videos</h2>
            <button onClick={onClose} className="text-2xl text-gray-600 mb-4">
              <AiOutlineClose />
            </button>
          </div>

          <div className="p-8 rounded-lg flex flex-col justify-center items-center">
            <div className="text-5xl mb-4 text-gray-400 flex justify-center items-center rounded-full bg-gray-200 p-5 w-20 h-20">
              {" "}
              <ArrowUpFromLine size={20} />{" "}
            </div>
            <p className="text-lg mb-2">Drag and drop video files to upload</p>
            <p className="text-sm text-gray-500 mb-4">
              Your videos will be private until you publish them.
            </p>
            <label className="cursor-pointer inline-block bg-black text-white px-4 py-2 rounded-full">
              Select File
              <input
                type="file"
                accept="video/*"
                hidden
                onChange={(e) => setVideoFile(e.target.files[0])}
              />
            </label>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            By submitting your videos to YouTube, you acknowledge that you agree
            to YouTube's
            <a href="#" className="text-blue-500">
              {" "}
              Terms of Service
            </a>{" "}
            and
            <a href="#" className="text-blue-500">
              {" "}
              Community Guidelines
            </a>
            .<br />
            Please be sure not to violate others' copyright or privacy rights.
            <a href="#" className="text-blue-500">
              {" "}
              Learn more
            </a>
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleUpload}
          className="bg-white p-6 rounded-lg w-full max-w-5xl mx-auto flex gap-6 relative shadow-lg"
        >
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 text-2xl text-gray-600"
          >
            <AiOutlineClose />
          </button>

          {/*=========== Left Side: Form ============*/}
          <div className="w-2/3 space-y-4">
            <h2 className="text-xl font-bold">Video Details</h2>

            <div>
              <label className="block text-sm mb-1">Title</label>
              <input
                className="w-full p-2 bg-gray-100 rounded"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea
                className="w-full p-2 bg-gray-100 rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Thumbnail Options</label>
              <div className="flex gap-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setThumbnailFile(e.target.files[0])}
                  />
                  <div className="bg-gray-200 p-4 rounded text-center flex gap-2 items-center">
                    <File size={18} /> Upload
                  </div>
                </label>
                <div className="bg-gray-200 p-4 rounded text-center cursor-not-allowed flex gap-2 items-center">
                  <FileCog size={18} /> Auto
                </div>
                <div className="bg-gray-200 p-4 rounded text-center cursor-not-allowed flex gap-2 items-center">
                  <ChartColumnStacked size={18} /> Compare
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Channel</label>
              <select
                className="w-full p-2 bg-gray-100 rounded"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
              >
                {channels.map((channel) => (
                  <option key={channel.channelId} value={channel.channelId}>
                    {channel.channelName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                className=""
                onClick={() => setVideoFile(null)}
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>

          {/*============ Right Side: Preview =============*/}
          <div className="w-1/3 border border-gray-200 rounded p-2 mt-20">
            <h3 className="text-sm font-semibold mb-2">Preview</h3>
            <video
              controls
              className="w-full h-auto rounded mb-2"
              src={URL.createObjectURL(videoFile)}
            ></video>
            <p className="text-sm font-semibold">{title || "Video Title"}</p>
            <p className="text-xs text-gray-500">
              {description || "Video Description"}
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default UploadVideo;
