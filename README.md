# YouTube Clone - Frontend

This is the React frontend of the YouTube Clone application, built with Vite, Redux, and Tailwind CSS.

---
## live video demo
- [live video demo google drive link](https://drive.google.com/file/d/1SyE613ujzAk7ZCsOLWbPXfx74hEX-UMs/view?usp=drive_link)

---

## Git Repositories

- [Frontend Github Repo](https://github.com/itsakshay-git/youtube_clone_frontend)

---

## live link for Demo

- [live link](https://youtube-clone-frontend-indol.vercel.app/)

---

## Screenshot

![Screenshot 2025-05-13 174606](https://github.com/user-attachments/assets/9e5cd449-66a4-4732-8d29-97ff06dbe239)
![Screenshot 2025-05-13 191311](https://github.com/user-attachments/assets/e696e691-a4fd-4e4d-8cf3-58d43f70c0ea)

---

## Features

- 🔐 Auth (Register/Login)
- 📺 Video Upload, Playback
- 📁 Playlists & Watch Later
- 🧠 Video History
- 📦 Channel Management
- 🧾 Commenting System
- 🔍 Search with Suggestions
- ❤️ Like/Dislike, Subscribe
- 📊 Redux State Management
- 🌩️ Cloudinary for Image/Video Storage

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

## 📁 Folder Structure

```
youtube_clone_frontend/
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

### Set up MongoDB Locally for backend database

- Download MongoDB and install MongoDB Compass: [https://www.mongodb.com/products/self-managed/community-edition](https://www.mongodb.com/products/self-managed/community-edition)
- Start MongoDB Server
- Open MongoDB Compass
- Connect using:

```
mongodb://localhost:27017/youtube_clone
```

---

## ⚙️ Local Setup

```bash
cd youtube_clone_frontend
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
