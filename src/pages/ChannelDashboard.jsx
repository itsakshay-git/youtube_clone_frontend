import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from '../config/api.js';

function ChannelDashboard() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchChannels = async () => {
      const res = await axios.get(`${API_BASE_URL}/api/channels/all`);
      setChannels(res.data);
    };
    fetchChannels();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Channels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channels.map((ch) => (
          <div key={ch._id} className="border p-4 rounded shadow bg-white">
            <img
              src={`${API_BASE_URL}/${ch.channelBanner?.replaceAll("\\", "/")}`}
              alt="Banner"
              className="h-32 w-full object-cover rounded"
            />
            <h3 className="text-xl font-semibold mt-2">{ch.channelName}</h3>
            <p className="text-sm text-gray-600">{ch.description}</p>
            <Link
              to={`/channel/edit/${ch._id}`}
              className="text-blue-500 underline mt-2 inline-block"
            >
              Edit Channel
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChannelDashboard;