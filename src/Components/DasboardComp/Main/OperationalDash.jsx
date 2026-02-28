import React, { useEffect, useMemo, useState } from "react";
import useGetUniversity from "../../../CustomHooks/UseGetUniversities";
import useGetUniversityManager from "../../../CustomHooks/UseGetUniversityManager";
import UseGetCenterSubCenter from "../../../CustomHooks/UseGetCenterSubCenter";
import useGetCounsellor from "../../../CustomHooks/UseGetCounsellor";
import UseGetAllStudents from "../../../CustomHooks/UseGetStudentsPagination";
import DashboardCard from "../DashboardCard";
import DashboardCharts from "../DashboardCharts";
import RecentStudentsTable from "../RecentStudentsTable";
import {
  format,
  parseISO,
  subDays,
  isAfter,
  isBefore,
  startOfToday,
  startOfYesterday,
  endOfYesterday,
} from "date-fns";
import RecentStudentsCards from "../RecentStudentsCards";

const NewOperationalDashboard = () => {
  const [dateFilter, setDateFilter] = useState("last7"); // last7, last30, year, all

  const { GetUniversity, universities } = useGetUniversity();
  const { GetUniversityManager, UniversityManager } = useGetUniversityManager();
  const { GetCenter, GetSubCenter, Center, SubCenter } =
    UseGetCenterSubCenter();
  const { GetCounsellorManager, CounsellorManager } = useGetCounsellor();
  const { getAllStudentByPagination, AllStudentListData } = UseGetAllStudents();

  useEffect(() => {
    GetUniversity();
    GetUniversityManager();
    GetCenter();
    GetSubCenter();
    GetCounsellorManager();
    getAllStudentByPagination();
  }, []);

  // ✅ Filter data dynamically based on selected date range
  const filteredStudents = useMemo(() => {
    if (!AllStudentListData) return [];

    const now = new Date();
    let compareDate = now;

    switch (dateFilter) {
      case "last7":
        compareDate = subDays(now, 7);
        break;
      case "last30":
        compareDate = subDays(now, 30);
        break;
      case "year":
        compareDate = subDays(now, 365);
        break;
      default:
        return AllStudentListData;
    }

    return AllStudentListData.filter((s) => {
      if (!s.createdAt) return false;
      const created =
        typeof s.createdAt === "string" ? parseISO(s.createdAt) : s.createdAt;
      return isAfter(created, compareDate);
    });
  }, [AllStudentListData, dateFilter]);

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

  const chartDataByProgram = useMemo(() => {
    const grouped = {};
    filteredStudents?.forEach((s) => {
      const prog = s.Course?.name || "Unknown";
      grouped[prog] = (grouped[prog] || 0) + 1;
    });
    return Object.keys(grouped).map((name) => ({ name, count: grouped[name] }));
  }, [filteredStudents]);

  const barChartData = useMemo(() => {
    if (!filteredStudents) return [];

    const countsByDate = {};
    filteredStudents.forEach((s) => {
      if (!s.createdAt) return;
      const date =
        typeof s.createdAt === "string" ? parseISO(s.createdAt) : s.createdAt;
      const dateStr = format(date, "yyyy-MM-dd"); // or 'yyyy-MM' for month
      countsByDate[dateStr] = (countsByDate[dateStr] || 0) + 1;
    });

    return Object.keys(countsByDate)
      .sort()
      .map((date) => ({
        name: date,
        count: countsByDate[date],
      }));
  }, [filteredStudents]);

  // Students
  const [selectedRange, setSelectedRange] = useState("Today");
  // filter students by date
  const todayStudents = useMemo(() => {
    const todayStart = startOfToday();
    return (
      AllStudentListData?.filter(
        (s) => s.createdAt && isAfter(parseISO(s.createdAt), todayStart)
      ) || []
    );
  }, [AllStudentListData]);

  const yesterdayStudents = useMemo(() => {
    const yesterdayStart = startOfYesterday();
    const yesterdayEnd = endOfYesterday();
    return (
      AllStudentListData?.filter((s) => {
        if (!s.createdAt) return false;
        const createdAt = parseISO(s.createdAt);
        return (
          isAfter(createdAt, yesterdayStart) &&
          isBefore(createdAt, yesterdayEnd)
        );
      }) || []
    );
  }, [AllStudentListData]);

  const studentsLast7Days = useMemo(() => {
    const now = new Date();
    const compareDate = subDays(now, 7);
    return (
      AllStudentListData?.filter(
        (s) => s.createdAt && isAfter(parseISO(s.createdAt), compareDate)
      ) || []
    );
  }, [AllStudentListData]);

  const studentsLast30Days = useMemo(() => {
    const now = new Date();
    const compareDate = subDays(now, 30);
    return (
      AllStudentListData?.filter(
        (s) => s.createdAt && isAfter(parseISO(s.createdAt), compareDate)
      ) || []
    );
  }, [AllStudentListData]);

  const studentsLastYear = useMemo(() => {
    const now = new Date();
    const compareDate = subDays(now, 365);
    return (
      AllStudentListData?.filter(
        (s) => s.createdAt && isAfter(parseISO(s.createdAt), compareDate)
      ) || []
    );
  }, [AllStudentListData]);

  const studentsAll = useMemo(
    () => AllStudentListData || [],
    [AllStudentListData]
  );

  // choose which list to show
  const displayedStudents = useMemo(() => {
    switch (selectedRange) {
      case "Today":
        return todayStudents;
      case "Yesterday":
        return yesterdayStudents;
      case "7days":
        return studentsLast7Days;
      case "30days":
        return studentsLast30Days;
      case "year":
        return studentsLastYear;
      case "all":
        return studentsAll;
      default:
        return [];
    }
  }, [
    selectedRange,
    studentsLast7Days,
    studentsLast30Days,
    studentsLastYear,
    studentsAll,
  ]);

  return (
    <section className="dark:bg-gray-900 bg-gray-50 p-6 rounded-2xl">
      <h1 className="text-xl font-bold mb-6 text-left text-gray-800 dark:text-gray-100">
        Operational Dashboard
      </h1>

      {/* Filters */}
      {/* <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={() => setDateFilter("last7")}
          className={`px-2 py-1 rounded text-xs border ${
            dateFilter === "last7" ? "bg-indigo-500 text-white" : ""
          }`}
        >
          Last 7 days
        </button>
        <button
          onClick={() => setDateFilter("last30")}
          className={`px-2 py-1 rounded text-xs border ${
            dateFilter === "last30" ? "bg-indigo-500 text-white" : ""
          }`}
        >
          Last 30 days
        </button>
        <button
          onClick={() => setDateFilter("year")}
          className={`px-2 py-1 rounded text-xs border ${
            dateFilter === "year" ? "bg-indigo-500 text-white" : ""
          }`}
        >
          Last year
        </button>
        <button
          onClick={() => setDateFilter("all")}
          className={`px-2 py-1 rounded text-xs border ${
            dateFilter === "all" ? "bg-indigo-500 text-white" : ""
          }`}
        >
          All
        </button>
      </div> */}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <DashboardCard
          title="Universities"
          count={universities?.length || 0}
          color="from-indigo-500 to-indigo-700"
          trend="+5%"
        />
        <DashboardCard
          title="Managers"
          count={UniversityManager?.length || 0}
          color="from-amber-500 to-amber-700"
          trend="+3%"
        />
        <DashboardCard
          title="Centers"
          count={Center?.length || 0}
          color="from-red-500 to-red-700"
          trend="+2%"
        />
        <DashboardCard
          title="Sub Centers"
          count={SubCenter?.length || 0}
          color="from-pink-500 to-pink-700"
          trend="+1%"
        />
        <DashboardCard
          title="Counsellors"
          count={CounsellorManager?.length || 0}
          color="from-violet-500 to-violet-700"
          trend="+4%"
        />
        <DashboardCard
          title="All Students"
          count={filteredStudents?.length || 0}
          color="from-green-500 to-green-700"
          trend="+6%"
        />
      </div>

      {/*  Toggle buttons */}
      <div className="flex justify-end mb-6 gap-2">
        {["Today", "Yesterday", "7days", "30days", "year", "all"].map(
          (range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-2 py-1 rounded text-xs border transition ${
                selectedRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              {range === "Today" && "Today"}
              {range === "Yesterday" && "Yesterday"}
              {range === "7days" && "Last 7 Days"}
              {range === "30days" && "Last 30 Days"}
              {range === "year" && "Last Year"}
              {range === "all" && "All"}
            </button>
          )
        )}
      </div>

      {/*  Display cards for selected range */}
      <RecentStudentsCards
        title={
          selectedRange === "Today"
            ? "Recent Students Today"
            : selectedRange === "Yesterday"
            ? "Yesterday Students - Yesterday"
            : selectedRange === "7days"
            ? "Recent Students - Last 7 Days"
            : selectedRange === "30days"
            ? "Recent Students - Last 30 Days"
            : selectedRange === "year"
            ? "Recent Students - Last Year"
            : "All Students"
        }
        students={displayedStudents}
      />

      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4">
          <h3 className="text-lg font-semibold mb-3">Students by University</h3>
          <DashboardCharts type="pie" data={chartDataByUniversity} />
        </div>
        {/* <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4">
          <h3 className="text-lg font-semibold mb-3">Top Programs</h3>
          <DashboardCharts type="bar" data={chartDataByProgram} />
        </div> */}
        {/* <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4">
          <h3 className="text-lg font-semibold mb-3">Growth Trend</h3>
          <DashboardCharts type="bar" data={barChartData} />
        </div> */}
      </div>

      {/* <RecentStudentsTable students={filteredStudents} /> */}
    </section>
  );
};

export default NewOperationalDashboard;
