import React, { useState } from "react";
import { TbCalendarWeek } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import ActivityModal from "../Leads/Activity/ShowActivity";
import ProspRegModal from "../Leads/ProspReg/ProspRegModal";

const leads = [
];

const Showstudents = () => {
  const [ActivityOpen, setActivityOpen] = useState(false);
  const [ProspRegOpen, setProspRegOpen] = useState(false);

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Students</h2>
          {/* <div className="flex gap-2">
            <NavLink
              to={"/admin/lead-generate"}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Add Lead
            </NavLink>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition">
              Download
            </button>
          </div> */}
        </div>

        <div className="overflow-x-auto max-w-screen-lg bg-white shadow rounded">
          <div className="w-full ">
            <table className=" text-sm text-gray-800">
              <thead className="bg-gray-100">
                <tr className="whitespace-nowrap">
                  <th className="px-4 py-3 text-left w-full">Activity</th>
                  <th className="px-4 py-3 text-left w-full">Status</th>
                  <th className="px-4 py-3 text-left w-full">Created On</th>

                  <th className="px-4 py-3 text-left w-full">Prosp/Reg Date</th>
                  <th className="px-4 py-3 text-left w-full">Name</th>
                  <th className="px-4 py-3 text-left w-full">Mobile</th>

                  <th className="px-4 py-3 text-left w-full">Email</th>
                  <th className="px-4 py-3 text-left w-full">Course</th>
                  <th className="px-4 py-3 text-left w-full">Specialization</th>

                  <th className="px-4 py-3 text-left w-full">Student ID</th>
                  <th className="px-4 py-3 text-left w-full">Partner</th>
                  <th className="px-4 py-3 text-left w-full">DOB</th>
                  <th className="px-4 py-3 text-left w-full">Company</th>
                  <th className="px-4 py-3 text-left w-full">Counselor</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b last:border-none">
                    <td className="px-4 py-2 ml-2 w-full">
                      <button
                        onClick={() => setActivityOpen(true)}
                        className="text-blue-600 hover:text-white rounded hover:bg-blue-700 transition"
                      >
                        <TbCalendarWeek size={26} />{" "}
                      </button>
                    </td>
                    <td className="px-4 py-2 w-full">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          lead.status === "Done"
                            ? "bg-green-100 text-green-700"
                            : lead.status === "Prosp/Reg"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 truncate max-w-xs">
                      {lead.createdOn}
                    </td>

                    <td className="px-4 py-2 truncate max-w-xs">
                      {lead.regDate}
                    </td>
                    <td className="px-4 py-2 truncate max-w-xs">{lead.name}</td>
                    <td className="px-4 py-2 truncate max-w-xs">
                      {lead.mobile}
                    </td>

                    <td className="px-4 py-2 truncate max-w-xs">
                      {lead.email}
                    </td>
                    <td className="px-4 py-2 truncate max-w-xs">
                      {lead.course}
                    </td>
                    <td className="px-4 py-2 truncate max-w-xs">
                      {lead.specialization}
                    </td>

                    <td className="px-4 py-2 truncate max-w-xs">{lead.StudentId}</td>
                    <td className="px-4 py-2 truncate max-w-xs">
                      {lead.partner}
                    </td>
                    <td className="px-4 py-2 truncate max-w-xs">{lead.dob}</td>
                    <td className="px-4 py-2 truncate max-w-sm">
                      {lead.company}
                    </td>
                    <td className="px-4 py-2 truncate max-w-xs">
                      {lead.counselor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <span>
            Showing 1 to {leads.length} of {leads.length} entries
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
