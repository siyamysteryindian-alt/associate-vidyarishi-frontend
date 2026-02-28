import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";

const DashboardCharts = ({ type, data }) => {
  const palette = [
    "#1F4E79",
    "#2A3F54",
    "#708090",
    "#3C8DAD",
    "#A9A9A9",
    "#556B2F",
    "#BFA46F",
  ];

  if (!data || data.length === 0)
    return <p className="text-gray-400 text-sm">No data</p>;

  //  Auto-trim labels (responsive)
  const trimLabel = (label) => {
    if (!label) return "";
    if (window.innerWidth < 100) return label.slice(0, 8) + "...";
    if (window.innerWidth < 900) return label.slice(0, 12) + "...";
    return label;
  };

  //  Auto-rotate ticks (small screens → rotate more)
  const getTickRotation = () => {
    const w = window.innerWidth;
    if (w < 500) return 55;
    if (w < 900) return 35;
    return 0;
  };

  //  Pie Chart
  if (type === "pie") {
    return (
      <div style={{ height: 260 }}>
        <ResponsivePie
          data={data.map((d) => ({
            ...d,
            label: trimLabel(d.label),
          }))}
          margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
          innerRadius={0.56}
          padAngle={0.7}
          cornerRadius={3}
          colors={palette}
          borderWidth={1}
          enableArcLabels={true}
          arcLabelsSkipAngle={12}
          arcLabelsTextColor="#ffffff"
          animate
        />
      </div>
    );
  }

  //  Bar Chart
  if (type === "bar") {
    const tickRotation = getTickRotation();

    return (
      <div style={{ height: 260 }}>
        <ResponsiveBar
          data={data.map((d) => ({
            ...d,
            name: trimLabel(d.name),
          }))}
          keys={["count"]}
          indexBy="name"
          margin={{
            top: 20,
            right: 20,
            bottom: tickRotation > 0 ? 100 : 60,
            left: 40,
          }}
          padding={0.3}
          colors={palette}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: tickRotation,
            legend: "Date",
            legendOffset: 50,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 3,
            tickPadding: 3,
            tickRotation: 0,
          }}
          enableLabel={false}
          animate
          tooltip={({ indexValue, value }) => (
            <div className="px-2 py-1 bg-black text-white text-xs rounded shadow">
              <strong>{indexValue}</strong>: {value}
            </div>
          )}
        />
      </div>
    );
  }

  return null;
};

export default DashboardCharts;
