import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UploadVideo from "./UploadVideo";
import SearchBar from "./SearchBar";
import { useSidebar } from "../context/SidebarContext.jsx";
import UserDropdown from "./UserDropdown.jsx";
import { toast } from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  MenuIcon,
  PlusIcon,
  LogOut,
  CameraIcon,
  PencilIcon,
  VideoIcon,
  Bell,
  CircleUser,
  EllipsisVertical,
  Search,
  ChevronLeft,
} from "lucide-react";


/**
 * Header component for the YouTube clone application.
 * This component renders the navigation header with dynamic elements such as:
 * - Sidebar toggle button
 * - Search bar (desktop and mobile)
 * - User dropdown menu
 * - Video upload modal
 * - Log out functionality
 * 
 * @component
 * @example
 * return (
 *   <Header />
 * )
 */

function Header() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const userMenuRef = useRef(null);
  const createMenuRef = useRef(null);

  const { toggleSidebar, toggleCollapse } = useSidebar();

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

    // Toggles the sidebar or collapses it based on the current location.
  const handleToggle = () => {
    if (isHome) toggleCollapse();
    else toggleSidebar();
  };
// Handles logging out the user and redirects to the login page.
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  //  Handles the outside click to close dropdown menus.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (createMenuRef.current && !createMenuRef.current.contains(e.target)) {
        setShowCreateMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center p-2 px-4 z-50 bg-white relative">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-2">
        {/* Sidebar toggle button */}
        <button
          onClick={handleToggle}
          className="text-gray-700 hover:text-black md:block"
        >
          <MenuIcon size={24} />
        </button>

        {/* Logo (hidden on mobile search) */}
        <Link
          to={"/"}
          className={`flex gap-2 items-center ${
            isMobileSearchOpen ? "hidden" : "block"
          }`}
        >
          <img src="/YouTube_logo.png" className="w-20" alt="logo" />
          {/* <h1 className="text-sm md:text-base lg:text-lg font-semibold hidden sm:block">
            YouTube Clone
          </h1> */}
        </Link>
      </div>

      {/* CENTER: SEARCH BAR */}
      <div className=" flex justify-between md:items-center sm:w-[60%]">
        {/* Desktop search bar */}
        <div className="hidden md:flex md:justify-center md:items-center w-full">
          <SearchBar />
        </div>

        {/* Mobile search icon */}
        {/* <button
          onClick={() => setIsMobileSearchOpen(true)}
          className="md:hidden ml-auto mx-5"
        >
          {!isMobileSearchOpen && <Search size={20} />}
        </button> */}

        {/* Mobile search bar + back button */}
        {isMobileSearchOpen && (
          <div className="px-1 md:hidden flex justify-between gap-2 w-full">
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="text-gray-700 hover:text-black cursor-pointer"
            >
              <ChevronLeft />
            </button>
            <div className="flex w-full">
              <SearchBar />
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="flex justify-center items-center">
        {/* Mobile search icon */}
        <button
          onClick={() => setIsMobileSearchOpen(true)}
          className="md:hidden ml-auto mx-5"
        >
          {!isMobileSearchOpen && <Search size={20} />}
        </button>

      {user && (
        <div className="flex items-center gap-3 relative">
          {/* CREATE DROPDOWN */}
          {!isMobileSearchOpen && (
            <div className="relative sm:block" ref={createMenuRef}>
              <button
                onClick={() => setShowCreateMenu((prev) => !prev)}
                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200"
              >
                <PlusIcon size={16} />
                <span className="font-medium">Create</span>
              </button>

              {showCreateMenu && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-48 z-10 text-sm">
                  <button
                    onClick={() => {
                      if (!user.channels || user.channels.length === 0) {
                        toast.error(
                          "Please create a channel before uploading videos."
                        );
                        return;
                      }
                      setShowUploadModal(true);
                      setShowCreateMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <VideoIcon size={16} /> Upload video
                  </button>
                  <button
                    onClick={() => setShowCreateMenu(false)}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <CameraIcon size={16} /> Go live
                  </button>
                  <button
                    onClick={() => setShowCreateMenu(false)}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <PencilIcon size={16} /> Create post
                  </button>
                </div>
              )}
            </div>
          )}

          {/* NOTIFICATIONS */}
          <button className="p-2 rounded-full hover:bg-gray-100 mr-2 hidden sm:block">
            <Bell size={20} />
          </button>

          {/* AVATAR */}
          {!isMobileSearchOpen && (
            <>
              {user.avatar &&
              !user.avatar.toLowerCase().includes("placeholder") ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full cursor-pointer"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                />
              ) : (
                <div
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold cursor-pointer"
                >
                  {user.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </>
          )}

          {showUserMenu && (
            <UserDropdown
              showUserMenu={showUserMenu}
              user={user}
              onLogout={handleLogout}
              userMenuRef={userMenuRef}
              setShowUserMenu={setShowUserMenu}
            />
          )}

          {showUploadModal && (
            <UploadVideo onClose={() => setShowUploadModal(false)} />
          )}
        </div>
      )}
      {!user && !isMobileSearchOpen && (
        <div className="flex gap-2 justify-center items-center">
          <BsThreeDotsVertical />
          <button
            onClick={() => navigate("/login")}
            className="bg-white shadow border border-blue-500 rounded-full text-sm px-4 py-2 text-blue-500 cursor-pointer"
          >
            Sign in
          </button>
        </div>
      )}
      </div>
    </header>
  );
}

export default Header;
