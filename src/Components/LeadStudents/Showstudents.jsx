// import React, { useState } from "react";
import { TbCalendarWeek } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import ActivityModal from "../Leads/Activity/ShowActivity";
import ProspRegModal from "../Leads/ProspReg/ProspRegModal";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";

const Showstudents = () => {
  const [ActivityOpen, setActivityOpen] = useState(false);
  const [ProspRegOpen, setProspRegOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const LoggedUser = useSelector((state) => state.user);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get-students`,
        {
          withCredentials: true, // ✅ MUST BE HERE
        },
      );
      // ✅ Only show approved students
      // const doneStudents = res.data.data.filter((s) => s.status === "Done");

      // setStudents(doneStudents);
      const appliedStudents = res.data.data.filter(
        (s) =>
          s.status === "Pending-Approval" ||
          s.status === "Payment-Done" ||
          s.status === "Done" ||
          s.OfflinePayment,
      );

      setStudents(appliedStudents);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStudents = students.filter((lead) => {
    const search = searchTerm.toLowerCase();

    return (
      `${lead.FirstName} ${lead.LastName}`.toLowerCase().includes(search) ||
      lead.EmailAddress?.toLowerCase().includes(search) ||
      lead.Phone?.toLowerCase().includes(search) ||
      lead.whoCreated?.name?.toLowerCase().includes(search) ||
      lead.whoCreated?.code?.toLowerCase().includes(search)
    );
  });

  const handleDownloadStudents = () => {
    try {
      const headers = [
        "Name",
        "Email",
        "Mobile",
        "Course",
        "Specialization",
        "Student ID",
        "Status",
        "Created On",
      ];

      const rows = filteredStudents.map((lead) => [
        `${lead.FirstName || ""} ${lead.LastName || ""}`,
        lead.EmailAddress || "",
        lead.Phone || "",
        lead.Program?.name || "",
        lead.SubCourse?.name || "",
        lead.StudentId || "",
        lead.status || "",
        new Date(lead.createdAt).toLocaleString(),
      ]);

      const csvContent = [headers, ...rows]
        .map((row) => row.map((item) => `"${item}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      saveAs(blob, "Students_Data.csv");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Students</h2>

          <div className="flex gap-3 items-center">
            <div className="relative w-[25rem]">
              <input
                type="text"
                placeholder="Search by Name, Email, Mobile or Partner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Clear Button */}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-lg"
                >
                  ❌
                </button>
              )}
            </div>

            {/* ➕ ADD LEAD */}
            <NavLink
              to={`/${LoggedUser.role}/lead-generate`}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 shadow-sm transition"
            >
              + Add Lead
            </NavLink>

            {/* 📥 DOWNLOAD */}
            <button
              onClick={handleDownloadStudents}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Download
            </button>
          </div>
        </div>
        {/* <div className="overflow-x-auto max-w-screen-lg bg-white shadow rounded"> */}
        <div className="overflow-x-auto bg-white shadow rounded">
          <div className="w-full ">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-gray-100 z-10 shadow-sm">
                <tr className="text-xs uppercase tracking-wide whitespace-nowrap">
                  {[
                    "Activity",
                    "Status",
                    "Created On",
                    "Name",
                    "Email",
                    "Mobile",
                    "Program Level",
                    "Course",
                    "Specialization",
                    "DOB",
                    "Country",
                    "State",
                    "District",
                    "Student ID",
                    "Partner",
                    "RM",
                  ].map((head) => (
                    <th key={head} className="px-4 py-3 text-left">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredStudents.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition">
                    {/* Activity */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => setActivityOpen(true)}
                        className="text-blue-600 hover:bg-blue-600 hover:text-white p-1 rounded"
                      >
                        <TbCalendarWeek size={22} />
                      </button>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          lead.status === "Done"
                            ? "bg-green-100 text-green-700"
                            : lead.status === "Payment-Done"
                              ? "bg-yellow-100 text-yellow-700"
                              : lead.status === "Pending-Approval"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.FirstName} {lead.LastName}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.EmailAddress}
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.Phone}
                    </td>

                    {/* Program Level */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.Program_Level || "-"}
                    </td>

                    {/* Course */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.Program?.name || "-"}
                    </td>

                    {/* Specialization */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.SubCourse?.name || "-"}
                    </td>

                    {/* DOB */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.DateOfBirth
                        ? new Date(lead.DateOfBirth).toLocaleDateString("en-GB")
                        : "-"}
                    </td>
                    {/* Country */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.Country || "-"}
                    </td>

                    {/* State */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.State || "-"}
                    </td>

                    {/* District */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.District || "-"}
                    </td>

                    {/* Student ID */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.StudentId}
                    </td>

                    {/* Partner */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.whoCreated
                        ? `${lead.whoCreated.code || "N/A"} (${lead.whoCreated.name || "-"})`
                        : "-"}
                    </td>

                    {/* RM */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.ReportingManager?.name || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <span>
            Showing 1 to {students.length} of {students.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
              Previous
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded">1</span>
            <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
              Next
            </button>
          </div>
        </div>
      </div>
      {ActivityOpen && <ActivityModal onClose={() => setActivityOpen(false)} />}
      {ProspRegOpen && <ProspRegModal onClose={() => setProspRegOpen(false)} />}
    </>
  );
};

export default Showstudents;
