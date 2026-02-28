import React from "react";
import LeadsList from "./LeadsList";
import { TiUserAdd } from "react-icons/ti";
import { MdDownload } from "react-icons/md";
import { HiCloudUpload, HiOutlineDocumentDownload } from "react-icons/hi";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";

const AdminMainLeads = () => {
  return (
    <>
      <section className="top-0 dark:bg-slate-900 dark:text-white bg-slate-200 py-2 h-[calc(100vh-115px)] m-2 rounded-lg">
        <section className="bg-slate-200 dark:bg-gray-900 px-2 sm:p-5 text-sm">
          <div>
            {/* <!-- Start coding here --> */}
            <div className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg overflow-auto">
              {/* Title */}
              <div className="px-8  my-2 w-full h-10 dark:bg-slate-900 dark:text-white bg-slate-100 flex items-center justify-between">
                <div className="text-lg py-4 font-bold tracking-wide">
                  Leads
                </div>
                <div className="flex flex-row gap-3  items-center">
                  <button
                    title="Download Documents"
                    className="p-2 bg-slate-400 text-white rounded-full flex items-center"
                    // onClick={HandleButonOpenCreateSpecialization}
                  >
                    <HiOutlineDocumentDownload size={14} />
                  </button>
                  <button
                    title="Upload Excel"
                    className="p-2 bg-slate-400 text-white rounded-full flex items-center"
                    // onClick={HandleButonOpenCreateSpecialization}
                  >
                    <HiCloudUpload size={14} />
                  </button>
                  <button
                    title="Download Excel"
                    className="p-2 bg-slate-400 text-white rounded-full flex items-center"
                    // onClick={HandleButonOpenCreateSpecialization}
                  >
                    <MdDownload size={14} />
                  </button>
                  <button
                    title="Add Student"
                    className="p-2 bg-slate-400 text-white rounded-full flex items-center"
                    // onClick={HandleButonOpenCreateSpecialization}
                  >
                    <TiUserAdd size={14} />
                  </button>
                </div>
              </div>

              {/* <!-- Pagination --> */}
              <nav
                className="flex flex-row md:flex-row justify-between items-center space-y-3 md:space-y-0 px-4 py-2"
                aria-label="Table navigation"
              >
                <div className="w-full md:w-1/2">
                  <form className="flex items-center">
                    <label for="Application-search" className="sr-only">
                      Search
                    </label>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <IoMdSearch size={22} />
                      </div>
                      <input
                        type="text"
                        name="SearchListKeyWord"
                        // onChange={HandleInputSearchApplication}
                        id="Application-search"
                        className="bg-gray-50 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 
                      block w-full pl-10 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                      dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Search"
                        required=""
                      />
                    </div>
                  </form>
                </div>

                <div className="flex justify-center items-end gap-4 flex-row">
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex gap-1 flex-row">
                    Showing{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      1-10
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      1000
                    </span>
                  </span>
                  <ul className="inline-flex items-stretch -space-x-px">
                    <li>
                      <button className="flex items-center justify-center py-1.5 px-3 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <IoChevronBack />
                      </button>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center justify-center py-1 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        1
                      </a>
                    </li>
                    <li>
                      <button className="flex items-center justify-center py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <IoChevronForwardOutline />
                      </button>
                    </li>
                  </ul>
                </div>
              </nav>

              {/* <!-- Table --> */}
              <div className="overflow-y-auto ScrollBarStyle2 pb-2.5 px-4 h-[50vh]">
                <div className="max-w-[146vh] ">
        <div className="text-center font-bold text-xl m-4">We Are Working On It</div>

                  {/* <table className="min-w-full text-base text-left text-slate-900 ">
                    <thead
                      className="text-sm sticky top-0 p-10 text-gray-700  capitalize bg-gray-50 dark:bg-gray-700 
                  dark:text-gray-400"
                    >
                      <tr>
                        {[
                          "Sr No",
                          "Actions",
                          "Photo",
                          "Student",
                          "Status",
                          "Enrollment No",
                          "OA Number",
                          "Admission Details",
                          "Permissions",
                          "Center Details",
                          "Form",
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
                    <LeadsList />{" "}
                  </table> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default AdminMainLeads;
