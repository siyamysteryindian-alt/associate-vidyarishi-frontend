import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
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

// Custom Hooks
import useGetUniversity from "../../CustomHooks/UseGetUniversities";
import useGetProgramType from "../../CustomHooks/UseGetProgramType";
import useGetUniversityManager from "../../CustomHooks/UseGetUniversityManager";
import UseGetCenterSubCenter from "../../CustomHooks/UseGetCenterSubCenter";
import useGetCounsellor from "../../CustomHooks/UseGetCounsellor";
import UseGetAccountant from "../../CustomHooks/UseGetAccountant";
import UseGetAllStudents from "../../CustomHooks/UseGetStudentsPagination";
import UseGetAdmissionSession from "../../CustomHooks/UseGetAdmissionSession";
import useGetDocuments from "../../CustomHooks/UseGetDocuments";
import Loader from "../../Helper/Loader";
import DashboardCard from "../DasboardComp/DashboardCard";
import RecentStudentsCards from "../DasboardComp/RecentStudentsCards";

const OperationalDashboard = () => {
  const ReduxUniversity = useSelector((state) => state?.university);
  const ReduxUserlogin = useSelector((state) => state?.user);
  const [dateFilter, setDateFilter] = useState("last7"); // last7, last30, year, all

  // Hooks data
  const { GetUniversity, universities } = useGetUniversity();
  const { GetProgramType } = useGetProgramType();
  const {
    GetUniversityManager,
    GetOperationalManager,
    GetAdminDetails,
    UniversityManager,
    OperationalManager,
    AdminDetails,
  } = useGetUniversityManager();
  const { GetCenter, GetSubCenter, Center, SubCenter } =
    UseGetCenterSubCenter();
  const {
    GetCounsellorManager,
    GetSubCounsellorManager,
    CounsellorManager,
    SubCounsellorManager,
  } = useGetCounsellor();
  const { GetAccountantData, Accountant } = UseGetAccountant();
  const { FetchAllStudentByPagination, AllStudentListData } =
    UseGetAllStudents();
  const { AdmissionsessionListData, GetAdmissionSession } =
    UseGetAdmissionSession();
  const { GetAllDocuments } = useGetDocuments();
  // Fetch data on mount & on university change
  useEffect(() => {
    if (ReduxUniversity?.id) {
      GetProgramType();
      GetUniversityManager();
      GetOperationalManager();
      GetAdminDetails();
      GetAccountantData();
      FetchAllStudentByPagination();
      GetAdmissionSession();
      GetAllDocuments();
      GetCenter();
      GetSubCenter();
      GetCounsellorManager();
      GetSubCounsellorManager();
    }
  }, [ReduxUniversity?.id]);

  useEffect(() => {
    GetUniversity();
  }, [ReduxUserlogin?.id]);

  // Filters
  const filterUniversities = universities?.filter(
    (u) => u?._id === ReduxUniversity?.id
  );
  const AccountantDetails = Accountant?.filter((d) =>
    d?.allotedUniversities?.some((u) => u?._id === ReduxUniversity?.id)
  );
  const UniversityManagerDetails = UniversityManager?.filter((d) =>
    d?.allotedUniversities?.some((u) => u?._id === ReduxUniversity?.id)
  );

  const filteredStudents2 = useMemo(() => {
    if (!AllStudentListData) return [];
    setDateFilter("all");

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
    <section className="bg-gray-50 dark:bg-slate-800 p-4 m-2 rounded-2xl shadow-sm">
      <div className="overflow-auto max-h-[calc(100vh-120px)] ScrollBarStyle">
        <div className="flex flex-col gap-6 px-2.5">
          {/* Welcome */}
          <div className="text-base font-semibold text-primary ml-3">
            Hi <span className="font-bold">{ReduxUserlogin?.name}</span>,
            Welcome Back
            <br />
            <span className="font-bold">
              (
              {ReduxUserlogin?.role === "operation-manager" &&
                "Operational Manager"}{" "}
              Dashboard)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            <DashboardCard
              title="Universities"
              count={universities?.length || 0}
              color="from-[#1F4E79] to-[#1F4E79]"
              trend="+5%"
            />
            <DashboardCard
              title="Managers"
              count={UniversityManager?.length || 0}
              color="from-[#1F4E79] to-[#1F4E79]"
              trend="+3%"
            />
            <DashboardCard
              title="Centers"
              count={Center?.length || 0}
              color="from-[#1F4E79] to-[#1F4E79]"
              trend="+2%"
            />
            <DashboardCard
              title="Sub Centers"
              count={SubCenter?.length || 0}
              color="from-[#1F4E79] to-[#1F4E79]"
              trend="+1%"
            />
            <DashboardCard
              title="Counsellors"
              count={CounsellorManager?.length || 0}
              color="from-[#1F4E79] to-[#1F4E79]"
              trend="+4%"
            />
            <DashboardCard
              title="All Students"
              count={filteredStudents2?.length || 0}
              color="from-[#1F4E79] to-[#1F4E79]"
              trend="+6%"
            />
          </div>

          {/* Session Cards */}
          <div className="flex flex-wrap gap-6 text-sm mb-6">
            {AdmissionsessionListData?.filter(
              (session) => session?.university === ReduxUniversity?.id
            )?.map((session) => {
              const studentsForSession =
                AllStudentListData?.filter(
                  (s) => s?.admissionSession?._id === session?._id
                ) || [];

              const totalAdmissions = studentsForSession.length;

              const totalProcessed = studentsForSession.filter(
                (s) =>
                  s?.status?.TrackStatus === "4" &&
                  s?.status?.submitedFormDate &&
                  !s?.documents?.isApproved &&
                  !s?.documents?.isPendency &&
                  s?.status?.processedbyCenteron &&
                  !s?.status?.processedtoUniversityon &&
                  s?.EnrollmentNo
              ).length;

              const totalEnrolled = studentsForSession.filter(
                (s) =>
                  s?.status?.TrackStatus === "4" &&
                  s?.status?.submitedFormDate &&
                  s?.documents?.isApproved &&
                  !s?.documents?.isPendency &&
                  s?.status?.processedbyCenteron &&
                  s?.status?.processedtoUniversityon &&
                  !s?.EnrollmentNo
              ).length;

              const totalReady = studentsForSession.filter(
                (s) =>
                  s?.status?.TrackStatus === "4" &&
                  s?.status?.submitedFormDate &&
                  s?.documents?.isApproved &&
                  !s?.documents?.isPendency &&
                  s?.status?.processedbyCenteron &&
                  s?.status?.processedtoUniversityon &&
                  s?.EnrollmentNo
              ).length;

              const totalNoPendency = studentsForSession.filter(
                (s) =>
                  s?.status?.TrackStatus === "4" &&
                  s?.status?.submitedFormDate &&
                  s?.documents?.isApproved &&
                  !s?.documents?.isPendency &&
                  s?.documents?.isApprovedDate &&
                  s?.status?.processedbyCenteron &&
                  !s?.status?.processedtoUniversityon &&
                  !s?.EnrollmentNo
              ).length;

              const totalPending = studentsForSession.filter(
                (s) =>
                  s?.status?.TrackStatus === "4" &&
                  s?.status?.submitedFormDate &&
                  !s?.documents?.isApproved &&
                  s?.documents?.isPendency &&
                  s?.documents?.isApprovedDate &&
                  s?.status?.processedbyCenteron &&
                  !s?.status?.processedtoUniversityon &&
                  !s?.EnrollmentNo
              ).length;

              return (
                <div
                  key={session?._id}
                  className="bg-white border shadow-xl border-gray-200 rounded-2xl shadow-sm p-4 w-full max-w-xs"
                >
                  <div className="text-base font-bold mb-1 text-primary">
                    Session: {session?.name}
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Admissions:</span>
                      <span>{totalAdmissions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">
                        Total Center Processed:
                      </span>
                      <span>{totalProcessed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Doc's Pending:</span>
                      <span>{totalPending}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Doc's Approved:</span>
                      <span>{totalNoPendency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Enrolled:</span>
                      <span>{totalEnrolled}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Ready:</span>
                      <span>{totalReady}</span>
                    </div>
                  </div>
                </div>
              );
            })}
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

          {/* Total Students Card */}
          {/* <div className="bg-white border shadow-xl border-gray-200 rounded-2xl p-4 max-w-56">
            <div className="text-sm font-medium text-secondary mb-1">
              This University Students
            </div>
            <div className="text-2xl font-bold text-primary">
              {AllStudentListData?.filter(
                (s) => s.university._id === ReduxUniversity?.id
              )?.length || 0}
            </div>
          </div> */}

          {/* Payment Details */}
          <div className="bg-white shadow-xl border border-gray-200 rounded-2xl">
            <div className="px-6 py-4 font-bold text-sm text-primary">
              Payment Details
            </div>
            <div className="flex gap-5 px-6 pb-4 text-sm text-gray-700">
              <div className="flex flex-col font-semibold gap-2">
                <div>Account Holder</div>
                <div>IFSC CODE</div>
                <div>Account Number</div>
                <div>Bank Name</div>
                <div>Branch Name</div>
              </div>
              {filterUniversities?.map((u) => (
                <div key={u?._id} className="flex flex-col font-bold gap-2">
                  <div>: {u?.PaymentDetailsModel?.Name || "N/A"}</div>
                  <div>: {u?.PaymentDetailsModel?.IFSC || "N/A"}</div>
                  <div>: {u?.PaymentDetailsModel?.AccountNumber || "N/A"}</div>
                  <div>: {u?.PaymentDetailsModel?.BankName || "N/A"}</div>
                  <div>: {u?.PaymentDetailsModel?.Branch || "N/A"}</div>
                </div>
              ))}
            </div>
          </div>

          {/* University Details Table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="px-6 py-4 font-bold text-sm text-primary">
              Alloted Universities To {ReduxUserlogin?.name} ({""}
              {ReduxUserlogin?.role === "operation-manager" &&
                "Operational Manager"}
              )
            </div>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Photo",
                      "Name",
                      "Address",
                      "Departments",
                      "Courses",
                      "Specializations",
                      "Status",
                    ].map((h) => (
                      <th key={h} className="px-4 py-2 text-left font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {OperationalManager?.filter(
                    (op) => op?._id === ReduxUserlogin?.id
                  )?.flatMap((op) =>
                    op?.allotedUniversities?.length > 0 ? (
                      op?.allotedUniversities?.map((u) => (
                        <tr
                          key={u?._id}
                          className="even:bg-gray-50 hover:bg-gray-100"
                        >
                          <td className="px-4 py-2">
                            <img
                              src={u?.photo}
                              alt=""
                              className="w-24 rounded-md"
                            />
                          </td>
                          <td className="px-4 py-2">{u?.name}</td>
                          <td className="px-4 py-2">{u?.address}</td>
                          <td className="px-4 py-2">
                            {u?.department?.length || 0}
                          </td>
                          <td className="px-4 py-2">
                            {u?.program?.length || 0}
                          </td>
                          <td className="px-4 py-2">
                            {u?.specialization?.length || 0}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                u?.isAvailable
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {u?.isAvailable ? "Available" : "Not Available"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <div>Not Alloted Any</div>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className=" mr-2 w-full h-auto  rounded-2xl bg-white shadow-xl border mb-10">
            <div className="w-full h-auto ">
              <div className="text-left m-5 tracking-wide font-bold text-sm">
                Help & Support
              </div>
              <div className="text-left m-5">
                <table className="bg-white border w-full border-gray-200 rounded">
                  {/* Table Header */}
                  <thead className="text-sm">
                    <tr>
                      {["Level", "Name", "Mobile", "Email"].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-2 text-left font-bold whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="text-sm">
                    {SubCounsellorManager?.length > 0 ? (
                      SubCounsellorManager?.filter(
                        (filter) => filter?._id === ReduxUserlogin?.id
                      )?.map((subcouns) => (
                        <tr
                          key={subcouns?.counsellors?._id}
                          className="border-t"
                        >
                          <td className="px-4 py-2 capitalize">
                            {subcouns?.counsellors?.role || "N/A"}
                          </td>
                          <td className="px-4 py-2">
                            {subcouns?.counsellors?.name || "N/A"}
                          </td>
                          <td className="px-4 py-2">
                            {subcouns?.counsellors?.contact || "N/A"}
                          </td>
                          <td className="px-4 py-2">
                            {subcouns?.counsellors?.email || "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-t">
                        <td className="px-4 py-2 capitalize">Center</td>
                        <td className="px-4 py-2 capitalize" colSpan={3}>
                          Centers Not Allotted
                        </td>
                      </tr>
                    )}

                    {SubCounsellorManager?.length > 0 ? (
                      SubCounsellorManager.filter(
                        (subcouns) =>
                          subcouns?.counsellors?._id === ReduxUserlogin?.id
                      ).map((GetCouns) => (
                        <tr key={GetCouns?._id} className="border-t">
                          <td className="px-4 py-2 capitalize">
                            {GetCouns?.role || "N/A"}
                          </td>
                          <td className="px-4 py-2">
                            {GetCouns?.name || "N/A"}
                          </td>
                          <td className="px-4 py-2">
                            {GetCouns?.contact || "N/A"}
                          </td>
                          <td className="px-4 py-2">
                            {GetCouns?.email || "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-t">
                        <td className="px-4 py-2 capitalize">Sub Counsellor</td>
                        <td className="px-4 py-2 capitalize" colSpan={3}>
                          Sub Counsellor Not Allotted
                        </td>
                      </tr>
                    )}

                    {UniversityManagerDetails.length !== 0 ? (
                      UniversityManagerDetails?.slice(0, 1)?.map((data, i) => (
                        <>
                          <tr key={i} className="border-t ">
                            <td className="px-4 py-2 capitalize">
                              {data?.role === "university-manager" &&
                                "University Manager"}
                            </td>
                            <td className="px-4 py-2">{data?.name}</td>
                            <td className="px-4 py-2">{data?.contact}</td>
                            <td className="px-4 py-2">{data?.email}</td>
                          </tr>
                        </>
                      ))
                    ) : (
                      <>
                        <tr className="border-t">
                          <td className="px-4 py-2 capitalize">
                            University Manger
                          </td>
                          <td className="px-4 py-2">
                            University Manger Not Alloted
                          </td>
                        </tr>
                      </>
                    )}
                    {AccountantDetails.length !== 0 ? (
                      AccountantDetails?.slice(0, 1)?.map((data, i) => (
                        <>
                          <tr key={i} className="border-t">
                            <td className="px-4 py-2 capitalize">
                              {data?.role}
                            </td>
                            <td className="px-4 py-2">{data?.name}</td>
                            <td className="px-4 py-2">{data?.contact}</td>
                            <td className="px-4 py-2">{data?.email}</td>
                          </tr>
                        </>
                      ))
                    ) : (
                      <>
                        <tr className="border-t">
                          <td className="px-4 py-2 capitalize">Accountant</td>
                          <td className="px-4 py-2">Accountant Not Alloted</td>
                        </tr>
                      </>
                    )}

                    {AdminDetails?.slice(0, 1)?.map((data, i) => (
                      <>
                        <tr key={i} className="border-t">
                          <td className="px-4 py-2 capitalize">Head</td>
                          <td className="px-4 py-2">{data?.name}</td>
                          <td className="px-4 py-2">{data?.contact}</td>
                          <td className="px-4 py-2">{data?.email}</td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OperationalDashboard;
