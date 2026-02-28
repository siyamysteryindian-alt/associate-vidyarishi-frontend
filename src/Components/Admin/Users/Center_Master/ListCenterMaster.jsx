import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import UpdateCenterMaster from "./UpdateCenterMaster";
import ToggleButton from "../../../../Common/ToggleButton";
import Loader from "../../../../Helper/Loader";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import axios from "axios";
import Allotuniversity from "../../../../Helper/Allotuniversity";
import { useSelector } from "react-redux";

const ListCenterMaster = ({
  CenterListData = [],
  CenterCurrentPage = 1,
  CenterTotalPages = 1,
  CenterLimit = 6,
  CenterLoading = false,
  CenterTotalDocs = 0,
  FetchCenterByPagination,
  handlePageChange,
  handleLimitChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [assignedCenter, setAssignedCenter] = useState(null);
  const [centerDetail, setCenterDetail] = useState(null);
  const [allotUniversityOpen, setAllotUniversityOpen] = useState(false);
  const [updateCenterOpen, setUpdateCenterOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const UniversityGetDataFromRedux = useSelector((s) => s?.university);

  // Search handler -> calls parent fetch
  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (typeof FetchCenterByPagination === "function") {
      FetchCenterByPagination(1, CenterLimit, q);
    }
  };

  const openAllotUniversity = (center) => {
    setAssignedCenter(center);
    setAllotUniversityOpen(true);
    fetchCenterById(center?._id);
  };
  const closeAllotUniversity = () => {
    setAssignedCenter(null);
    setCenterDetail(null);
    setAllotUniversityOpen(false);
  };

  const openUpdateCenter = (center) => {
    setEditingCenter(center);
    setUpdateCenterOpen(true);
  };
  const closeUpdateCenter = () => {
    setEditingCenter(null);
    setUpdateCenterOpen(false);
  };

  // fetch single center details when assigned
  const fetchCenterById = async (id) => {
    if (!id) return setCenterDetail(null);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetCenterMasterById/${id}`,
        { withCredentials: true }
      );
      if (res?.data?.success) setCenterDetail(res.data.data);
      else setCenterDetail(null);
    } catch (err) {
      setCenterDetail(null);
      // keep consistent with your other components: don't toast here
      // toast.error(err?.response?.data?.message || "Failed to fetch center");
    }
  };

  useEffect(() => {
    if (assignedCenter?._id) fetchCenterById(assignedCenter._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignedCenter?._id]);

  // allot/remove university handlers (caller expects same signature)
  const handleAllotUniversity = async (univ, showToast = true) => {
    if (!assignedCenter?._id || !univ?._id) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/CenterAllotedUniversity`,
        { id: assignedCenter._id, universityId: univ._id },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        if (showToast) toast.success(response.data.message);
        if (typeof FetchCenterByPagination === "function")
          FetchCenterByPagination();
        fetchCenterById(assignedCenter._id);
      } else {
        toast.error(response?.data?.message || "Failed to allot university");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  const handleRemoveUniversity = async (univ) => {
    if (!assignedCenter?._id || !univ?._id) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/CenterRemoveUniversity`,
        { id: assignedCenter._id, universityId: univ._id },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        if (typeof FetchCenterByPagination === "function")
          FetchCenterByPagination();
        fetchCenterById(assignedCenter._id);
      } else {
        toast.error(response?.data?.message || "Failed to remove university");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  // toggle canCreateSubCenter
  const toggleCanCreateSubCenter = async (centerId, bool) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/CentercanCreateSubCenterToggle`,
        { CenterId: centerId, BooleanValue: bool },
        { withCredentials: true }
      );
      if (res?.data?.success) {
        toast.success(res.data.message);
        if (typeof FetchCenterByPagination === "function")
          FetchCenterByPagination();
      } else {
        toast.error(res?.data?.message || "Failed to update status");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  const confirmDeleteCenter = (center) => {
    Swal.fire({
      title: `Do you want to delete ${center?.name}?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      customClass: { confirmButton: "custom-confirm-button" },
    }).then((res) => {
      if (res.isConfirmed) deleteCenterApi(center._id);
    });
  };

  const deleteCenterApi = async (centerId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteCenterForm`,
        { CenterId: centerId, BooleanValue: true },
        { withCredentials: true }
      );
      if (res?.data?.success) {
        toast.success(res.data.message);
        Swal.fire({ title: "Deleted Successfully!", icon: "success" }).then(
          () => {
            if (typeof FetchCenterByPagination === "function")
              FetchCenterByPagination();
          }
        );
      } else {
        toast.error(res?.data?.message || "Failed to delete");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  // filter centers for current university (same logic as original)
  const visibleCenters = (CenterListData || []).filter(
    (c) =>
      !c?.isDeleted &&
      c?.allotedUniversities?.some(
        (u) => u?._id === UniversityGetDataFromRedux?.id
      )
  );

  return (
    <>
      <section className="pt-2 text-xs flex flex-col h-[calc(100vh-110px)]">
        {/* main card: header + table + footer */}
        <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 shadow-md sm:rounded-2xl overflow-hidden">
          {/* Search + Limit */}
          <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 gap-3">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
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
                  id="center-search"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search centers..."
                  aria-label="Search centers"
                  className="block w-full pl-10 pr-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs whitespace-nowrap">
                Items per page:
              </label>
              <select
                value={CenterLimit}
                onChange={handleLimitChange}
                className="p-2 border rounded text-sm bg-white dark:bg-gray-700"
                aria-label="Items per page"
              >
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-auto pb-2.5 px-4 flex-1">
            {CenterLoading ? (
              <div className="py-16 flex justify-center">
                <Loader />
              </div>
            ) : visibleCenters.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center text-gray-500 py-12">
                <div className="text-lg font-semibold">No centers found</div>
                <div className="text-xs mt-1">
                  Create a center to see it listed here.
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
                        <th className="px-4 py-2">Can Create Sub Center?</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleCenters.map((center, idx) => (
                        <tr
                          key={center?._id || idx}
                          className="bg-white dark:bg-slate-900 border-b"
                        >
                          <td className="px-4 py-3 align-top">{idx + 1}</td>

                          <td className="px-4 py-3 align-top">
                            <div className="w-16 h-16 rounded overflow-hidden border">
                              <img
                                src={center?.photo}
                                alt={`${center?.name} photo`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>

                          <td className="px-4 py-3 align-top">
                            <div className="font-semibold">{center?.name}</div>
                            <div className="text-xs text-gray-500">
                              Center Id: {center?.code}
                            </div>
                          </td>

                          <td className="px-4 py-3 align-top">
                            <ToggleButton
                              ClickYes={() =>
                                toggleCanCreateSubCenter(center?._id, true)
                              }
                              ClickNo={() =>
                                toggleCanCreateSubCenter(center?._id, false)
                              }
                              StateUpdate={!!center?.canCreateSubCenter}
                            />
                          </td>

                          <td className="px-4 py-3 align-top">
                            <div className="flex items-center gap-2">
                              <button
                                title="Allot University"
                                onClick={() => openAllotUniversity(center)}
                                className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <FaCirclePlus
                                  size={16}
                                  className="text-blue-600"
                                />
                              </button>

                              <button
                                title="Edit center"
                                onClick={() => openUpdateCenter(center)}
                                className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <FaEdit size={16} className="text-green-600" />
                              </button>

                              <button
                                title="Delete center"
                                onClick={() => confirmDeleteCenter(center)}
                                className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <MdDeleteForever
                                  size={16}
                                  className="text-red-600"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile stacked cards */}
                <div className="md:hidden space-y-3">
                  {visibleCenters.map((center, idx) => (
                    <article
                      key={center?._id || idx}
                      className="bg-white dark:bg-slate-900 rounded-lg shadow p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded overflow-hidden border flex-shrink-0">
                          <img
                            src={center?.photo}
                            alt={`${center?.name} photo`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold text-sm">
                                {center?.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {center?.code}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openAllotUniversity(center)}
                                className="p-1 rounded"
                              >
                                <FaCirclePlus
                                  size={16}
                                  className="text-blue-600"
                                />
                              </button>
                              <button
                                onClick={() => openUpdateCenter(center)}
                                className="p-1 rounded"
                              >
                                <FaEdit size={16} className="text-green-600" />
                              </button>
                              <button
                                onClick={() => confirmDeleteCenter(center)}
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
                              <div className="text-[12px] truncate">
                                {(center?.allotedUniversities || [])
                                  .map((u) => u?.name)
                                  .join(", ") || "Not assigned"}
                              </div>
                            </div>

                            <div>
                              <div className="text-[11px] text-gray-500">
                                Can Create Sub Center
                              </div>
                              <div className="text-[12px]">
                                <ToggleButton
                                  ClickYes={() =>
                                    toggleCanCreateSubCenter(center?._id, true)
                                  }
                                  ClickNo={() =>
                                    toggleCanCreateSubCenter(center?._id, false)
                                  }
                                  StateUpdate={!!center?.canCreateSubCenter}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Pagination */}
          <nav className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-3">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {visibleCenters.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {CenterTotalDocs || 0}
                </span>
              </div>

              <div className="inline-flex items-center rounded-md overflow-hidden border bg-white dark:bg-gray-800">
                <button
                  onClick={() => handlePageChange((CenterCurrentPage || 1) - 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  title="Previous page"
                >
                  <IoChevronBack size={18} />
                </button>
                <div className="px-4 py-1 text-sm text-gray-700">
                  {CenterCurrentPage} / {CenterTotalPages || 1}
                </div>
                <button
                  onClick={() => handlePageChange((CenterCurrentPage || 1) + 1)}
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

      {/* Allot university modal */}
      {allotUniversityOpen && assignedCenter && (
        <Allotuniversity
          HandleOnClickUpdatePushUniversity={handleAllotUniversity}
          HandleRemoveUniversity={handleRemoveUniversity}
          OnCloseAllotUniversity={closeAllotUniversity}
          FetchTheListData={centerDetail}
        />
      )}

      {/* Update center modal */}
      {updateCenterOpen && editingCenter && (
        <UpdateCenterMaster
          EditCenterMasterUpdate={editingCenter}
          FetchCenterByPagination={FetchCenterByPagination}
          HandleUpdateCenterMasterCloseButton={closeUpdateCenter}
        />
      )}
    </>
  );
};

export default ListCenterMaster;
