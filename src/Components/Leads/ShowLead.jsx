import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { TbCalendarWeek } from "react-icons/tb";
import { HiOutlineExternalLink } from "react-icons/hi";
import useLeads from "../../CustomHooks/Leads/useLeads";
import ActivityModal from "./Activity/ShowActivity";
import ProspRegModal from "./ProspReg/ProspRegModal";
import { useDispatch, useSelector } from "react-redux";
import { saveAs } from "file-saver";
import { HiDownload } from "react-icons/hi";

const ShowLead = () => {
  const {
    leads,
    page,
    setPage,
    limit,
    total,
    from,
    to,
    hasNextPage,
    hasPrevPage,
    loading,
  } = useLeads();

  const [activityOpen, setActivityOpen] = useState(false);
  const [prospRegOpen, setProspRegOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const LoggedUser = useSelector((state) => state.user);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  };

  const handleDownloadLeads = () => {
    try {
      const headers = [
        "Sr No",
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
        "Lead Owner",
        "Source",
        "RM",
        "Created On",
        "Status",
      ];

      const rows = filteredLeads.map((lead, index) => [
        index + 1,
        `${lead.FirstName || ""} ${lead.LastName || ""}`,
        lead.EmailAddress || "",
        lead.Phone || "",
        lead.Program_Level || "",
        lead.Program?.name || "",
        lead.SubCourse?.name || "",
        lead.DateOfBirth || "",
        lead.Country || "",
        lead.State || "",
        lead.District || "",
        lead.StudentId || "",
        lead.whoCreated?.name || "",
        lead.Source || "",
        lead.ReportingManager?.name || "",
        new Date(lead.createdAt).toLocaleString(),
        lead.status || "",
      ]);

      const csvContent = [headers, ...rows]
        .map((row) => row.map((item) => `"${item}"`).join(","))
        .join("\n");
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      saveAs(blob, "Leads_Data.csv");
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const search = searchTerm.toLowerCase();

    return (
      `${lead.FirstName} ${lead.LastName}`.toLowerCase().includes(search) ||
      lead.whoCreated?.code?.toLowerCase().includes(search) || // ✅ NEW
      lead.whoCreated?.name?.toLowerCase().includes(search) || // optional
      lead.EmailAddress?.toLowerCase().includes(search) ||
      lead.Phone?.toLowerCase().includes(search)
    );
  });

  return (
    <section className="mt-2 mx-2 rounded-xl">
      {/* ===================== TOP HEADER ===================== */}
      <div
        className="w-full flex items-center justify-between px-6 py-4 rounded-xl mb-4"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--soft-shadow)",
          borderRadius: "var(--card-radius)",
        }}
      >
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
          Leads
        </h2>

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
          <NavLink
            to={`/${LoggedUser.role}/lead-generate`}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 shadow-sm transition"
          >
            + Add Lead
          </NavLink>

          <button
            onClick={handleDownloadLeads}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition flex items-center gap-2"
          >
            <HiDownload size={16} />
            <span className="hidden sm:inline">Download</span>
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
        <div className="h-[calc(100vh-260px)] overflow-auto custom-scroll pb-4">
          <table className="min-w-full text-sm">
            {/* ===================== TABLE HEADER ===================== */}
            <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10 shadow-sm">
              <tr className="text-gray-700  whitespace-nowrap dark:text-gray-200 text-xs uppercase tracking-wide">
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
                  "Lead Owner",
                  "Source",
                  "RM",
                ].map((head) => (
                  <th key={head} className="px-4 py-3 text-left">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            {/* ===================== TABLE BODY ===================== */}
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="16" className="text-center py-10 text-gray-600">
                    Loading...
                  </td>
                </tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    {/* Activity */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setActivityOpen(true)}
                        className="text-blue-600 hover:bg-blue-600 hover:text-white p-1 rounded transition"
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
                            : lead.status === "ShowAllLeads"
                              ? "bg-blue-100 text-blue-700"
                              : lead.status === "Admission"
                                ? "bg-pink-100 text-pink-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {/* {lead.status === "Prosp/Reg" ? (
                          <button
                            onClick={() => setProspRegOpen(true)}
                            className="hover:underline"
                          >
                            {lead.status}
                          </button>
                        ) : (
                          lead.status
                        )} */}
                        {lead.status === "Prosp/Reg" ? (
                          <button
                            onClick={() => setProspRegOpen(true)}
                            className="hover:underline"
                          >
                            {lead.status}
                          </button>
                        ) : lead.status === "Admission" ? (
                          <Link
                            to={`/${LoggedUser.role}/lead-application-form`}
                            state={{ studentId: lead.StudentId }}
                            className="hover:underline text-pink-700 font-semibold"
                          >
                            Apply Admission
                          </Link>
                        ) : (
                          lead.status
                        )}
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.FirstName} {lead.LastName}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.EmailAddress}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.Phone}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.Program_Level || "-"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.Program?.name || "-"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.SubCourse?.name || "-"}
                    </td>

                    <td className="px-4 py-3  whitespace-nowrap">
                      {formatDate(lead.DateOfBirth)}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.Country || "-"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.State || "-"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.District || "-"}
                    </td>

                    {/* Student ID with external link */}
                    {/* <td className="px-4 py-3 whitespace-nowrap">
                      <a
                        href="https://application.amityonline.com/admission/home/signIn"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        {lead.StudentId}
                        <HiOutlineExternalLink size={14} />
                      </a>
                    </td> */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.isUniversityAPIHit ? (
                        <a
                          href="https://application.amityonline.com/admission/home/signIn"
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          {lead.StudentId}
                          <HiOutlineExternalLink size={14} />
                        </a>
                      ) : (
                        <span className="text-gray-700 dark:text-gray-300">
                          {lead.StudentId}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3  whitespace-nowrap">
                      {/* {lead.whoCreated?.name || "-"} */}
                      {lead.whoCreated
                        ? `${lead.whoCreated.code || "N/A"} (${lead.whoCreated.name || "-"})`
                        : "-"}
                    </td>

                    <td className="px-4 py-3  whitespace-nowrap">
                      {lead.Source || "-"}
                    </td>

                    <td className="px-4 py-3  whitespace-nowrap">
                      {lead.ReportingManager?.name || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="16"
                    className="text-center py-10 text-gray-500 dark:text-gray-300 font-medium"
                  >
                    No Leads Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== PAGINATION ===================== */}
      <div className="flex justify-between items-center mt-4 px-1 text-sm text-gray-700 dark:text-gray-300">
        <span>
          Showing <b>{from}</b> to <b>{to}</b> of <b>{total}</b> entries
        </span>

        <div className="flex items-center gap-2">
          {/* Prev */}
          <button
            disabled={!hasPrevPage}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className={`px-3 py-1.5 rounded-lg shadow-sm transition ${
              hasPrevPage
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Previous
          </button>

          <span className="px-4 py-1.5 bg-blue-600 text-white rounded-lg shadow">
            {page}
          </span>

          {/* Next */}
          <button
            disabled={!hasNextPage}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-3 py-1.5 rounded-lg shadow-sm transition ${
              hasNextPage
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* ===================== MODALS ===================== */}
      {activityOpen && <ActivityModal onClose={() => setActivityOpen(false)} />}

      {prospRegOpen && <ProspRegModal onClose={() => setProspRegOpen(false)} />}
    </section>
  );
};

export default ShowLead;
