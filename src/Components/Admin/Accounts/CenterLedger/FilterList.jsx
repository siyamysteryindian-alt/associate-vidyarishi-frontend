import React from "react";

const FilterList = ({ AllStudentListData = [], filters }) => {

  const filteredStudents = AllStudentListData.filter((student) => {
    const centerMatch =
      !filters.CenterFilter ||
      student?.center?.name?.toLowerCase() ===
        filters.CenterFilter.toLowerCase();

    const admissionMatch =
      !filters.AdmissionFilter ||
      student?.admissionSession?.name?.toLowerCase() ===
        filters.AdmissionFilter.toLowerCase();

    return centerMatch && admissionMatch;
  });

  if (filteredStudents.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
            No Records Found
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="text-sm">
      {filteredStudents.map((data, i) => {

        const fee = data?.SubCourse?.admissionFeeId?.feeAmount ?? "-";
        const paymentStatus = data?.payments?.paymentStatus ?? "";

        const displayStatus =
          paymentStatus === "approved"
            ? "Approved"
            : paymentStatus === "pending"
            ? "Pending"
            : paymentStatus === "rejected"
            ? "Rejected"
            : "—";

        return (
          <tr
            key={data?._id ?? i}
            className="bg-white dark:bg-slate-900 dark:text-white text-sm border-b"
          >
            {/* SR NO */}
            <th
              scope="row"
              className="px-4 py-1.5 whitespace-nowrap align-top text-sm font-medium text-gray-900 dark:text-white"
            >
              {i + 1}
            </th>

            {/* Student Name */}
            <td className="px-4 py-1.5 align-top">
              <div className="font-semibold text-sm truncate">
                {data?.fullName || "—"}
              </div>
            </td>

            {/* Admission Type */}
            <td className="px-4 py-1.5 align-top">
              <div className="text-sm truncate">
                {data?.admissionType?.name || "—"}
              </div>
            </td>

            {/* Admission Session */}
            <td className="px-4 py-1.5 align-top">
              <div className="text-sm truncate">
                {data?.admissionSession?.name || "—"}
              </div>
            </td>

            {/* Fee */}
            <td className="px-4 py-1.5 align-top text-sm font-semibold">
              ₹ {fee}
            </td>

            {/* Status */}
            <td className="px-4 py-1.5 align-top text-sm">
              <span
                className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                  displayStatus === "Approved"
                    ? "bg-green-100 text-green-800"
                    : displayStatus === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : displayStatus === "Rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {displayStatus}
              </span>
            </td>

            {/* Action */}
            <td className="px-4 py-1.5 align-top text-sm">
              —
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default FilterList;