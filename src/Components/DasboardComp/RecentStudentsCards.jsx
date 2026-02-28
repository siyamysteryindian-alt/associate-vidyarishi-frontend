import React from "react";
import { format } from "date-fns";

const RecentStudentsCards = ({ students = [], title }) => {
  return (
    <div className="mb-6 bg-white px-4 py-4 rounded-xl">
      <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-100 flex items-center justify-between">
        <span>{title}</span>
        <span className="text-sm text-gray-500">({students.length})</span>
      </h3>

      <div className="rounded-2xl overflow-hidden shadow bg-white dark:bg-gray-800">
        <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-60 overflow-y-auto">
          {students.length > 0 ? (
            students.map((student) => (
              <div
                key={student._id}
                className="flex items-start justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200">
                    {student.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {student.fullName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {student.university?.name || "Unknown University"} •{" "}
                      {student.Course?.shortName || "Program"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  <div>
                    Center:{" "}
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      {student.center?.name || "—"}
                    </span>
                  </div>
                  <div>
                    {student.createdAt
                      ? format(new Date(student.createdAt), "yyyy-MM-dd")
                      : "—"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No recent students
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentStudentsCards;
