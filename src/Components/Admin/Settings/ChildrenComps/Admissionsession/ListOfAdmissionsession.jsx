import React, { useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import UpdateAdmissionsession from "./UpdateAdmissionsession";
import ToggleButton from "../../../../../Common/ToggleButton";
import Loader from "../../../../../Helper/Loader";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";

const ListOfAdmissionsession = ({
  AdmissionsessionListData,
  AdmissionsessionCurrentPage,
  AdmissionsessionTotalPages,
  AdmissionsessionLimit,
  AdmissionsessionLoading,
  AdmissionsessionTotalDocs,
  FetchAdmissionsessionByPagination,
  handleLimitChange,
  handlePageChange,
}) => {
  const [UpdateAdmissionsessionButton, setUpdateAdmissionsessionButton] =
    useState(false);

  const [EditUpdateAdmissionsession, setEditUpdateAdmissionsession] =
    useState(null);

  const HandleOpenUpdateAdmissionsession = () => {
    setUpdateAdmissionsessionButton(true);
  };
  const HandleCloseUpdateAdmissionsession = () => {
    setUpdateAdmissionsessionButton(false);
  };

  // status permission
  const HandleToggle = async (id, field, value) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/AdmissionSessionToggle`,
        { id, field, value },
        { withCredentials: true },
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchAdmissionsessionByPagination();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const HandleAdmissionSessiontatusToggleYes = (data) => {
    HandleUpdateStatusToggleAdmissionsession(data?._id, true);
  };
  const HandleAdmissionSessionStatusToggleNo = (data) => {
    HandleUpdateStatusToggleAdmissionsession(data?._id, false);
  };

  const HandleDeleteAdmissionsession = (data) => {
    Swal.fire({
      title: `Do you want to Delete ${data?.name} `,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
      customClass: {
        // cancelButton: "custom-cancel-button",
        confirmButton: "custom-confirm-button",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        HandleDeleteAdmissionSessionAPI(data?._id, true);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const HandleDeleteAdmissionSessionAPI = async (
    AdmissionSessionId,
    BooleanValue,
  ) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteAdmissionSessionForm`,
        { AdmissionSessionId, BooleanValue },
        {
          withCredentials: true,
        },
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        Swal.fire({
          title: `Deleted Successfulyy!`,
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            FetchAdmissionsessionByPagination();
          }
        });
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };

  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  return (
    <>
      <div className="py-2.5 px-4">
        <div className=" min-w-full max-w-screen-sm  overflow-x-scroll ">
          {/* <!-- Table --> */}
          <table className="text-base text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm sticky top-0 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="p-2 mt-1">
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Name
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Exam Session
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Scheme
                    </h1>
                  </div>
                </th>

                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Status
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Current
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      LE Status
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      CT Status
                    </h1>
                  </div>
                </th>

                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Action
                    </h1>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {AdmissionsessionLoading ? (
                <div className="absolute">
                  <div className="flex justify-center items-center h-[60vh] w-[135vh] relative top-0 left-0">
                    <Loader />
                  </div>
                </div>
              ) : AdmissionsessionListData?.length > 0 ? (
                <>
                  {AdmissionsessionListData.map((data, i) =>
                    data.university === UniversityGetDataFromRedux?.id &&
                    !data?.isDeleted ? (
                      <tr key={i} className="">
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {data?.name}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {data?.examSession}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {data?.scheme?.name}
                        </td>
                        <td className="px-4 py-2">
                          <div className="w-[15vh] flex gap-y-1 flex-row">
                            <ToggleButton
                              ClickYes={() =>
                                HandleToggle(data._id, "isAvailable", true)
                              }
                              ClickNo={() =>
                                HandleToggle(data._id, "isAvailable", false)
                              }
                              StateUpdate={data?.isAvailable}
                            />
                            {data?.isAvailable ? "Yes" : "No"}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="w-[15vh] flex gap-y-1 flex-row">
                            <ToggleButton
                              ClickYes={() =>
                                HandleToggle(data._id, "isCurrent", true)
                              }
                              ClickNo={() =>
                                HandleToggle(data._id, "isCurrent", false)
                              }
                              StateUpdate={data?.isCurrent}
                            />
                            {data?.isCurrent ? "Yes" : "No"}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="w-[15vh] flex gap-y-1 flex-row">
                            <ToggleButton
                              ClickYes={() =>
                                HandleToggle(data._id, "isLEStatus", true)
                              }
                              ClickNo={() =>
                                HandleToggle(data._id, "isLEStatus", false)
                              }
                              StateUpdate={data?.isLEStatus}
                            />
                            {data?.isLEStatus ? "Yes" : "No"}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="w-[15vh] flex gap-y-1 flex-row">
                            <ToggleButton
                              ClickYes={() =>
                                HandleToggle(data._id, "isCTStatus", true)
                              }
                              ClickNo={() =>
                                HandleToggle(data._id, "isCTStatus", false)
                              }
                              StateUpdate={data?.isCTStatus}
                            />
                            {data?.isCTStatus ? "Yes" : "No"}
                          </div>
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          <button
                            onClick={() => {
                              HandleOpenUpdateAdmissionsession();
                              setEditUpdateAdmissionsession(data);
                            }}
                            className="text-base text-green-600 dark:text-green-500 hover:underline"
                          >
                            <AiTwotoneEdit size={20} />
                          </button>
                          <button
                            onClick={() => HandleDeleteAdmissionsession(data)}
                            className="text-base text-red-600 dark:text-red-500 hover:underline"
                          >
                            <MdDelete size={20} />
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <div className="absolute">
                        <div className="flex justify-center items-center h-[60vh] w-[120vh] relative top-0 left-0">
                          Not Created ANY Data Inside This University
                        </div>
                      </div>
                    ),
                  )}
                </>
              ) : UniversityGetDataFromRedux?.id === "" ? (
                <div className="absolute">
                  <div className="flex justify-center items-center h-[60vh] w-[120vh] relative top-0 left-0">
                    Select The University
                  </div>
                </div>
              ) : (
                <div className="absolute">
                  <div className="flex justify-center items-center h-[60vh] w-[120vh] relative top-0 left-0">
                    Not Created ANY Data Inside This University
                  </div>
                </div>
              )}

              {/* <!-- Additional rows here --> */}
            </tbody>
          </table>
          {AdmissionsessionListData?.length === 0 && (
            <>
              <span
                className="flex justify-center items-center h-[55vh] w-fit
                        relative -top-10 left-[55vh]  font-bold tracking-wider text-slate-500 "
              >
                Create Admissionsession
              </span>
            </>
          )}

          {/* <!-- Pagination -->/ */}
          <nav aria-label="Table navigation" className="relative">
            <div
              className="flex flex-col md:flex-row 
              justify-between items-start bg-white md:items-center space-y-3 md:space-y-0 px-4 py-3"
            >
              <span className="font-normal text-gray-500 dark:text-gray-400 flex gap-1 flex-row">
                Showing
                <span className="font-semibold text-gray-900 dark:text-white">
                  {AdmissionsessionListData?.length}
                </span>
                of
                <span className="font-semibold text-gray-900 dark:text-white">
                  {AdmissionsessionTotalDocs}
                </span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px">
                <li>
                  <button
                    onClick={() =>
                      handlePageChange(AdmissionsessionCurrentPage - 1)
                    }
                    className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <IoChevronBack />
                  </button>
                </li>
                <li>
                  <div className="flex items-center justify-center py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    {AdmissionsessionCurrentPage +
                      "-" +
                      AdmissionsessionTotalPages}
                  </div>
                </li>

                <li>
                  <button
                    onClick={() =>
                      handlePageChange(AdmissionsessionCurrentPage + 1)
                    }
                    className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <IoChevronForwardOutline />
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      {UpdateAdmissionsessionButton && (
        <span>
          <UpdateAdmissionsession
            EditUpdateAdmissionsession={EditUpdateAdmissionsession}
            FetchAdmissionsessionByPagination={
              FetchAdmissionsessionByPagination
            }
            HandleCloseUpdateAdmissionsession={
              HandleCloseUpdateAdmissionsession
            }
          />
        </span>
      )}
    </>
  );
};

export default ListOfAdmissionsession;
