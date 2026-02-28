import React from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdCancel, MdDelete } from "react-icons/md";
import image from "../../../../../public/logo.png";
import { FcApproval } from "react-icons/fc";

const LiftOfOnlinePayment = () => {
  return (
    <>
      {/* <!-- Table --> */}
      <div className="font-bold whitespace-nowrap text-xl mt-4">
        We Are Processing On it
      </div>
    </>
  );
};

export default LiftOfOnlinePayment;

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
//           <span>Karthik</span>
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
//           <span>Karthik</span>
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
//           <span>Karthik</span>
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
//           <span>Karthik</span>
//           <span> (00045)</span>
//         </div>
//       </div>
//     </th>

//     {/* Amount */}
//     <td className="px-4 py-2 align-top">
//       <div className="w-[15vh] flex gap-y-1 flex-row">Permission</div>
//     </td>

//     {/* Payment By  */}
//     <td className="px-4 py-2 align-top">
//       <div className="w-[20vh] flex gap-y-1 flex-col font-bold">
//         <div>SK ACADEMY </div>
//       </div>
//     </td>

//     {/* STUDENT */}
//     <td className="px-4 py-2 align-top">
//       <div className="w-[10vh] flex gap-y-1 flex-col">
//         <div>1 </div>
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
