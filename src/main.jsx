import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { SidebarProvider } from "./context/SidebarContext.jsx";
import App from './App.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Loader from './components/Loader.jsx';

// Lazy load all pages
const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Watch = lazy(() => import('./pages/Watch.jsx'));
const EditChannel = lazy(() => import('./pages/EditChannel.jsx'));
const ChannelPage = lazy(() => import('./pages/ChannelPage.jsx'));
const ManageChannels = lazy(() => import('./pages/ManageChannels.jsx'));
const SearchResult = lazy(() => import('./pages/SearchResult.jsx'));
const HistoryPage = lazy(() => import('./pages/HistoryPage.jsx'));
const WatchLaterPage = lazy(() => import('./pages/WatchLaterPage .jsx'));
const LikedVideosPage = lazy(() => import('./pages/LikedVideosPage.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Playlist = lazy(() => import('./pages/Playlist.jsx'));

// Router setup
const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/watch/:id", element: <Watch /> },
      { path: "/channel/:channelId", element: <ChannelPage /> },
      { path: "/channel/edit/:id", element: <EditChannel /> },
      { path: "/manage-channels", element: <ManageChannels /> },
      { path: "/search", element: <SearchResult /> },
      { path: "/history", element: <HistoryPage /> },
      { path: "/liked", element: <LikedVideosPage /> },
      { path: "/watch-later", element: <WatchLaterPage /> },
      { path: "/profile", element: <Profile /> },
      { path: "/playlist", element: <Playlist /> },
    ],
  },
]);

// Render with global Suspense
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <SidebarProvider>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} />
        </Suspense>
      </SidebarProvider>
    </Provider>
  </StrictMode>
);
