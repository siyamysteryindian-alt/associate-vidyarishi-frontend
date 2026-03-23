import React from "react";

const ListOf_Re_Reg_Students = ({
  AllStudentListData = [],
  LoggedUserData,
  handleRefund,
}) => {
  const cancelledStudents = (AllStudentListData || []).filter(
    (student) =>
      student?.status?.admissionCancelDate &&
      student?.status?.admissionCancelDate.trim() !== "",
  );

  if (cancelledStudents.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={7}
            className="px-4 py-8 text-center text-sm text-gray-500"
          >
            No Cancelled Students Available
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="text-sm">
      {cancelledStudents.map((data, i) => {
        const key = data?._id ?? `cancelled-${i}`;
        const fee = data?.SubCourse?.admissionFeeId?.feeAmount ?? "-";

        return (
          <tr
            key={key}
            className="bg-white dark:bg-slate-900 dark:text-white text-sm border-b"
          >
            {/* SR NO */}
            <th
              scope="row"
              className="px-4 py-1.5 whitespace-nowrap align-top text-sm font-medium text-gray-900 dark:text-white"
            >
              {i + 1}
            </th>

            {/* Student */}
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

            {/* Session */}
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
              <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                Cancelled
              </span>
            </td>

            <td className="flex gap-2">
              {LoggedUserData?.role === "center" && (
                <button
                  onClick={() => handleReApply(student)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Re-Apply
                </button>
              )}

              {(LoggedUserData?.role === "Admin" ||
                LoggedUserData?.role === "operation-manager" ||
                LoggedUserData?.role === "university-manager") && (
                <button
                  onClick={() => handleRefund(student)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Refund
                </button>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default ListOf_Re_Reg_Students;

// {/* <!-- Table --> */}
// <tbody className="overflow-x-scroll ">
//   <tr className="bg-white dark:bg-slate-900 dark:text-white text-sm border-b-4 border-b-slate-300 m-2 ">
//     {/* SR NO */}
//     <th
//       scope="row"
//       className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
//     >
//       <div className="w-[5vh] flex gap-y-1 flex-col items-start">
//         <div className="text-base dark:text-white text-gray-900">1</div>
//       </div>
//     </th>

//     {/* Photo */}
//     <td className="px-2 py-2 align-top ">
//       <div className="w-[12vh] flex gap-y-1 flex-row">
//         <img src={image} alt="" className="w-20 h-20 border " />
//       </div>
//     </td>

//     {/* transaction id */}
//     <th
//       scope="row"
//       className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
//     >
//       <div className="w-[20vh] flex gap-y-1 flex-col items-start">
//         <div className="text-base dark:text-white text-gray-900">
//           <span>Re-Register</span>
//           <span> (00045)</span>
//         </div>
//       </div>
//     </th>

//     {/* Gateway id */}
//     <th
//       scope="row"
//       className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
//     >
//       <div className="w-[20vh] flex gap-y-1 flex-col items-start">
//         <div className="text-base dark:text-white text-gray-900">
//           <span>Re-Register</span>
//           <span> (00045)</span>
//         </div>
//       </div>
//     </th>

//     {/* mode */}
//     <th
//       scope="row"
//       className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
//     >
//       <div className="w-[20vh] flex gap-y-1 flex-col items-start">
//         <div className="text-base dark:text-white text-gray-900">
//           <span>Re-Register</span>
//           <span> (00045)</span>
//         </div>
//       </div>
//     </th>

//     {/* Bank Name */}
//     <th
//       scope="row"
//       className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
//     >
//       <div className="w-[20vh] flex gap-y-1 flex-col items-start">
//         <div className="text-base dark:text-white text-gray-900">
//           <span>Re-Register</span>
//           <span> (00045)</span>
//         </div>
//       </div>
//     </th>

//     {/* Amount */}
//     <td className="px-4 py-2 align-top">
//       <div className="w-[15vh] flex gap-y-1 flex-row">Permission</div>
//     </td>

//     {/* STUDENT */}
//     <td className="px-4 py-2 align-top">
//       <div className="w-[10vh] flex gap-y-1 flex-col">
//         <div>1 </div>
//       </div>
//     </td>

//     {/* Payment By  */}
//     <td className="px-4 py-2 align-top">
//       <div className="w-[20vh] flex gap-y-1 flex-col font-bold">
//         <div>SK ACADEMY </div>
//       </div>
//     </td>

//     {/* Date  */}
//     <td className="px-4 py-2 align-top">
//       <div className="w-[15vh] flex gap-y-1 flex-col font-bold">
//         <div>20/09/2024</div>
//       </div>
//     </td>

//     {/* Status */}
//     <td className="px-4 py-2 align-top ">
//       <div className="w-[15vh] flex gap-y-1 flex-col">
//         <div>
//           <span className="text-green-600 font-bold"> Approve</span>
//         </div>
//       </div>
//     </td>

//     {/* Actions */}
//     <td className="px-4 py-2  align-top ">
//       <div className="w-[15vh] flex gap-3 flex-row">
//         <button
//           title="Approve"
//           className="font-medium text-green-600 dark:text-green-500 hover:underline"
//         >
//           <FcApproval size={20} />
//         </button>
//         <button
//           title="Reject"
//           className="font-medium text-red-600 dark:text-red-500 hover:underline"
//         >
//           <MdCancel size={18} />
//         </button>
//         <button
//           title="Edit Payment"
//           className="font-medium text-green-600 dark:text-green-500 hover:underline"
//         >
//           <AiTwotoneEdit size={18} />
//         </button>
//         <button
//           title="Delete Payment"
//           className="font-medium text-red-600 dark:text-red-500 hover:underline"
//         >
//           <MdDelete size={18} />
//         </button>
//       </div>
//     </td>
//   </tr>
// </tbody>
