import React, { useState } from "react";
import { TbCalendarWeek } from "react-icons/tb";
import ActivityModal from "./Activity/ShowActivity";

const leads = [];

const ShowAllLeads = () => {

  const [activityOpen, setActivityOpen] = useState(false);

  return (
    <>
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
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            All Leads
          </h2>
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
                    "University",
                    "Activity",
                    "Status",
                    "Created On",
                    "Show All Leads Date",
                    "Name",
                    "Mobile",
                    "Email",
                    "Course",
                    "Specialization",
                    "Student ID",
                    "Partner",
                    "DOB",
                    "Company",
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
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan="14"
                      className="text-center py-10 text-gray-500 dark:text-gray-300"
                    >
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setActivityOpen(true)}
                          className="text-blue-600 hover:bg-blue-600 hover:text-white p-1 rounded transition"
                        >
                          <TbCalendarWeek size={22} />
                        </button>
                      </td>

                      {/* University */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.university?.name || "-"}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold ${
                            lead.status === "Done"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.createdOn}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.regDate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.mobile}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.course}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.specialization}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{lead.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.partner}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.dob}
                      </td>
                      <td className="px-4 py-3 max-w-sm truncate">
                        {lead.company}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.counselor}
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
}

export default ShowAllLeads;