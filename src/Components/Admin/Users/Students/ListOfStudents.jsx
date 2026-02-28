import React, { useState } from "react";
import { FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import image from "../../../../../public/logo.png";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";

const ListOfStudents = () => {
  const [passwordToggle, setpasswordToggle] = useState(false);

  const HandlePasswordToggle = (e) => {
    e.preventDefault();
    setpasswordToggle(!passwordToggle);
  };

  return (
    <>
      <section className="bg-slate-200 dark:bg-gray-900 px-2 sm:p-5 text-base">
        <div>
          {/* <!-- Start coding here --> */}
          <div className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg overflow-hidden">
            {/* <!-- Search Form --> */}
            <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 md:space-x-4 px-3 py-3">
              <div className="w-full md:w-1/2">
                <form className="flex items-center">
                  <label for="simple-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Search"
                      required=""
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* <!-- Table --> */}
            <div className="overflow-y-auto ScrollBarStyle2 pb-2.5 px-4 h-[50vh]">
              <div className="max-w-[146vh]">
                <table className="min-w-full text-base text-left text-slate-900 ">
                  <thead
                    className="text-sm sticky top-0 p-10 text-gray-700  capitalize bg-gray-50 dark:bg-gray-700 
        dark:text-gray-400"
                  >
                    <tr>
                      {[
                        "Sr No",
                        "Photo",
                        "Name",
                        "Alloted University",
                        "Password",
                        "Status",
                        "Actions",
                      ].map((header) => (
                        <th
                          scope="col"
                          className="px-4 py-2 whitespace-nowrap"
                          key={header}
                        >
                          <div className=" flex gap-3 flex-row">
                            <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                              {header}
                            </h1>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <div className="font-bold text-xl">
                      We Are Working On It
                    </div>
                  </tbody>
                </table>
              </div>
            </div>

            {/* <!-- Pagination -->/ */}
            <nav
              className="flex  flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 px-4 py-3"
              aria-label="Table navigation"
            >
              <span className="font-normal text-gray-500 dark:text-gray-400 flex gap-1 flex-row">
                Showing
                <span className="font-semibold text-gray-900 dark:text-white">
                  1-10
                </span>
                of
                <span className="font-semibold text-gray-900 dark:text-white">
                  1000
                </span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px">
                <li>
                  <button className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <IoChevronBack />
                  </button>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    1
                  </a>
                </li>

                <li>
                  <button className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <IoChevronForwardOutline />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
};

export default ListOfStudents;

// <tbody className="overflow-x-scroll ">
// <tr className="bg-white dark:bg-slate-900 dark:text-white text-sm border-b-4 border-b-slate-300 m-2 ">
//   {/* SR NO */}
//   <th
//     scope="row"
//     className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
//   >
//     <div className="w-[5vh] flex gap-y-1 flex-col items-start">
//       <div className="text-base text-gray-900 dark:text-white">1</div>
//     </div>
//   </th>

//   {/* Photo */}
//   <td className="px-2 py-2 align-top ">
//     <div className="w-[12vh] flex gap-y-1 flex-row">
//       <img
//         src={image}
//         alt=""
//         className="w-20 h-20 border "
//       />
//     </div>
//   </td>

//   {/* Name */}
//   <th
//     scope="row"
//     className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
//   >
//     <div className="w-[20vh] flex gap-y-1 flex-col items-start">
//       <div className="text-base text-gray-900 dark:text-white">
//         <span>Karthik</span>
//       </div>
//       <div className="text-xs">
//         <span>Center Id: </span>
//         <span>(123)</span>
//       </div>
//       <div className="text-xs">
//         <span>Email: </span>
//         <span>ABC@GMAIL.COM</span>
//       </div>
//       <div className="text-xs">
//         <span>Phone: </span>
//         <span>8287582716</span>
//       </div>
//     </div>
//   </th>

//   {/* Uniiversity */}
//   <th
//     scope="row"
//     className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
//   >
//     <div className="w-[40vh] flex gap-y-2 flex-col items-start">
//       <div className="text-sm">
//         <span>AMITY UNIVERSITY</span>
//         <span>(Online Program)</span>
//       </div>
//       <div className="text-sm">
//         <span>JAIN ONLINE</span>
//         <span> (Vocational program)</span>
//       </div>
//       <div className="text-sm">
//         <span>SUBHARTI UNIVERSITY</span>
//         <span> (Distance Programs)</span>
//       </div>
//     </div>
//   </th>

//   {/* Password */}
//   <td className="px-4 py-2 align-top">
//     <div className="w-[20vh] flex gap-y-1 flex-col text-left">
//       <div>
//         <span className="text-black font-semibold">
//           <div className="flex items-center outline-2  bg-white border border-gray-300 rounded-lg w-full">
//             <input
//               type={passwordToggle ? "password" : "text"}
//               name="Password"
//               id="base-input"
//               className=" text-base bg-slate-50 border
//     border-gray-200
// text-gray-900 rounded-lg focus:ring-blue-500
// focus:border-blue-500 block w-full px-2 py-1 "
//               required
//               readOnly
//             />
//             <div>
//               <button
//                 className="px-3 relative top-1 -ml-12 z-50"
//                 aria-label={
//                   passwordToggle
//                     ? "Hide password"
//                     : "Show password"
//                 }
//               >
//                 {passwordToggle ? (
//                   <FaEye
//                     size={18}
//                     onClick={HandlePasswordToggle}
//                   />
//                 ) : (
//                   <FaEyeSlash
//                     size={18}
//                     onClick={HandlePasswordToggle}
//                   />
//                 )}
//               </button>
//             </div>
//           </div>
//         </span>
//       </div>
//     </div>
//   </td>

//   {/* status */}
//   <th
//     scope="row"
//     className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
//   >
//     <div className="w-[20vh] flex gap-y-1 flex-col items-start">
//       <div className="text-base text-gray-900 dark:text-white">
//         <span>Yes / no</span>
//       </div>
//     </div>
//   </th>

//   {/* Actions */}
//   <td className="px-2 py-2  align-top ">
//     <div className=" flex gap-x-2 flex-row">
//       <button
//         title="Allot University"
//         className="font-medium text-blue-600  hover:underline"
//       >
//         <FaCirclePlus size={22} />
//       </button>
//       <button
//         title="Edit Student"
//         className="font-medium ml-2 text-green-600 hover:underline"
//       >
//         <FaEdit size={22} />
//       </button>
//       <button
//         title="Delete Student"
//         className="font-medium text-red-600 hover:underline"
//       >
//         <MdDeleteForever size={24} />
//       </button>
//     </div>
//   </td>
// </tr>
// </tbody>
