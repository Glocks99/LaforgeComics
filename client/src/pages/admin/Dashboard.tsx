import { useEffect, useState } from "react";
import Layout from "../../components/admin/Layout";
import OverviewCards from "../../components/admin/overviewCards";
import RecentComics from "../../components/admin/RecentComics";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const Dashboard = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Delay rendering until user data is checked
    if (user) {
      if (!user?.user?.isAdmin) {
        setTimeout(()=> {
          navigate("/");
        }, 2000)
      } else {
        setIsChecking(false);
      }
    }
  }, [user, navigate]);

  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-600">
        <Loader className="animate-spin" />
        <p className="text-lg font-medium animate-pulse">
          Checking admin access...
        </p>
      </div>
    );
  }

  return (
    <Layout title="Overview">
      <OverviewCards />
      <RecentComics />
    </Layout>
  );
};

export default Dashboard;
