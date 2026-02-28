import React, { useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import UpdateSubCounsellors from "./UpdateSubCounsellors";
import ToggleButton from "../../../../Common/ToggleButton";
import Loader from "../../../../Helper/Loader";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";
import Allotuniversity from "../../../../Helper/Allotuniversity";
import AllotCenter from "../../../../Helper/AllotCenter";
import { useSelector } from "react-redux";
import UseGetLoggedUser from "../../../../CustomHooks/UseGetLoggedUser";

/**
 * Refactored ListOfSubCounsellors
 * - Responsive (table on md+, cards on mobile)
 * - Debounced search (350ms)
 * - Footer/pagination placed at the bottom
 * - Preserves all existing handlers
 */
const ListOfSubCounsellors = ({
  SubCounsellorListData = [],
  SubCounsellorCurrentPage = 1,
  SubCounsellorTotalPages = 0,
  SubCounsellorLimit = 6,
  SubCounsellorLoading = false,
  SubCounsellorTotalDocs = 0,
  FetchSubCounsellorByPagination,
  handlePageChange,
  handleLimitChange,
}) => {
  const [querySearchData, setQuerySearchData] = useState("");
  const searchTimer = useRef(null);

  const ReduxLoggedUser = useSelector((state) => state?.user);
  const GetUserDataFromRedux = useSelector((state) => state.user);
  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  const { GetLoginUserDetails, LoggedUserData } = UseGetLoggedUser();

  useEffect(() => {
    if (typeof GetLoginUserDetails === "function") GetLoginUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce search input
  const handleSearchInput = (e) => {
    const v = e.target.value;
    setQuerySearchData(v);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (typeof FetchSubCounsellorByPagination === "function") {
        FetchSubCounsellorByPagination(1, SubCounsellorLimit, v);
      }
    }, 350);
  };

  // modal / selected row state
  const [assignUser, setAssignUser] = useState(null);
  const [subCounsellorDetail, setSubCounsellorDetail] = useState(null);
  const [allotUniversityOpen, setAllotUniversityOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [allotCenterOpen, setAllotCenterOpen] = useState(false);

  // fetch details for selected sub counsellor
  useEffect(() => {
    let mounted = true;
    const fetchDetail = async () => {
      if (!assignUser?._id) {
        if (mounted) setSubCounsellorDetail(null);
        return;
      }
      try {
        const resp = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/GetSubCounsellorById/${
            assignUser._id
          }`,
          { withCredentials: true }
        );
        if (mounted && resp?.data?.success)
          setSubCounsellorDetail(resp.data.data);
      } catch (err) {
        if (mounted) setSubCounsellorDetail(null);
      }
    };
    fetchDetail();
    return () => {
      mounted = false;
    };
  }, [assignUser]);

  // allot / remove university
  const HandleOnClickUpdatePushUniversity = async (univ) => {
    if (!assignUser?._id || !univ?._id) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/SubCounsellorAllotedUniversity`,
        { id: assignUser._id, universityId: univ._id },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        if (typeof FetchSubCounsellorByPagination === "function")
          FetchSubCounsellorByPagination();
        // refresh detail
        const resp = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/GetSubCounsellorById/${
            assignUser._id
          }`,
          { withCredentials: true }
        );
        setSubCounsellorDetail(resp?.data?.data || null);
      } else toast.error(response?.data?.message || "Failed to allot");
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  const HandleRemoveUniversity = async (univ) => {
    if (!assignUser?._id || !univ?._id) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/SubCounsellorRemoveUniversity`,
        { id: assignUser._id, universityId: univ._id },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        if (typeof FetchSubCounsellorByPagination === "function")
          FetchSubCounsellorByPagination();
        const resp = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/GetSubCounsellorById/${
            assignUser._id
          }`,
          { withCredentials: true }
        );
        setSubCounsellorDetail(resp?.data?.data || null);
      } else toast.error(response?.data?.message || "Failed to remove");
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  // allot / remove center
  const HandleOnClickUpdatePushCenter = async (center) => {
    if (!assignUser?._id || !center?._id) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/AllotedCenterToSubCounsellor`,
        { id: assignUser._id, CenterId: center._id },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        if (typeof FetchSubCounsellorByPagination === "function")
          FetchSubCounsellorByPagination();
        const resp = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/GetSubCounsellorById/${
            assignUser._id
          }`,
          { withCredentials: true }
        );
        setSubCounsellorDetail(resp?.data?.data || null);
      } else toast.error(response?.data?.message || "Failed to allot center");
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  const HandleRemoveCenter = async (center) => {
    if (!assignUser?._id || !center?._id) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/RemoveCenterFromSubCounsellor`,
        { id: assignUser._id, centerId: center._id },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        if (typeof FetchSubCounsellorByPagination === "function")
          FetchSubCounsellorByPagination();
        const resp = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/GetSubCounsellorById/${
            assignUser._id
          }`,
          { withCredentials: true }
        );
        setSubCounsellorDetail(resp?.data?.data || null);
      } else toast.error(response?.data?.message || "Failed to remove center");
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  // toggle availability
  const HandleUpdateStatusToggleSubCounsellor = async (id, val) => {
    if (!id) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/SubCounsellorisAvailableToggle`,
        { SubCenterId: id, BooleanValue: val },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        if (typeof FetchSubCounsellorByPagination === "function")
          FetchSubCounsellorByPagination();
      } else toast.error(response?.data?.message || "Failed to update");
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  // delete
  const HandleDeleteSubCounsellor = (row) => {
    Swal.fire({
      title: `Do you want to delete ${row?.name}?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      customClass: { confirmButton: "custom-confirm-button" },
    }).then((result) => {
      if (result.isConfirmed) HandleDeletSubCounsellorAPI(row?._id, true);
    });
  };

  const HandleDeletSubCounsellorAPI = async (id, bool) => {
    if (!id) return;
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteSubCounsellorForm`,
        { SubCounsellorId: id, BooleanValue: bool },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        Swal.fire({ title: "Deleted Successfully!", icon: "success" }).then(
          () => {
            if (typeof FetchSubCounsellorByPagination === "function")
              FetchSubCounsellorByPagination();
          }
        );
      } else toast.error(response?.data?.message || "Failed to delete");
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  // helper: filtered list based on role/university (keeps your existing logic)
  const filteredList = (SubCounsellorListData || []).filter((data) => {
    const userRole = GetUserDataFromRedux?.role;
    const userId = GetUserDataFromRedux?.id;
    const universityId = UniversityGetDataFromRedux?.id;
    const isNotDeleted = !data?.isDeleted;

    if (userRole === "Counsellor") {
      return (
        isNotDeleted &&
        data?.counsellors?._id === userId &&
        data?.allotedUniversities?.some((u) => u?._id === universityId)
      );
    }
    if (userRole === "center") {
      return (
        isNotDeleted &&
        data?.allotedCenter?.some((c) => c?._id === userId) &&
        data?.allotedUniversities?.some((u) => u?._id === universityId)
      );
    }
    return (
      isNotDeleted &&
      data?.allotedUniversities?.some((u) => u?._id === universityId)
    );
  });

  return (
    <>
      <section className="pt-3 text-xs flex flex-col h-[calc(100vh-110px)]">
        {/* main card: header + table + footer */}
        <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 shadow-md sm:rounded-2xl px-4 py-2 overflow-hidden">
          {/* Search & limit */}
          <div className="flex flex-col md:flex-row items-center justify-between px-3 py-3 gap-3">
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
                  id="subcounsellor-search"
                  type="text"
                  value={querySearchData}
                  onChange={handleSearchInput}
                  placeholder="Search sub-counsellors, email, phone..."
                  className="block w-full pl-10 pr-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label="Search sub counsellors"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs whitespace-nowrap">
                Items per page:
              </label>
              <select
                value={SubCounsellorLimit}
                onChange={handleLimitChange}
                className="p-2 border rounded text-sm bg-white dark:bg-gray-700"
                aria-label="Items per page"
              >
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {/* Content area */}
          <div className="px-4 pb-4 flex-1 overflow-auto">
            {SubCounsellorLoading ? (
              <div className="py-16 flex justify-center">
                <Loader />
              </div>
            ) : filteredList.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center text-gray-500">
                <div className="text-lg font-semibold">
                  No sub-counsellors found
                </div>
                <div className="text-xs mt-1">
                  Create sub-counsellors to see them listed here.
                </div>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block">
                  <table className="min-w-full text-sm text-left text-slate-900 dark:text-white">
                    <thead className="text-xs sticky top-0 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      <tr>
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Photo</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">University</th>
                        <th className="px-4 py-2">Centers</th>
                        <th className="px-4 py-2">Admissions</th>
                        {ReduxLoggedUser?.role !== "university-manager" && (
                          <th className="px-4 py-2">Status</th>
                        )}
                        {ReduxLoggedUser?.role !== "university-manager" && (
                          <th className="px-4 py-2">Actions</th>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {filteredList.map((row, idx) => (
                        <tr
                          key={row?._id || idx}
                          className="bg-white dark:bg-slate-900 border-b"
                        >
                          <td className="px-4 py-3 align-top">{idx + 1}</td>

                          <td className="px-4 py-3 align-top">
                            <div className="w-16 h-16 rounded overflow-hidden border">
                              <img
                                src={row?.photo}
                                alt={`${row?.name} photo`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>

                          <td className="px-4 py-3 align-top">
                            <div className="font-semibold">{row?.name}</div>
                            <div className="text-xs text-gray-500">
                              ID: {row?.code}
                            </div>
                            <div className="text-xs text-gray-500">
                              Email: {row?.email}
                            </div>
                            <div className="text-xs text-gray-500">
                              Phone: {row?.contact}
                            </div>
                          </td>

                          <td className="px-4 py-3 align-top">
                            {row?.allotedUniversities?.length ? (
                              row.allotedUniversities.map((u) => (
                                <div key={u?._id} className="text-xs uppercase">
                                  {u?.name}{" "}
                                  {u?.vertical ? `(${u.vertical})` : ""}
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-gray-500">
                                Not Assigned
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3 align-top">
                            {row?.allotedCenter?.length ? (
                              row.allotedCenter.map((c) => (
                                <div key={c?._id} className="text-xs">
                                  {c?.name}
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-gray-500">
                                Not Alloted Center
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3 align-top">
                            {row?.Admissions?.length || 0}
                          </td>

                          {ReduxLoggedUser?.role !== "university-manager" && (
                            <td className="px-4 py-3 align-top">
                              <ToggleButton
                                ClickYes={() =>
                                  HandleUpdateStatusToggleSubCounsellor(
                                    row?._id,
                                    true
                                  )
                                }
                                ClickNo={() =>
                                  HandleUpdateStatusToggleSubCounsellor(
                                    row?._id,
                                    false
                                  )
                                }
                                StateUpdate={!!row?.isAvailable}
                              />
                            </td>
                          )}

                          {ReduxLoggedUser?.role !== "university-manager" && (
                            <td className="px-4 py-3 align-top">
                              <div className="flex items-center gap-2">
                                <button
                                  title="Allot University"
                                  onClick={() => {
                                    setAssignUser(row);
                                    setAllotUniversityOpen(true);
                                  }}
                                  className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <FaCirclePlus
                                    size={16}
                                    className="text-blue-600"
                                  />
                                </button>

                                <button
                                  title="Edit"
                                  onClick={() => {
                                    setEditData(row);
                                    setUpdateOpen(true);
                                  }}
                                  className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <FaEdit
                                    size={16}
                                    className="text-green-600"
                                  />
                                </button>

                                <button
                                  title="Delete"
                                  onClick={() => HandleDeleteSubCounsellor(row)}
                                  className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <MdDeleteForever
                                    size={16}
                                    className="text-red-600"
                                  />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-3">
                  {filteredList.map((row, idx) => (
                    <article
                      key={row?._id || idx}
                      className="bg-white dark:bg-slate-900 rounded-lg shadow p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded overflow-hidden border flex-shrink-0">
                          <img
                            src={row?.photo}
                            alt={`${row?.name} photo`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold text-sm">
                                {row?.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {row?.code}
                              </div>
                              <div className="text-xs text-gray-500">
                                Phone: {row?.contact}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                title="Allot University"
                                onClick={() => {
                                  setAssignUser(row);
                                  setAllotUniversityOpen(true);
                                }}
                                className="p-1 rounded"
                              >
                                <FaCirclePlus
                                  size={16}
                                  className="text-blue-600"
                                />
                              </button>
                              <button
                                title="Edit"
                                onClick={() => {
                                  setEditData(row);
                                  setUpdateOpen(true);
                                }}
                                className="p-1 rounded"
                              >
                                <FaEdit size={16} className="text-green-600" />
                              </button>
                              <button
                                title="Delete"
                                onClick={() => HandleDeleteSubCounsellor(row)}
                                className="p-1 rounded"
                              >
                                <MdDeleteForever
                                  size={16}
                                  className="text-red-600"
                                />
                              </button>
                            </div>
                          </div>

                          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <div className="text-[11px] text-gray-500">
                                Universities
                              </div>
                              {row?.allotedUniversities?.length ? (
                                <div className="text-[12px] truncate">
                                  {row.allotedUniversities
                                    .map((u) => u.name)
                                    .join(", ")}
                                </div>
                              ) : (
                                <div className="text-[12px] text-gray-500">
                                  Not Assigned
                                </div>
                              )}
                            </div>

                            <div>
                              <div className="text-[11px] text-gray-500">
                                Centers
                              </div>
                              {row?.allotedCenter?.length ? (
                                <div className="text-[12px] truncate">
                                  {row.allotedCenter
                                    .map((c) => c.name)
                                    .join(", ")}
                                </div>
                              ) : (
                                <div className="text-[12px] text-gray-500">
                                  None
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-xs">
                              Admissions:{" "}
                              <span className="font-semibold">
                                {row?.Admissions?.length || 0}
                              </span>
                            </div>
                            {ReduxLoggedUser?.role !== "university-manager" && (
                              <ToggleButton
                                ClickYes={() =>
                                  HandleUpdateStatusToggleSubCounsellor(
                                    row?._id,
                                    true
                                  )
                                }
                                ClickNo={() =>
                                  HandleUpdateStatusToggleSubCounsellor(
                                    row?._id,
                                    false
                                  )
                                }
                                StateUpdate={!!row?.isAvailable}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer / Pagination pinned to bottom of the card */}
          <nav
            aria-label="Table navigation"
            className="px-4 py-3 bg-white dark:bg-gray-800 border-t"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {SubCounsellorListData?.length || 0}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {SubCounsellorTotalDocs || 0}
                </span>
              </div>

              <div className="inline-flex items-center rounded-md overflow-hidden border bg-white dark:bg-gray-800">
                <button
                  onClick={() => handlePageChange(SubCounsellorCurrentPage - 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  title="Previous page"
                >
                  <IoChevronBack size={18} />
                </button>
                <div className="px-4 py-1 text-sm text-gray-700">
                  {SubCounsellorCurrentPage} / {SubCounsellorTotalPages || 1}
                </div>
                <button
                  onClick={() => handlePageChange(SubCounsellorCurrentPage + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  title="Next page"
                >
                  <IoChevronForwardOutline size={18} />
                </button>
              </div>
            </div>
          </nav>
        </div>
      </section>

      {/* Modals / overlays */}
      {allotUniversityOpen && assignUser && (
        <Allotuniversity
          HandleOnClickUpdatePushUniversity={HandleOnClickUpdatePushUniversity}
          HandleRemoveUniversity={HandleRemoveUniversity}
          OnCloseAllotUniversity={() => {
            setAllotUniversityOpen(false);
            setAssignUser(null);
            setSubCounsellorDetail(null);
          }}
          FetchTheListData={subCounsellorDetail}
        />
      )}

      {updateOpen && editData && (
        <UpdateSubCounsellors
          EditOpenUpdateSubCounsellor={editData}
          FetchSubCounsellorByPagination={FetchSubCounsellorByPagination}
          HandleCloseUpdateSubCounsellors={() => {
            setUpdateOpen(false);
            setEditData(null);
          }}
        />
      )}

      {allotCenterOpen && assignUser && (
        <AllotCenter
          HandleOnClickUpdatePushCenter={HandleOnClickUpdatePushCenter}
          HandleRemoveCenter={HandleRemoveCenter}
          AssignUser={assignUser}
          FetchTheListData={subCounsellorDetail}
          HandleCloseAllotCenterToCounsellor={() => setAllotCenterOpen(false)}
        />
      )}
    </>
  );
};

export default ListOfSubCounsellors;
