# YouTube Clone - Frontend

This is the React frontend of the YouTube Clone application, built with Vite, Redux, and Tailwind CSS.

---

## Git Repositories

- [Frontend Repo](./frontend)

---

## 📁 Folder Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── CategoryChip.jsx
│   │   └── CommentSection.
│   │   ├── Header.jsx
│   │   └── Loader.jsx
│   │   ├── SearchBar.jsx
│   │   └── SideBar.jsx
│   │   ├── SubscribeButton.jsx
│   │   └── SuggestedVideo.jsx
│   │   ├── UploadVideo.jsx
│   │   └── UserDropdown.jsx
│   │   ├── VideoCard.jsx
│   │   └── VideoCardDropdown.jsx
│   │   ├──VideoPlayer.jsx
│   │   └──VideoPlaylistDropdown.jsx
│   ├── config/api.js
│   │   ├── api.js
│   ├── context/
│   │   ├── SidebarContext.js
│   ├── hooks/
│   │   ├── useChannelEdit.js
│   │   └── useCreateChannel.js
│   │   ├── useEditPlaylistForm.js
│   │   └── useEditVideoForm.js
│   │   ├── useFetchChannel.js
│   │   └── useFetchCurrentUser.js
│   │   ├── useHistoryVideo.js
│   │   └── useIsMobile.js
│   │   ├── useLikedVideos.js
│   │   └── useLoginForm.js
│   │   ├── usePlaylistManager.js
│   │   └── useRegisterForm.js
│   │   ├── useSearch.js
│   │   └── useSearchResults.js
│   │   ├── useUserPlaylists.js
│   │   └── useUserProfileData.js
│   │   ├── useVideoPlayer.js
│   │   └── useWatchLater.js
│   │   ├── useWatchPage.js
│   ├── model/
│   │   └── CreateChannelModel.jsx
│   │   ├── EditPlaylistModel.jsx
│   │   └── EditVideoModel.jsx
│   │   ├── PlaylistModel.jsx
│   ├── pages/
│   │   └── ChannelPage.jsx
│   │   ├── EditChannel.jsx
│   │   └── ErrorPage.jsx
│   │   ├── HistoryPage.jsx
│   │   ├── Home.jsx
│   │   └── LikedVideoPage.jsx
│   │   ├── Login.jsx
│   │   ├── ManageChannels.jsx
│   │   └── MyChannels.jsx
│   │   ├── Playlist.jsx
│   │   ├── Profile.jsx
│   │   └── Register.jsx
│   │   ├── SearchResult.jsx
│   │   ├── Watch.jsx
│   │   └── WatchLaterPage.jsx
│   ├── redux/
│   │   ├── authSlice.js
│   │   ├── sidebarSlice.js
│   │   └── store.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
├── .env
```

---

## 💡 Features

- Redux-powered global state
- Multi-step forms (auth, upload)
- Upload video/image to Cloudinary
- Responsive video player
- Playlist and Watch Later integration
- Channel management with banner
- Modal-based forms for UX
- Sidebar with subscriptions and filters

---

## ⚙️ Local Setup

```bash
cd frontend
npm install
npm run dev
```

> Make sure to set your VITE\_ environment variables in `.env`

---

## 🔐 Environment Variables

Create a `.env` file and configure:

```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

---

## Usage

- Explore videos on the home page
- Register or Login to upload videos and comment
- Create and manage your own channel
- Subscribe to other channels
- Like/Dislike videos
- Save videos to playlists or watch later
- View your watch history and liked videos
- Search for content with real-time suggestions

---

## 📦 Dependencies

- React + Vite
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- Moment.js
