import React, { useState, useEffect } from "react";
import { TbCalendarWeek } from "react-icons/tb";
import ActivityModal from "./Activity/ShowActivity";
import axios from "axios";
import { saveAs } from "file-saver";
import { NavLink } from "react-router-dom";

const ShowAllLeads = () => {
  const [activityOpen, setActivityOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get-all-leads`,
        {
          withCredentials: true,
        },
      );

      setLeads(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const search = searchTerm.toLowerCase();

    return (
      `${lead.FirstName} ${lead.LastName}`.toLowerCase().includes(search) ||
      lead.EmailAddress?.toLowerCase().includes(search) ||
      lead.Phone?.toLowerCase().includes(search) ||
      lead.whoCreated?.name?.toLowerCase().includes(search) ||
      lead.whoCreated?.code?.toLowerCase().includes(search)
    );
  });

  const handleDownloadLeads = () => {
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

      const rows = filteredLeads.map((lead) => [
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

      saveAs(blob, "All_Leads.csv");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section className="mt-2 mx-2 rounded-xl">
        {/* ===================== TOP HEADER ===================== */}
        <div className="w-full flex items-center justify-between px-6 py-4 rounded-xl mb-4">
          <h2 className="text-base font-semibold">All Leads</h2>

          <div className="flex gap-3 items-center">
            <div className="relative w-[25rem]">
              <input
                type="text"
                // placeholder="Search by Name, Email, Mobile"
                placeholder="Search by Name, Email, Mobile or Lead owner"
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
              to="/admin/lead-generate"
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              + Add Lead
            </NavLink>

            {/* 📥 DOWNLOAD */}
            <button
              onClick={handleDownloadLeads}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Download
            </button>
          </div>
        </div>
        {/* ===================== TABLE WRAPPER ===================== */}
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            background: "var(--surface)",
            boxShadow: "var(--soft-shadow)",
          }}
        >
          <div className="overflow-auto max-h-[calc(100vh-260px)] custom-scroll">
            <table className="min-w-full text-sm text-gray-800 dark:text-gray-200">
              {/* ------------------- TABLE HEADER ------------------- */}
              <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10 shadow-sm">
                <tr className="text-xs uppercase text-gray-600 dark:text-gray-300 tracking-wide">
                  {[
                    "Activity",
                    "University",
                    "Status",
                    "Created On",
                    "Name",
                    "Mobile",
                    "Email",
                    "Course",
                    "Specialization",
                    "Student ID",
                    "Partner",
                    "DOB",
                    "Counselor",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-4 py-3 text-left whitespace-nowrap"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* ------------------- TABLE BODY ------------------- */}
              <tbody className="divide-y">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="15" className="text-center py-10">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
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
                      {/* University */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.university?.name || "-"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            lead.status === "Done"
                              ? "bg-green-100 text-green-700"
                              : lead.status === "Payment-Done"
                                ? "bg-yellow-100 text-yellow-700"
                                : lead.status === "Admission"
                                  ? "bg-pink-100 text-pink-700"
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

                      {/* Mobile */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.Phone}
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.EmailAddress}
                      </td>

                      {/* Course */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.Program?.name || "-"}
                      </td>

                      {/* Specialization */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.SubCourse?.name || "-"}
                      </td>

                      {/* Student ID */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.StudentId}
                      </td>

                      {/* Partner */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.whoCreated
                          ? `${lead.whoCreated.code} (${lead.whoCreated.name})`
                          : "-"}
                      </td>

                      {/* DOB */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.DateOfBirth
                          ? new Date(lead.DateOfBirth).toLocaleDateString(
                              "en-GB",
                            )
                          : "-"}
                      </td>

                      {/* Counselor */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.ReportingManager?.name || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===================== PAGINATION ===================== */}
        <div className="flex justify-between items-center mt-4 px-1 text-sm text-gray-600 dark:text-gray-300">
          <span>
            Showing <b>1</b> to <b>{leads.length}</b> of <b>{leads.length}</b>{" "}
            entries
          </span>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
              Previous
            </button>

            <span className="px-4 py-1.5 bg-blue-600 text-white rounded-lg shadow">
              1
            </span>

            <button className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
              Next
            </button>
          </div>
        </div>
      </section>

      {/* ===================== MODAL ===================== */}
      {activityOpen && <ActivityModal onClose={() => setActivityOpen(false)} />}
    </>
  );
};

export default ShowAllLeads;
