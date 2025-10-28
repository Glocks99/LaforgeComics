import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Error from "./pages/Error";
import Comics from "./pages/Comics";
import { Toaster } from "react-hot-toast";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import ComicDetail from "./pages/ComicDetail";
import Profile from "./pages/Profile";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import More from "./pages/More";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/admin/Dashboard";
import AdminComics from "./pages/admin/Comics"
import Users from "./pages/admin/Users";
import AdminBlog from "./pages/admin/Blogs"
import Artist from "./pages/admin/Artist";
import ArtistDetail from "./components/ArtistDetail";
import Analytics from "./pages/admin/Analytics";
import ComicPage from "./components/ComicPage"
import FeedDetail from "./pages/FeedDetail";
import Favourites from "./pages/Favourites";
import Settings from "./pages/Settings";
import SubmitComic from "./pages/SubmitComic";
import Support from "./pages/Support";
import {useDynamicThemeColor} from "./hooks/useDynamicThemeColor"
import { useAppContext } from "./context/AppContext";

function App() {
  const {darkMode} = useAppContext()

  useDynamicThemeColor(darkMode)
  
  useEffect(() => {
    Aos.init({ duration: 800, once: true });
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#234",
            color: "#fff",
            borderRadius: "8px",
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/comics" element={<Comics />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/comic_detail/:id" element={<ComicDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/more" element={<More />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/pages/:id" element={<ComicPage />} />
        <Route path="artist/:id" element={<ArtistDetail />} />
        <Route path="/feed" element={<FeedDetail />} />
        <Route path="/likes" element={<Favourites />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/submit-comic" element={<SubmitComic />} />
        <Route path="/support" element={<Support />} />

        <Route path="/admin">
          <Route path="overview" element={<Dashboard />} />
          <Route path="comics" element={<AdminComics />} />
          <Route path="users" element={<Users />} />
          <Route path="blogs" element={<AdminBlog />} />
          <Route path="artists" element={<Artist />} />
          <Route path="analytics" element={<Analytics />} />
          
        </Route>


        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
