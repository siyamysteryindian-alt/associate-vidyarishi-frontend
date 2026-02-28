import React, { useEffect, useState, useCallback, useRef } from "react";
import { FaEdit } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import UpdateCounsellors from "./UpdateCounsellors";
import ToggleButton from "../../../../Common/ToggleButton";
import Loader from "../../../../Helper/Loader";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import axios from "axios";
import Allotuniversity from "../../../../Helper/Allotuniversity";
import AllotCenter from "../../../../Helper/AllotCenter";
import { useSelector } from "react-redux";
import UseGetLoggedUser from "../../../../CustomHooks/UseGetLoggedUser";

/**
 * ListOfCounsellors (styled/structured like your ListOperations)
 * - Debounced search
 * - Table for desktop, responsive cards for mobile (keeps behavior)
 * - Preserves API handlers and modal flows
 *
 * This variant pins a footer to the bottom of the viewport (fixed) and adds
 * adequate bottom-padding to the main scroll area so content isn't hidden.
 */
const ListOfCounsellors = ({
  CounsellorListData = [],
  CounsellorCurrentPage = 1,
  CounsellorTotalPages = 0,
  CounsellorLimit = 10,
  CounsellorLoading = false,
  CounsellorTotalDocs = 0,
  handleLimitChange,
  handlePageChange,
  FetchCounsellorByPagination,
}) => {
  // search query with debounce (same pattern as ListOperations)
  const [querySearchData, setQuerySearchData] = useState("");
  const searchTimeout = useRef(null);

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setQuerySearchData(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (typeof FetchCounsellorByPagination === "function") {
        FetchCounsellorByPagination(1, CounsellorLimit, value);
      }
    }, 350);
  };

  // modals and selections
  const [updateOpen, setUpdateOpen] = useState(false);
  const [editCounsellorData, setEditCounsellorData] = useState(null);

  const openUpdateCounsellor = (data) => {
    setEditCounsellorData(data);
    setUpdateOpen(true);
  };
  const closeUpdateCounsellor = () => {
    setEditCounsellorData(null);
    setUpdateOpen(false);
  };

  const [allotUniOpen, setAllotUniOpen] = useState(false);
  const [assignUser, setAssignUser] = useState(null);

  const openAllotUniversity = (data) => {
    setAllotUniOpen(true);
  };

  const closeAllotUniversity = () => {
    setAllotUniOpen(false);
    setCounsellorDataById(null);
  };
  const openAllotCenter = (data) => {
    setAssignUser(data);
  };

  const closeAllotCenter = () => {
    setAssignUser(null);
  };

  // details for selected counsellor (used inside allot modal)
  const [CounsellorDataById, setCounsellorDataById] = useState(null);

  const fetchCounsellorById = useCallback(async (id) => {
    if (!id) {
      setCounsellorDataById(null);
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetCounsellorById/${id}`,
        { withCredentials: true }
      );
      if (response?.data?.success) {
        setCounsellorDataById(response.data.data || null);
      } else {
        setCounsellorDataById(null);
      }
    } catch (error) {
      setCounsellorDataById(null);
      // toast.error(error?.response?.data?.message || "Failed to load counsellor data");
    }
  }, []);

  useEffect(() => {
    if (assignUser?._id) fetchCounsellorById(assignUser._id);
    else setCounsellorDataById(null);
  }, [assignUser, fetchCounsellorById]);

  // Allot / Remove university handlers
  const HandleOnClickUpdatePushUniversity = async (univ) => {
    if (!assignUser?._id || !univ?._id) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/CounsellorAllotedUniversity`,
        { id: assignUser._id, universityId: univ._id },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        if (typeof FetchCounsellorByPagination === "function") {
          FetchCounsellorByPagination();
        }
        fetchCounsellorById(assignUser._id);
      } else {
        toast.error(response?.data?.message || "Failed to allot");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  const HandleRemoveUniversity = async (univ) => {
    if (!assignUser?._id || !univ?._id) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/CounsellorRemoveUniversity`,
        { id: assignUser._id, universityId: univ._id },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        if (typeof FetchCounsellorByPagination === "function") {
          FetchCounsellorByPagination();
        }
        fetchCounsellorById(assignUser._id);
      } else {
        toast.error(response?.data?.message || "Failed to remove");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  // Allot / Remove center handlers (kept same)
  const HandleOnClickUpdatePushCenter = async (center) => {
    if (!assignUser?._id || !center?._id) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/AllotedCenterToCounsellor`,
        { id: assignUser._id, CenterId: center._id },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        if (typeof FetchCounsellorByPagination === "function") {
          FetchCounsellorByPagination();
        }
        fetchCounsellorById(assignUser._id);
      } else {
        toast.error(response?.data?.message || "Failed to allot center");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  const HandleRemoveCenter = async (center) => {
    if (!assignUser?._id || !center?._id) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/RemoveCenterFromCounsellor`,
        { id: assignUser._id, centerId: center._id },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        if (typeof FetchCounsellorByPagination === "function") {
          FetchCounsellorByPagination();
        }
        fetchCounsellorById(assignUser._id);
      } else {
        toast.error(response?.data?.message || "Failed to remove center");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  // Toggle availability
  const HandleUpdateStatusTogglCounsellor = async (
    CounsellorId,
    BooleanValue
  ) => {
    if (!CounsellorId) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/CounsellorisAvailableToggle`,
        { CounsellorId, BooleanValue },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        if (typeof FetchCounsellorByPagination === "function") {
          FetchCounsellorByPagination();
        }
      } else {
        toast.error(response?.data?.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  // Delete handler
  const HandleDeleteCounsellor = (data) => {
    Swal.fire({
      title: `Do you want to Delete ${data?.name}?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      customClass: {
        cancelButton: "custom-cancel-button",
        confirmButton: "custom-confirm-button",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        HandleDeletSubCounsellorAPI(data?._id, true);
      }
    });
  };

  const HandleDeletSubCounsellorAPI = async (CounsellorId, BooleanValue) => {
    if (!CounsellorId) return;
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteCounsellorForm`,
        { CounsellorId, BooleanValue },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        Swal.fire({ title: "Deleted Successfully!", icon: "success" }).then(
          () => {
            if (typeof FetchCounsellorByPagination === "function") {
              FetchCounsellorByPagination();
            }
          }
        );
      } else {
        toast.error(response?.data?.message || "Failed to delete");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  const ReduxLoggedUser = useSelector((state) => state?.user);

  return (
    <>
      {/*
        Use min-h-screen so the section expands to viewport height.
        The main card has pb-20 to act as a spacer so the fixed footer doesn't cover content.
      */}
      <section className="pt-2 text-xs flex flex-col h-[calc(100vh-110px)]">
        {/* main card: header + table + footer */}
        <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 shadow-md sm:rounded-2xl overflow-hidden">
          {/* header/search area (fixed height) */}
          <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 gap-3">
            <div className="w-full md:w-2/3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="QuerySearchData"
                  onChange={handleSearchInput}
                  value={querySearchData}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Search counsellors"
                  aria-label="Search counsellors"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-xs">Items per page:</label>
              <select
                className="p-2 border rounded"
                value={CounsellorLimit}
                onChange={handleLimitChange}
                aria-label="Items per page"
              >
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {/* table */}
          <div className="overflow-auto pb-2.5 px-4 flex-1">
            <div className="min-w-full">
              <table className="min-w-full text-xs text-left text-slate-900 dark:text-white">
                <thead className="text-sm sticky top-0 p-2 text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {[
                      "Sr No",
                      "Photo",
                      "Name",
                      "University",
                      "Alloted Centers",
                      "Admissions",
                      "Status",
                      "Actions",
                    ].map((header) => (
                      <th key={header} className="px-4 py-2 whitespace-nowrap">
                        <div className="flex gap-3 flex-row">
                          <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                            {header}
                          </h1>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {CounsellorLoading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <Loader />
                      </td>
                    </tr>
                  ) : CounsellorListData?.filter((d) => !d?.isDeleted).length >
                    0 ? (
                    CounsellorListData.filter((d) => !d?.isDeleted).map(
                      (data, index) => (
                        <tr
                          key={data?._id || index}
                          className="bg-white text-sm border-b-4 dark:bg-slate-900 dark:text-white border-b-slate-300 m-2"
                        >
                          <td className="px-4 py-2 align-top whitespace-nowrap">
                            {index + 1}
                          </td>

                          <td className="px-2 py-2 align-top whitespace-nowrap">
                            <div className="w-[12vh] flex gap-y-1 flex-row">
                              <img
                                src={data?.photo}
                                alt={`${data?.name} photo`}
                                className="w-20 h-20 border object-cover"
                              />
                            </div>
                          </td>

                          <td className="px-4 py-2  whitespace-nowrap align-top">
                            <div className="flex flex-col gap-1">
                              <div className="text-xs font-semibold">
                                {data?.name}
                              </div>
                              <div className="text-xs">
                                Counsellor Id: {data?.code}
                              </div>
                              <div className="text-xs">
                                Email: {data?.email}
                              </div>
                              <div className="text-xs">
                                Phone: {data?.contact}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-2 whitespace-nowrap align-top ">
                            <div className="w-[64h] flex gap-y-2 flex-col items-start">
                              {data?.allotedUniversities?.length === 0 ? (
                                <div className="text-sm">
                                  Not Assigned University
                                </div>
                              ) : (
                                data.allotedUniversities.map((u, idx) => (
                                  <div
                                    key={u?._id || idx}
                                    className="text-sm flex gap-2 flex-col uppercase  whitespace-nowrap"
                                  >
                                    <div className="flex flex-row gap-1">
                                      <span>{u?.name}</span>
                                      <span>({u?.vertical})</span>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-2 whitespace-nowrap align-top">
                            <div className="w-[20vh] flex  gap-y-1 flex-col items-start">
                              <div className="text-sm flex flex-col">
                                {data?.allotedCenter?.length === 0 ? (
                                  <div className="text-sm text-center gap-2">
                                    Not Alloted Center
                                  </div>
                                ) : (
                                  data.allotedCenter.map((c) => (
                                    <div key={c?._id} className="text-sm">
                                      <span>{c?.name}</span>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-2 whitespace-nowrap align-top">
                            <div className="w-[20vh] flex gap-y-1 flex-col items-start">
                              <div className="text-sm">
                                {data?.Admissions?.length || 0}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-2 whitespace-nowrap align-top">
                            <div className="w-[20vh] flex gap-y-1 flex-col items-start">
                              <ToggleButton
                                ClickYes={() =>
                                  HandleUpdateStatusTogglCounsellor(
                                    data?._id,
                                    true
                                  )
                                }
                                ClickNo={() =>
                                  HandleUpdateStatusTogglCounsellor(
                                    data?._id,
                                    false
                                  )
                                }
                                StateUpdate={!!data?.isAvailable}
                              />
                            </div>
                          </td>

                          <td className="px-1 py-2 align-top">
                            <div className="flex gap-x-2 flex-row">
                              {(ReduxLoggedUser.role === "Admin" ||
                                ReduxLoggedUser.role ===
                                  "operation-manager") && (
                                <button
                                  onClick={() => openAllotCenter(data)}
                                  title="Allot Center"
                                  className="font-medium text-sm text-green-600"
                                >
                                  <FaCirclePlus size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => openAllotUniversity(data)}
                                title="Allot University"
                                className="font-medium text-sm text-blue-600"
                              >
                                <FaCirclePlus size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  openUpdateCounsellor(data);
                                  setEditCounsellorData(data);
                                }}
                                title="Edit"
                                className="font-medium text-sm ml-2 text-green-600"
                              >
                                <FaEdit size={18} />
                              </button>
                              <button
                                onClick={() => HandleDeleteCounsellor(data)}
                                title="Delete"
                                className="font-medium text-sm text-red-600"
                              >
                                <MdDeleteForever size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-16 text-center text-gray-500"
                      >
                        No counsellors found. Create one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* pagination */}
          <nav className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-3">
            <span className="font-normal text-gray-500 dark:text-gray-400 flex gap-1 flex-row">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {CounsellorListData?.length || 0}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {CounsellorTotalDocs || 0}
              </span>
            </span>

            <ul className="inline-flex items-stretch -space-x-px">
              <li>
                <button
                  onClick={() => handlePageChange(CounsellorCurrentPage - 1)}
                  className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300"
                >
                  <IoChevronBack />
                </button>
              </li>
              <li>
                <div className="flex items-center justify-center py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300">
                  {CounsellorCurrentPage} / {CounsellorTotalPages || 1}
                </div>
              </li>
              <li>
                <button
                  onClick={() => handlePageChange(CounsellorCurrentPage + 1)}
                  className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300"
                >
                  <IoChevronForwardOutline />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </section>

      {/* allot university modal */}
      {allotUniOpen && (
        <Allotuniversity
          HandleOnClickUpdatePushUniversity={HandleOnClickUpdatePushUniversity}
          HandleRemoveUniversity={HandleRemoveUniversity}
          OnCloseAllotUniversity={closeAllotUniversity}
          FetchTheListData={CounsellorDataById}
        />
      )}

      {/* update modal */}
      {updateOpen && editCounsellorData && (
        <UpdateCounsellors
          EditCounsellorUpdate={editCounsellorData}
          HandleCloseCounsellorUpdate={closeUpdateCounsellor}
          FetchCounsellorByPagination={FetchCounsellorByPagination}
        />
      )}

      {/* allot center modal (uses same assignUser / counsellorDataById) */}
      {assignUser && (
        <AllotCenter
          HandleCloseAllotCenterToCounsellor={() => closeAllotCenter()}
          HandleOnClickUpdatePushCenter={HandleOnClickUpdatePushCenter}
          HandleRemoveCenter={HandleRemoveCenter}
          FetchTheListData={CounsellorDataById}
          HandleGetCounsellor={() => fetchCounsellorById(assignUser._id)}
          AssignUser={assignUser}
        />
      )}
    </>
  );
};

export default ListOfCounsellors;
