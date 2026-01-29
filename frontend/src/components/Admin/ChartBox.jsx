import React, { useEffect, useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from "recharts";
import { getUserGrowthAPI } from "../../services/allApi";

const ChartBox = () => {
  const [chartData, setChartData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);

  useEffect(() => {
    fetchGrowthData();
  }, []);

  const fetchGrowthData = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const reqHeader = { "Authorization": `Bearer ${token}` };
      try {
        const result = await getUserGrowthAPI(reqHeader);
        if (result.status === 200) {
          const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          
          const formattedGrowth = result.data.map(item => ({
            month: monthNames[item._id],
            users: item.count
          }));
          setChartData(formattedGrowth);

          const formattedDist = result.data.map(item => ({
            name: monthNames[item._id],
            value: item.count
          }));
          setDistributionData(formattedDist);
        }
      } catch (err) {
        console.error("Chart data error:", err);
      }
    }
  };

  const COLORS = ["#06b6d4", "#8b5cf6", "#f59e0b", "#ec4899", "#10b981"];

  return (
    // Changed to grid-cols-4 for better wide-screen balance
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 w-full">
      
      {/* AREA CHART - Spans 3 columns on extra large screens (75% width) */}
      <div className="xl:col-span-3 bg-[#0f172a] p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white tracking-tight">Growth Analytics</h3>
          <p className="text-sm text-slate-400 font-medium">Monthly user acquisition trends</p>
        </div>
        <div className="h-72 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={15} />
                <YAxis hide={true} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #334155" }}
                  itemStyle={{ color: "#22d3ee" }}
                />
                <Area type="monotone" dataKey="users" stroke="#06b6d4" strokeWidth={4} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">Loading timeline...</div>
          )}
        </div>
      </div>

      {/* PIE CHART - Spans 1 column (25% width) */}
      <div className="xl:col-span-1 bg-[#0f172a] p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Distribution</h3>
          <p className="text-sm text-slate-400 font-medium">Data split by month</p>
        </div>
        
        {/* Centered Flex Container to prevent right-side dead space */}
        <div className="h-64 w-full flex items-center justify-center overflow-hidden">
          {distributionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #334155" }}
                  itemStyle={{ color: "#22d3ee" }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">Loading distribution...</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ChartBox;

