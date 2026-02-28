import React, { useEffect, useState, useCallback, useRef } from "react";
import { FaEdit } from "react-icons/fa";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import Allotuniversity from "../../../../Helper/Allotuniversity";
import UpdateUniversityManager from "./UpdateUniversityManager";
import ToggleButton from "../../../../Common/ToggleButton";
import Loader from "../../../../Helper/Loader";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";

const ListUniversityManager = ({
  UniversityManagerListData = [],
  UniversityManagerCurrentPage = 1,
  UniversityManagerTotalPages = 0,
  UniversityManagerLimit = 10,
  UniversityManagerLoading = false,
  UniversityManagerTotalDocs = 0,
  FetchUniversityManagerByPagination,
  handleLimitChange,
  handlePageChange,
}) => {
  // search query with debounce
  const [querySearchData, setQuerySearchData] = useState("");
  const searchTimeout = useRef(null);

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setQuerySearchData(value);

    // debounce: delay calling fetch until user stops typing
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (typeof FetchUniversityManagerByPagination === "function") {
        FetchUniversityManagerByPagination(1, UniversityManagerLimit, value);
      }
    }, 350);
  };

  // update / allot modals
  const [updateUniversityButton, setUpdateUniversityButton] = useState(false);
  const [editUpdateUniversity, setEditUpdateUniversity] = useState(null);

  const openUpdateUniversity = (data) => {
    setEditUpdateUniversity(data);
    setUpdateUniversityButton(true);
  };
  const closeUpdateUniversity = () => {
    setEditUpdateUniversity(null);
    setUpdateUniversityButton(false);
  };

  const [allotUniversityButton, setAllotUniversityButton] = useState(false);
  const [assignUser, setAssignUser] = useState(null);

  const openAllotUniversity = (data) => {
    setAssignUser(data);
    setAllotUniversityButton(true);
  };
  const closeAllotUniversity = () => {
    setAssignUser(null);
    setAllotUniversityButton(false);
  };

  // details for the selected manager (used inside allot modal)
  const [universityManagerDataById, setUniversityManagerDataById] =
    useState(null);

  const HandleGetUniversityManager = useCallback(async (id) => {
    if (!id) {
      setUniversityManagerDataById(null);
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetUniversityManagerById/${id}`,
        { withCredentials: true }
      );

      if (response?.data?.success) {
        setUniversityManagerDataById(response?.data?.data || null);
      } else {
        setUniversityManagerDataById(null);
      }
    } catch (error) {
      setUniversityManagerDataById(null);
      toast.error(
        error?.response?.data?.message || "Failed to load manager data"
      );
    }
  }, []);

  // when assignUser changes, fetch its details
  useEffect(() => {
    if (assignUser?._id) {
      HandleGetUniversityManager(assignUser._id);
    } else {
      setUniversityManagerDataById(null);
    }
  }, [assignUser, HandleGetUniversityManager]);

  // Allot / Remove university handlers
  const HandleOnClickUpdatePushUniversity = async (university) => {
    if (!assignUser?._id || !university?._id) return;
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/UniversityManagerAllotedUniversity`,
        { id: assignUser._id, universityId: university._id },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        if (typeof FetchUniversityManagerByPagination === "function") {
          FetchUniversityManagerByPagination();
        }
        HandleGetUniversityManager(assignUser._id);
      } else {
        toast.error(response?.data?.message || "Failed to allot");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const HandleRemoveUniversity = async (university) => {
    if (!assignUser?._id || !university?._id) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/UniversityManagerRemoveUniversity`,
        { id: assignUser._id, universityId: university._id },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        if (typeof FetchUniversityManagerByPagination === "function") {
          FetchUniversityManagerByPagination();
        }
        HandleGetUniversityManager(assignUser._id);
      } else {
        toast.error(response?.data?.message || "Failed to remove");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // status toggle
  const HandleUpdateStatusToggleUniversityManager = async (
    UniversityManagerId,
    BooleanValue
  ) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/university-operational-manager-isavailable`,
        { UniversityManagerId, BooleanValue },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        if (typeof FetchUniversityManagerByPagination === "function") {
          FetchUniversityManagerByPagination();
        }
      } else {
        toast.error(response?.data?.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const HandleLoginStatusToggleYes = (data) => {
    if (data?._id) HandleUpdateStatusToggleUniversityManager(data._id, true);
  };
  const HandleLoginStatusToggleNo = (data) => {
    if (data?._id) HandleUpdateStatusToggleUniversityManager(data._id, false);
  };

  // delete manager
  const HandleDeleteUniversityManager = (data) => {
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
        HandleDeleteOperationalApi(data?._id, true);
      }
    });
  };

  const HandleDeleteOperationalApi = async (
    UniversityManagerId,
    BooleanValue
  ) => {
    if (!UniversityManagerId) return;
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteUniversityManagerForm`,
        { UniversityManagerId, BooleanValue },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        Swal.fire({ title: "Deleted Successfully!", icon: "success" }).then(
          () => {
            if (typeof FetchUniversityManagerByPagination === "function") {
              FetchUniversityManagerByPagination();
            }
          }
        );
      } else {
        toast.error(response?.data?.message || "Failed to delete");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <>
      {/* container: flex-col so header stays, table fills remaining height */}
      <section className="pt-2 text-xs flex flex-col h-[calc(100vh-110px)]">
        <div className="px-2 pt-4 bg-white dark:bg-gray-800 shadow-md sm:rounded-2xl py-2 overflow-hidden flex flex-col flex-1">
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
                  placeholder="Search university managers"
                  aria-label="Search university managers"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3 md:mt-0">
              <label className="text-xs">Items per page:</label>
              <select
                className="p-2 border rounded bg-white dark:bg-gray-700"
                value={UniversityManagerLimit}
                onChange={handleLimitChange}
                aria-label="Items per page"
              >
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>

          {/* table area: grow to fill remaining space and scroll internally */}
          <div className="flex-1 overflow-auto pb-2.5 px-4">
            <div className="min-w-full">
              <table className="min-w-full text-xs text-left text-slate-900">
                <thead className="text-sm sticky top-0 p-2 text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400 z-10">
                  <tr>
                    {[
                      "Sr No",
                      "Photo",
                      "Name",
                      "Alloted University",
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
                  {UniversityManagerLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <Loader />
                      </td>
                    </tr>
                  ) : (
                    (UniversityManagerListData || [])
                      .filter((d) => !d?.isDeleted)
                      .map((data, index) => (
                        <tr
                          key={data?._id || index}
                          className="bg-white dark:bg-slate-900 dark:text-white text-sm border-b"
                        >
                          <td className="px-4 py-2 align-top whitespace-nowrap">
                            {index + 1}
                          </td>

                          <td className="px-2 py-2 align-top">
                            <div className="w-12 h-12 overflow-hidden rounded">
                              <img
                                src={data?.photo}
                                alt={`${data?.name || "manager"} photo`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>

                          <td className=" whitespace-nowrap px-4 py-2 align-top">
                            <div className="flex flex-col gap-1">
                              <div className="text-xs font-semibold">
                                {data?.name}
                              </div>
                              <div className="text-xs text-gray-600">
                                Center Id: {data?.code}
                              </div>
                              <div className="text-xs text-gray-600">
                                Email: {data?.email}
                              </div>
                              <div className="text-xs text-gray-600">
                                Phone: {data?.phone}
                              </div>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-4 py-2 align-top">
                            <div className="flex flex-col gap-1">
                              {Array.isArray(data?.allotedUniversities) &&
                              data.allotedUniversities.length > 0 ? (
                                data.allotedUniversities.map((u) => (
                                  <div
                                    key={u?._id || u?.name}
                                    className="text-xs uppercase"
                                  >
                                    <span>{u?.name}</span>
                                    {u?.vertical ? (
                                      <span className="text-gray-500">
                                        {" "}
                                        ({u.vertical})
                                      </span>
                                    ) : null}
                                  </div>
                                ))
                              ) : (
                                <div className="text-xs">
                                  Not Assigned University
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-2 align-top">
                            <div className="w-[15vh]">
                              <ToggleButton
                                ClickYes={() =>
                                  HandleLoginStatusToggleYes(data)
                                }
                                ClickNo={() => HandleLoginStatusToggleNo(data)}
                                StateUpdate={!!data?.isAvailable}
                              />
                            </div>
                          </td>

                          <td className="px-2 py-2 align-top">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openAllotUniversity(data)}
                                title="Allot University"
                                className="text-blue-600"
                              >
                                <FaCirclePlus size={18} />
                              </button>
                              <button
                                onClick={() => openUpdateUniversity(data)}
                                title="Edit"
                                className="text-green-600"
                              >
                                <FaEdit size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  HandleDeleteUniversityManager(data)
                                }
                                title="Delete"
                                className="text-red-600"
                              >
                                <MdDeleteForever size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* pagination (keeps bottom) */}
          <nav
            className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-3"
            aria-label="Table navigation"
          >
            <span className="font-normal text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {UniversityManagerListData?.length || 0}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {UniversityManagerTotalDocs || 0}
              </span>
            </span>

            <ul className="inline-flex items-stretch -space-x-px">
              <li>
                <button
                  onClick={() =>
                    handlePageChange(UniversityManagerCurrentPage - 1)
                  }
                  className="px-3 py-1 border rounded-l"
                >
                  <IoChevronBack />
                </button>
              </li>
              <li>
                <div className="px-4 py-1 border">
                  {UniversityManagerCurrentPage} /{" "}
                  {UniversityManagerTotalPages || 1}
                </div>
              </li>
              <li>
                <button
                  onClick={() =>
                    handlePageChange(UniversityManagerCurrentPage + 1)
                  }
                  className="px-3 py-1 border rounded-r"
                >
                  <IoChevronForwardOutline />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </section>

      {/* allot university modal */}
      {allotUniversityButton && (
        <Allotuniversity
          HandleOnClickUpdatePushUniversity={HandleOnClickUpdatePushUniversity}
          HandleRemoveUniversity={HandleRemoveUniversity}
          OnCloseAllotUniversity={closeAllotUniversity}
          FetchTheListData={universityManagerDataById}
        />
      )}

      {/* update modal */}
      {updateUniversityButton && editUpdateUniversity && (
        <UpdateUniversityManager
          EditUpdateUniversity={editUpdateUniversity}
          FetchUniversityManagerByPagination={
            FetchUniversityManagerByPagination
          }
          HandleCloseUpdateUniversity={closeUpdateUniversity}
        />
      )}
    </>
  );
};

export default ListUniversityManager;
