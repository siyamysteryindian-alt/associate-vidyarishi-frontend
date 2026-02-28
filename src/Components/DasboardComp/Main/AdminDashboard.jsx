// src/Pages/DasboardComp/Main/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import useGetUniversity from "../../../CustomHooks/UseGetUniversities";
import useGetUniversityManager from "../../../CustomHooks/UseGetUniversityManager";
import UseGetCenterSubCenter from "../../../CustomHooks/UseGetCenterSubCenter";
import useGetCounsellor from "../../../CustomHooks/UseGetCounsellor";
import UseGetAllStudents from "../../../CustomHooks/UseGetStudentsPagination";

import DashboardCard from "../DashboardCard";
import DashboardCharts from "../DashboardCharts";
import RecentStudentsCards from "../RecentStudentsCards";
import RecentStudentsTable from "../RecentStudentsTable";

import {
  format,
  parseISO,
  subDays,
  isAfter,
  startOfToday,
  startOfYesterday,
  endOfYesterday,
} from "date-fns";

/* small skeleton helpers */
const BoxSkeleton = ({ h = "h-28" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-2xl ${h}`} />
);

const AdminDashboard = () => {
  // user-provided filters
  const [dateFilter, setDateFilter] = useState("all"); // last7,last30,year,all
  const [selectedRange, setSelectedRange] = useState("all"); // Today, Yesterday, 7days, 30days, year, all

  // your data hooks (real)
  const { GetUniversity, universities, UniversityLoading } = useGetUniversity();
  const { GetUniversityManager, UniversityManager } = useGetUniversityManager();
  const { GetCenter, GetSubCenter, Center, SubCenter } =
    UseGetCenterSubCenter();
  const { GetCounsellorManager, CounsellorManager } = useGetCounsellor();
  const { getAllStudentByPagination, AllStudentListData, AllStudentLoading } =
    UseGetAllStudents();

  // load once on mount same as your code
  useEffect(() => {
    GetUniversity();
    GetUniversityManager();
    GetCenter();
    GetSubCenter();
    GetCounsellorManager();
    getAllStudentByPagination();
    // eslint-disable-next-line
  }, []);

  const loading =
    UniversityLoading || AllStudentLoading || !AllStudentListData || false;

  // filteredStudents logic (same as your original)
  const filteredStudents = useMemo(() => {
    if (!AllStudentListData) return [];
    const now = new Date();
    let compareDate = now;
    if (dateFilter === "last7") compareDate = subDays(now, 7);
    if (dateFilter === "last30") compareDate = subDays(now, 30);
    if (dateFilter === "year") compareDate = subDays(now, 365);
    if (dateFilter === "all") return AllStudentListData;

    return AllStudentListData.filter((s) => {
      if (!s.createdAt) return false;
      const created =
        typeof s.createdAt === "string" ? parseISO(s.createdAt) : s.createdAt;
      return isAfter(created, compareDate);
    });
  }, [AllStudentListData, dateFilter]);

  // chart data by university (pie)
  const chartDataByUniversity = useMemo(() => {
    const grouped = {};
    filteredStudents?.forEach((s) => {
      const uni = s.university?.name || "Unknown";
      grouped[uni] = (grouped[uni] || 0) + 1;
    });
    return Object.keys(grouped).map((name) => ({
      id: name,
      label: name,
      value: grouped[name],
    }));
  }, [filteredStudents]);

  // bar chart data (counts by day)
  const barChartData = useMemo(() => {
    if (!filteredStudents) return [];
    const countsByDate = {};
    filteredStudents.forEach((s) => {
      if (!s.createdAt) return;
      const date =
        typeof s.createdAt === "string" ? parseISO(s.createdAt) : s.createdAt;
      const dateStr = format(date, "yyyy-MM-dd");
      countsByDate[dateStr] = (countsByDate[dateStr] || 0) + 1;
    });
    return Object.keys(countsByDate)
      .sort()
      .map((d) => ({ name: d, count: countsByDate[d] }));
  }, [filteredStudents]);

  // quick filters for recent cards (Today / Yesterday)
  const todayStudents = useMemo(() => {
    const t = startOfToday();
    return (
      AllStudentListData?.filter(
        (s) => s.createdAt && isAfter(parseISO(s.createdAt), t)
      ) || []
    );
  }, [AllStudentListData]);

  const yesterdayStudents = useMemo(() => {
    const ys = startOfYesterday();
    const ye = endOfYesterday();
    return (
      AllStudentListData?.filter((s) => {
        if (!s.createdAt) return false;
        const d = parseISO(s.createdAt);
        return d > ys && d <= ye;
      }) || []
    );
  }, [AllStudentListData]);

  // displayed students for RecentStudentsCards (based on selectedRange)
  const displayedStudents = useMemo(() => {
    switch (selectedRange) {
      case "Today":
        return todayStudents;
      case "Yesterday":
        return yesterdayStudents;
      case "7days":
      case "30days":
      case "year":
        // use filteredStudents for these (filtered by dateFilter selection)
        return filteredStudents;
      case "all":
        return AllStudentListData || [];
      default:
        return [];
    }
  }, [
    selectedRange,
    todayStudents,
    yesterdayStudents,
    filteredStudents,
    AllStudentListData,
  ]);

  // KPIs
  const kpis = [
    {
      title: "Universities",
      count: universities?.length || 0,
      color: "from-[#1F4E79] to-[#1F4E79] ",
    },
    {
      title: "University Managers",
      count: UniversityManager?.length || 0,
      color: "from-[#1F4E79]  to-[#1F4E79] ",
    },
    {
      title: "Centers",
      count: Center?.length || 0,
      color: "from-[#1F4E79]  to-[#1F4E79]",
    },
    {
      title: "Sub Centers",
      count: SubCenter?.length || 0,
      color: "from-[#1F4E79]  to-[#1F4E79]",
    },
    {
      title: "Counsellors",
      count: CounsellorManager?.length || 0,
      color: "from-[#1F4E79]  to-[#1F4E79]",
    },
    {
      title: "Filtered Students",
      count: filteredStudents?.length || 0,
      color: "from-[#1F4E79]  to-[#1F4E79]",
    },
  ];

  return (
    <section className="px-6  rounded-2xl bg-[var(--color-bg)] ">
      {/* header */}
      <div className=" bg-white px-8 py-4 rounded-xl flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Admin Dashboard
          </h1>
          <div className="text-sm text-gray-500 mt-1">Overview & analytics</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString()} -{" "}
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="bg-white p-6 rounded-xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
        {kpis.map((k) => (
          <DashboardCard
            key={k.title}
            title={k.title}
            count={k.count}
            color={k.color}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="  flex flex-col my-6">
        <div className="bg-white px-4 py-4 rounded-xl flex items-center justify-between mb-6 gap-4">
          <div className="relative group">
            <select
              className="
        appearance-none 
        px-4 py-2.5 
        pr-10
        rounded-lg 
        border border-gray-300 
        dark:border-gray-700
        text-sm font-medium
        bg-white dark:bg-gray-900
        shadow-sm

        hover:border-[var(--color-purple)]
        hover:bg-gray-50 
        dark:hover:bg-gray-800

        focus:ring-2 
        focus:ring-[var(--color-purple)] 
        focus:border-[var(--color-purple)]

        transition-all duration-200
      "
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="year">Last year</option>
              <option value="all">All time</option>
            </select>

            {/* ▼ Icon */}
            <span
              className="
        pointer-events-none 
        absolute right-3 top-1/2 -translate-y-1/2 
        text-gray-500 
        group-hover:text-[var(--color-purple)]
        transition-colors duration-200
      "
            >
              ▼
            </span>
          </div>
        </div>

        {/* Charts + right rail */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mb-8">
          {/* LEFT CHART — 30% */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
            <h3 className="text-lg font-semibold mb-3">
              Students by University
            </h3>
            {loading ? (
              <BoxSkeleton h="h-56" />
            ) : (
              <DashboardCharts type="pie" data={chartDataByUniversity} />
            )}
          </div>

          {/* RIGHT CHART — 70% */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
            <h3 className="text-lg font-semibold mb-3">Growth Trend</h3>
            {loading ? (
              <BoxSkeleton h="h-48" />
            ) : (
              <DashboardCharts type="bar" data={barChartData} />
            )}
          </div>
        </div>
      </div>

      <div className=" rounded-xl flex flex-col my-6">
        <div className="bg-white px-4 py-4 rounded-xl flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {["Today", "Yesterday", "7days", "30days", "year", "all"].map(
              (r) => {
                const label =
                  r === "7days"
                    ? "Last 7 Days"
                    : r === "30days"
                    ? "Last 30 Days"
                    : r === "year"
                    ? "Last Year"
                    : r === "all"
                    ? "All Time"
                    : r;

                const isActive = selectedRange === r;

                return (
                  <button
                    key={r}
                    onClick={() => setSelectedRange(r)}
                    className={`
            px-4 py-1.5 
            rounded-full 
            text-xs font-medium
            transition-all duration-200
            shadow-sm
            
            ${
              isActive
                ? "bg-[var(--color-purple)] text-white shadow-md scale-[1.03]"
                : "bg-white text-gray-700 border border-gray-300 hover:border-[var(--color-purple)] hover:text-[var(--color-purple)]"
            }
          `}
                  >
                    {label}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Recent students cards */}
        <RecentStudentsCards
          title={
            selectedRange === "Today"
              ? "Recent Students Today"
              : selectedRange === "Yesterday"
              ? "Yesterday Students"
              : selectedRange === "7days"
              ? "Recent - Last 7 Days"
              : selectedRange === "30days"
              ? "Recent - Last 30 Days"
              : selectedRange === "year"
              ? "Recent - Last Year"
              : "All Students"
          }
          students={displayedStudents}
        />
      </div>

      {/* Main table */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
        <h3 className="text-lg font-semibold mb-3">Students table</h3>
        {loading ? (
          <div className="space-y-3">
            <BoxSkeleton />
            <BoxSkeleton />
          </div>
        ) : (
          <RecentStudentsTable students={filteredStudents} />
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;
