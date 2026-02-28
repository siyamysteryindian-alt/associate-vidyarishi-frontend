import React, { useMemo, useState } from "react";
import Papa from "papaparse";

/**
 * RecentStudentsTable - polished UI version
 * - sticky header
 * - search with icon
 * - responsive table with truncation
 * - export CSV button
 * - max height with internal scroll
 */
const RecentStudentsTable = ({ students = [] }) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return students || [];
    return (students || []).filter((s) =>
      (s.fullName || "").toLowerCase().includes(q)
    );
  }, [students, search]);

  const handleExport = () => {
    const csv = Papa.unparse(
      filtered.map((s) => ({
        Name: s.fullName || "N/A",
        Email: s.address?.email || "N/A",
        University: s.university?.name || "N/A",
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "recent_students.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <section className="mt-6">
      {/* header: search + actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div className="relative w-full sm:w-72">
          {/* search icon */}
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M21 21l-4.35-4.35M10.75 18.5a7.75 7.75 0 1 1 0-15.5 7.75 7.75 0 0 1 0 15.5z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[var(--color-purple)] focus:border-[var(--color-purple)] transition"
            aria-label="Search students"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-purple)] hover:brightness-95 text-white text-sm shadow"
            aria-label="Export CSV"
          >
            {/* download icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M12 3v12M12 15l-4-4M12 15l4-4M5 21h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* table container */}
      <div className="w-full overflow-x-auto border rounded-lg shadow-sm">
        <div
          className="max-h-[360px] overflow-y-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-200 w-48">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-200 w-64">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-200">
                  University
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filtered.length > 0 ? (
                filtered.map((s, i) => (
                  <tr
                    key={s._id || i}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-200">
                          {(s.fullName || "U").charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {s.fullName || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {s.center?.name ? `${s.center.name}` : ""}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700 dark:text-gray-200 truncate">
                        {s.address?.email || "N/A"}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {s.university?.name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {s.Course?.shortName || ""}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default RecentStudentsTable;
