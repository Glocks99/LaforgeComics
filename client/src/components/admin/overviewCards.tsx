import { useEffect, useState } from "react";
import StatBox from "./statBox";
import {
  BookOpen,
  Users,
  Newspaper,
  Eye,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const OverviewCards = () => {
  const [comicCount, setComicCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [blogCount, setBlogCount] = useState(0)
  const [viewCount, setViewCount] = useState(0)

  const getComicCount = async() => {
    try {
      const {data} = await axios.get(`${import.meta.env.VITE_BackendURL}/api/comics/count`)

      if(data.success){
        setComicCount(data.comics)
      }
    } catch (error: any) {
      if(error.response?.data?.message === "cannot get comic count") return
      return toast.error(error.response?.data?.message || error.message)
    }
  }

    const getAllUsersCount = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BackendURL}/api/user/count`);
      if (data.success) {
        setUserCount(data.msg)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

    const getBlogsCount = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BackendURL}/api/blogs/count`);
      if (data.success) {
        setBlogCount(data.msg)
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

    const getViewCount = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BackendURL}/api/views`);
      if (data.success) {
        setViewCount(data.msg)
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getComicCount()
    getAllUsersCount()
    getBlogsCount()
    getViewCount()
  },[])

  const stats = [
    {
      label: "Total Comics",
      value: comicCount,
      icon: <BookOpen className="text-white" size={24} />,
      color: "from-purple-500 to-purple-700",
      tooltip: "All uploaded and published comics",
      link: "/admin/comics",
    },
    {
      label: "Users",
      value: userCount,
      icon: <Users className="text-white" size={24} />,
      color: "from-blue-500 to-blue-700",
      tooltip: "All registered users in the system",
      link: "/admin/users",
    },
    {
      label: "Blogs",
      value: blogCount,
      icon: <Newspaper className="text-white" size={24} />,
      color: "from-green-500 to-green-700",
      tooltip: "Published blog articles",
      link: "/admin/blogs",
    },
    {
      label: "Total Views",
      value: viewCount,
      icon: <Eye className="text-white" size={24} />,
      color: "from-pink-500 to-pink-700",
      tooltip: "Total page views recorded today",
      link: "/admin/analytics",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
      {stats.map((stat, idx) => (
        <StatBox
          key={idx}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          tooltip={stat.tooltip}
          link={stat.link}
        />
      ))}
    </div>
  );
};

export default OverviewCards;
