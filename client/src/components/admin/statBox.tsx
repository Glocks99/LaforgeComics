import { ArrowRight } from "lucide-react";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";

interface StatBoxProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
  tooltip?: string;
  link?: string;
}

const StatBox = ({
  label,
  value,
  icon,
  color = "from-gray-600 to-gray-800",
  tooltip,
  link = "#",
}: StatBoxProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`relative bg-gradient-to-br ${color} text-white p-5 rounded-xl shadow-md hover:scale-[1.03] transform transition-all duration-300`}
      title={tooltip}
    >
        
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">{label}</span>
        {icon && <div className="bg-white/20 p-2 rounded-md">{icon}</div>}
      </div>

      <div className="text-3xl font-bold">
        <CountUp end={value} duration={1.5} />
      </div>

      <button
        onClick={() => navigate(link)}
        className="text-xs mt-4 flex items-center gap-1 text-white/80 hover:text-white transition"
      >
        View Details <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default StatBox;
