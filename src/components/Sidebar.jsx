import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  VideoIcon,
  BellIcon,
  ClockIcon,
  ThumbsUpIcon,
  MenuIcon,
  ChevronRightIcon,
  FlameIcon,
  ShoppingBagIcon,
  Music2Icon,
  FilmIcon,
  WifiIcon,
  Gamepad2Icon,
  NewspaperIcon,
  DumbbellIcon,
  BookOpenIcon,
  BrushIcon,
  Mic2Icon,
  StarIcon,
  SettingsIcon,
  FlagIcon,
  HelpCircleIcon,
  MessageCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  List,
  User,
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import axios from "axios";
import API_BASE_URL from "../config/api.js";

/**
 * Sidebar component renders the main sidebar with navigation links and user subscription info.
 * It adjusts its layout based on whether the sidebar is collapsed or not.
 *
 * @param {object} props - The properties passed to the component.
 * @param {boolean} props.overlay - Boolean that determines if the sidebar is overlaying the content.
 *
 * @returns {JSX.Element} The rendered Sidebar component.
 */

function Sidebar({ overlay }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toggleSidebar, sidebarCollapsed, toggleCollapse } = useSidebar();

  const location = useLocation();
  const isHome =
    location.pathname === "/" ||
    location.pathname.startsWith("/channel") ||
    location.pathname.startsWith("/search") ||
    location.pathname.startsWith("/history") ||
    location.pathname.startsWith("/liked") ||
    location.pathname.startsWith("/watch-later") ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/playlist") ||
    location.pathname.startsWith("/manage");

  const isCollapsed = !overlay && sidebarCollapsed;

  const sidebarClasses = overlay
    ? "fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50"
    : `fixed top-[4rem] left-0 h-[calc(100vh-4rem)] transition-all duration-300 z-30 ${
        isCollapsed ? "hidden sm:block sm:w-20" : "w-64"
      } bg-white`;

      
    useEffect(() => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      if (token) {
        const fetchSubscriptions = async () => {
          try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(
              `${API_BASE_URL}/api/channels/subscriptions/me`,
              config
            );
            setSubscriptions(res.data);
          } catch (err) {
            console.error("Error fetching subscriptions", err);
          }
        };

        fetchSubscriptions();
      }
    }, []);


  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // sets to true if token exists
  }, []);

  return (
    <div className={sidebarClasses}>
      {/* Header */}
      {(!isHome || overlay) && (
        <div className="p-3 flex items-center justify-between">
          <button onClick={overlay ? toggleSidebar : toggleCollapse}>
            <MenuIcon size={24} />
          </button>
        </div>
      )}

      {/*========= Scrollable Content ============*/}
      <div className="overflow-y-auto h-[calc(100%-2.5rem)] px-3 pb-4">
        <SidebarLink
          to="/"
          icon={<HomeIcon size={20} />}
          label="Home"
          collapsed={isCollapsed}
        />
        <SidebarLink
          to="#"
          icon={<VideoIcon size={20} />}
          label="Shorts"
          collapsed={isCollapsed}
        />
        <SidebarLink
          to="#"
          icon={<BellIcon size={20} />}
          label="Subscriptions"
          collapsed={isCollapsed}
        />
        {!isCollapsed && <hr className="my-2" />}
        <SidebarLink
          to="/profile"
          icon={<User size={20} />}
          label="You"
          collapsed={isCollapsed}
        />

        {!isCollapsed && (
          <>
            {isLoggedIn && !isCollapsed && (
              <>
                <SidebarLink
                  to="/history"
                  icon={<ClockIcon size={20} />}
                  label="History"
                  collapsed={isCollapsed}
                />
                <SidebarLink
                  to="/playlist"
                  icon={<List size={20} />}
                  label="Playlist"
                  collapsed={isCollapsed}
                />
                <SidebarLink
                  to="/liked"
                  icon={<ThumbsUpIcon size={20} />}
                  label="Liked Videos"
                  collapsed={isCollapsed}
                />
                <SidebarLink
                  to="/watch-later"
                  icon={<ClockIcon size={20} />}
                  label="Watch Later"
                  collapsed={isCollapsed}
                />
              </>
            )}
          </>
        )}

        {/*============= Explore Section ===========*/}
        {!isCollapsed && (
          <>
            <hr className="my-2" />
            <h3 className="text-sm font-semibold px-2 mb-1">Explore</h3>
            <SidebarLink
              to="#"
              icon={<FlameIcon size={20} />}
              label="Trending"
              collapsed={isCollapsed}
            />
            <SidebarLink
              to="#"
              icon={<ShoppingBagIcon size={20} />}
              label="Shopping"
              collapsed={isCollapsed}
            />
            <SidebarLink
              to="#"
              icon={<Music2Icon size={20} />}
              label="Music"
              collapsed={isCollapsed}
            />
            <SidebarLink
              to="#"
              icon={<FilmIcon size={20} />}
              label="Movies"
              collapsed={isCollapsed}
            />
            <SidebarLink
              to="#"
              icon={<WifiIcon size={20} />}
              label="Live"
              collapsed={isCollapsed}
            />
            <SidebarLink
              to="#"
              icon={<Gamepad2Icon size={20} />}
              label="Gaming"
              collapsed={isCollapsed}
            />
            <SidebarLink
              to="#"
              icon={<NewspaperIcon size={20} />}
              label="News"
              collapsed={isCollapsed}
            />
            <SidebarLink
              to="#"
              icon={<DumbbellIcon size={20} />}
              label="Sports"
              collapsed={isCollapsed}
            />
            <SidebarLink
              to="#"
              icon={<BookOpenIcon size={20} />}
              label="Courses"
              collapsed={isCollapsed}
            />
            <SidebarLink
              to="#"
              icon={<BrushIcon size={20} />}
              label="Fashion & Beauty"
              collapsed={isCollapsed}
            />
            <SidebarLink
              to="#"
              icon={<Mic2Icon size={20} />}
              label="Podcasts"
              collapsed={isCollapsed}
            />
          </>
        )}

        {/*============= Subscriptions ==============*/}
        {!isCollapsed && subscriptions.length > 0 && (
          <>
            <hr className="my-2" />
            <h3 className="text-sm font-semibold px-2 mb-1">Subscriptions</h3>
            {(showAll
              ? subscriptions[0]?.subscribersList
              : subscriptions[0]?.subscribersList?.slice(0, 6)
            )?.map((sub) => (
              <div
                key={sub._id}
                className="flex items-center gap-3 px-2 py-1 hover:bg-gray-100 rounded"
              >
                {sub.avatar ? (
                  <img
                    src={sub.avatar}
                    alt={sub.username}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-sm text-white">
                    {sub.username[0].toUpperCase()}
                  </div>
                )}
                <span className="text-sm truncate">{sub.username}</span>
              </div>
            ))}
            {subscriptions[0]?.subscribersList?.length > 6 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm px-3 mt-1 flex items-center gap-4 hover:bg-gray-100 w-full p-2 rounded-lg font-semibold"
              >
                {showAll ? (
                  <ChevronUpIcon size={16} />
                ) : (
                  <ChevronDownIcon size={16} />
                )}
                {showAll ? "Show Less" : "Show More"}
              </button>
            )}
          </>
        )}

        {/*============= More from YouTube =============*/}
        {!isCollapsed && (
          <>
            <hr className="my-2" />
            <h3 className="text-sm font-semibold px-2 mb-1">
              More from YouTube
            </h3>
            <SidebarLink
              to="#"
              icon={
                <img src="/youtube.png" alt="Premium" className="w-5 h-5" />
              }
              label="YouTube Premium"
              collapsed={isCollapsed}
            />
            <SidebarLink
              to="#"
              icon={<img src="/youtube.png" alt="Studio" className="w-5 h-5" />}
              label="YouTube Studio"
              collapsed={isCollapsed}
            />
            <SidebarLink
              to="#"
              icon={<img src="/music.png" alt="Music" className="w-5 h-5" />}
              label="YouTube Music"
              collapsed={isCollapsed}
            />
            <SidebarLink
              to="#"
              icon={<img src="/youtube1.png" alt="Kids" className="w-5 h-5" />}
              label="YouTube Kids"
              collapsed={isCollapsed}
            />
          </>
        )}

        {/*============== Settings and Feedback =============*/}
        {!isCollapsed && (
          <>
            <hr className="my-2" />
            <SidebarLink
              to="#"
              icon={<SettingsIcon size={20} />}
              label="Settings"
              collapsed={isCollapsed}
            />
            <SidebarLink
              to="#"
              icon={<FlagIcon size={20} />}
              label="Report History"
              collapsed={isCollapsed}
            />
            <SidebarLink
              to="#"
              icon={<HelpCircleIcon size={20} />}
              label="Help"
              collapsed={isCollapsed}
            />
            <SidebarLink
              to="#"
              icon={<MessageCircleIcon size={20} />}
              label="Send Feedback"
              collapsed={isCollapsed}
            />
          </>
        )}

        {/*========== Footer ============*/}
        {!isCollapsed && (
          <>
            <hr className="my-2" />
            <div className="text-xs text-gray-500 px-2 space-y-1 pb-10">
              <p>
                About Press Copyright Contact us Creators Advertise Developers
              </p>
              <p>
                Terms Privacy Policy & Safety How YouTube works Test new
                features
              </p>
              <p className="pt-2">© 2025 Google LLC</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * SidebarLink component renders individual navigation items in the sidebar.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.to - The path to navigate to when clicked.
 * @param {JSX.Element} props.icon - The icon displayed beside the label.
 * @param {string} props.label - The text label of the sidebar item.
 * @param {boolean} props.collapsed - Boolean that determines if the sidebar is collapsed.
 *
 * @returns {JSX.Element} The rendered SidebarLink component.
 */

function SidebarLink({ to, icon, label, collapsed }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center ${
        collapsed ? "justify-center" : "justify-start"
      } gap-3 px-2 py-2 rounded-lg font-medium ${
        isActive ? "bg-blue-100" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <p className="flex flex-col justify-center items-center">
        {label == "You" && !collapsed ? null : icon}
        {collapsed && <span className="text-[12px] ">{label}</span>}
      </p>
      {!collapsed && (
        <span className="truncate flex items-center gap-1">
          {label}
          {label === "You" && <ChevronRightIcon size={16} />}
        </span>
      )}
    </Link>
  );
}

export default Sidebar;
