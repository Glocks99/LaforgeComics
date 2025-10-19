import Layout from "../../components/admin/Layout";
import OverviewCards from "../../components/admin/overviewCards";
import RecentComics from "../../components/admin/RecentComics";


const Dashboard = () => {

  return (
    <Layout title="overview">
      <OverviewCards />
      <RecentComics />
    </Layout>
  );
};

export default Dashboard;
