import React from "react";

const DashboardCard = ({ title, count, color, trend }) => (
  <div
    className={`bg-gradient-to-r ${color} text-white shadow rounded-2xl p-5 w-full min-h-[110px] flex flex-col justify-between`}
    style={{ boxShadow: "0 8px 20px rgba(15,23,42,0.08)" }}
  >
    <div>
      <div className="text-sm opacity-90">{title}</div>
      <div className="text-2xl font-bold mt-1">{count}</div>
    </div>
    {trend && <div className="text-xs opacity-80">{trend}</div>}
  </div>
);

export default DashboardCard;
