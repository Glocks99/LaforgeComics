import {
  Users,
  Eye,
  BookOpen,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  TrendingUp,
} from "lucide-react";

const AnalyticsBoard = () => {
  const stats = [
    {
      title: "Visitors This Week",
      value: "1,204",
      trend: "+8%",
      icon: <Eye className="text-blue-600" />,
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      title: "Comics Read",
      value: "340",
      trend: "+4%",
      icon: <BookOpen className="text-green-600" />,
      bg: "bg-green-50",
      border: "border-green-100",
    },
    {
      title: "New Users",
      value: "54",
      trend: "+12%",
      icon: <Users className="text-yellow-600" />,
      bg: "bg-yellow-50",
      border: "border-yellow-100",
    },
    {
      title: "Reports Filed",
      value: "8",
      trend: "-1%",
      icon: <AlertCircle className="text-red-600" />,
      bg: "bg-red-50",
      border: "border-red-100",
    },
    {
      title: "Average Session Time",
      value: "03:42",
      trend: "+5%",
      icon: <Activity className="text-purple-600" />,
      bg: "bg-purple-50",
      border: "border-purple-100",
    },
    {
      title: "Popular Genre",
      value: "Fantasy",
      trend: "↑ Trending",
      icon: <TrendingUp className="text-indigo-600" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Site Analytics</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-lg p-5 ${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-600 font-medium">{stat.title}</div>
              <div className="bg-white p-1 rounded-full shadow">{stat.icon}</div>
            </div>

            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <span
                className={`text-xs font-medium ${
                  stat.trend.includes("-") ? "text-red-500" : "text-green-600"
                } flex items-center gap-1`}
              >
                {stat.trend.includes("-") ? (
                  <ArrowDownRight size={14} />
                ) : (
                  <ArrowUpRight size={14} />
                )}
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsBoard;
