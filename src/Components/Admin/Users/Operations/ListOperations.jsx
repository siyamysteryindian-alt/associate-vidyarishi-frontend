import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { FaEdit } from "react-icons/fa";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import Allotuniversity from "../../../../Helper/Allotuniversity";
import UpdateOperations from "./UpdateOperations";
import ToggleButton from "../../../../Common/ToggleButton";
import Loader from "../../../../Helper/Loader";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";

const ListOperations = ({
  OperationalManagerListData = [],
  OperationalManagerCurrentPage = 1,
  OperationalManagerTotalPages = 0,
  OperationalManagerLimit = 10,
  OperationalManagerLoading = false,
  OperationalManagerTotalDocs = 0,
  FetchOperationalManagerByPagination,
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
      if (typeof FetchOperationalManagerByPagination === "function") {
        FetchOperationalManagerByPagination(1, OperationalManagerLimit, value);
      }
    }, 350);
  };

  // update / allot modals
  const [updateOperationsOpen, setUpdateOperationsOpen] = useState(false);
  const [editOperationsData, setEditOperationsData] = useState(null);

  const openUpdateOperations = (data) => {
    setEditOperationsData(data);
    setUpdateOperationsOpen(true);
  };
  const closeUpdateOperations = () => {
    setEditOperationsData(null);
    setUpdateOperationsOpen(false);
  };

  const [allotUniversityOpen, setAllotUniversityOpen] = useState(false);
  const [assignUser, setAssignUser] = useState(null);

  const openAllotUniversity = (data) => {
    setAssignUser(data);
    setAllotUniversityOpen(true);
  };
  const closeAllotUniversity = () => {
    setAssignUser(null);
    setAllotUniversityOpen(false);
    setOperationalDataById(null);
  };

  // details for the selected operational (used inside allot modal)
  const [operationalDataById, setOperationalDataById] = useState(null);

  const fetchOperationalById = useCallback(async (id) => {
    if (!id) {
      setOperationalDataById(null);
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetOperationalById/${id}`,
        { withCredentials: true }
      );
      if (response?.data?.success) {
        setOperationalDataById(response.data.data || null);
      } else {
        setOperationalDataById(null);
      }
    } catch (error) {
      setOperationalDataById(null);
      toast.error(error?.response?.data?.message || "Failed to load data");
    }
  }, []);

  useEffect(() => {
    if (assignUser?._id) fetchOperationalById(assignUser._id);
  }, [assignUser, fetchOperationalById]);

  // Allot / Remove university handlers
  const HandleOnClickUpdatePushUniversity = async (university) => {
    if (!assignUser?._id || !university?._id) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/OperationalAllotedUniversity`,
        { id: assignUser._id, universityId: university._id },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        if (typeof FetchOperationalManagerByPagination === "function") {
          FetchOperationalManagerByPagination();
        }
        fetchOperationalById(assignUser._id);
      } else {
        toast.error(response?.data?.message || "Failed to allot");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  const HandleRemoveUniversity = async (university) => {
    if (!assignUser?._id || !university?._id) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/OperationalRemoveUniversity`,
        { id: assignUser._id, universityId: university._id },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        if (typeof FetchOperationalManagerByPagination === "function") {
          FetchOperationalManagerByPagination();
        }
        fetchOperationalById(assignUser._id);
      } else {
        toast.error(response?.data?.message || "Failed to remove");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  // status toggle
  const HandleUpdateStatusToggleOperatonal = async (
    OperationalId,
    BooleanValue
  ) => {
    if (!OperationalId) return;
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/university-operational-manager-isavailable`,
        { UniversityManagerId: OperationalId, BooleanValue },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        if (typeof FetchOperationalManagerByPagination === "function") {
          FetchOperationalManagerByPagination();
        }
      } else {
        toast.error(response?.data?.message || "Failed to update status");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  const HandleLoginStatusToggleYes = (data) => {
    if (data?._id) HandleUpdateStatusToggleOperatonal(data._id, true);
  };
  const HandleLoginStatusToggleNo = (data) => {
    if (data?._id) HandleUpdateStatusToggleOperatonal(data._id, false);
  };

  // delete manager
  const HandleDeleteOperational = (data) => {
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

  const HandleDeleteOperationalApi = async (OperationalId, BooleanValue) => {
    if (!OperationalId) return;
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteOperationalForm`,
        { OperationalId, BooleanValue },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        Swal.fire({ title: "Deleted Successfully!", icon: "success" }).then(
          () => {
            if (typeof FetchOperationalManagerByPagination === "function")
              FetchOperationalManagerByPagination();
          }
        );
      } else {
        toast.error(response?.data?.message || "Failed to delete");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  // memoized visible list (in case you want client side filter later)
  const visibleList = useMemo(
    () =>
      Array.isArray(OperationalManagerListData)
        ? OperationalManagerListData.filter((d) => !d?.isDeleted)
        : [],
    [OperationalManagerListData]
  );

  return (
    <>
      <section className="pt-2 text-xs flex flex-col h-[calc(100vh-110px)]">
        {/* main card: header + table + footer */}
        <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 shadow-md sm:rounded-2xl overflow-hidden">
          {/* header/search */}
          <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 gap-3 border-b dark:border-slate-700">
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
                  placeholder="Search operations"
                  aria-label="Search operations"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-xs">Items per page:</label>
              <select
                className="p-2 border rounded"
                value={OperationalManagerLimit}
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

          {/* table area: flex-grow so pagination stays at bottom */}
          <div className="flex-1 overflow-auto px-4 py-3">
            <div className="min-w-full">
              <table className="min-w-full text-xs text-left text-slate-900 dark:text-white table-fixed">
                <thead className="text-sm sticky top-0 bg-gray-50 dark:bg-gray-700 z-10">
                  <tr>
                    {[
                      "Sr No",
                      "Photo",
                      "Name",
                      "Alloted University",
                      "Status",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-2 whitespace-nowrap text-left"
                      >
                        <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                          {header}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {OperationalManagerLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <Loader />
                      </td>
                    </tr>
                  ) : visibleList.length > 0 ? (
                    visibleList.map((data, i) => (
                      <tr
                        key={data?._id || i}
                        className="bg-white dark:bg-slate-900 text-sm border-b"
                      >
                        <td className="px-4 py-3 align-top w-12 whitespace-nowrap">
                          {i + 1}
                        </td>

                        <td className="px-2 py-3 align-top w-28">
                          <div className="w-20 h-20 overflow-hidden rounded-md border">
                            <img
                              src={data?.photo}
                              alt={data?.name || "photo"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>

                        <td className=" whitespace-nowrap px-4 py-3 align-top">
                          <div className="flex flex-col gap-1">
                            <div className="text-xs font-semibold">
                              {data?.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                              Employe Id: {data?.code}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                              Email: {data?.email}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                              Phone: {data?.contact}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top max-w-[26rem]">
                          <div className="flex flex-col gap-1">
                            {Array.isArray(data?.allotedUniversities) &&
                            data.allotedUniversities.length > 0 ? (
                              data.allotedUniversities.map((u, idx) => (
                                <div
                                  key={u?._id || idx}
                                  className="text-xs uppercase truncate"
                                >
                                  <span className="truncate block">
                                    {u?.name}{" "}
                                    {u?.vertical ? `(${u.vertical})` : ""}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-gray-500">
                                Not Assigned
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top w-36">
                          <ToggleButton
                            ClickYes={() => HandleLoginStatusToggleYes(data)}
                            ClickNo={() => HandleLoginStatusToggleNo(data)}
                            StateUpdate={!!data?.isAvailable}
                          />
                        </td>

                        <td className="px-3 py-3 align-top w-28">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openAllotUniversity(data)}
                              title="Allot University"
                              className="text-blue-600"
                            >
                              <FaCirclePlus size={18} />
                            </button>
                            <button
                              onClick={() => openUpdateOperations(data)}
                              title="Edit"
                              className="text-green-600"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button
                              onClick={() => HandleDeleteOperational(data)}
                              title="Delete"
                              className="text-red-600"
                            >
                              <MdDeleteForever size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-16 text-center text-gray-500"
                      >
                        No operations found. Create one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* footer / pagination (stays at bottom) */}
          <div className="px-4 py-3 border-t dark:border-slate-700 bg-white dark:bg-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {visibleList.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {OperationalManagerTotalDocs}
                </span>
              </div>
              <div>
                <ul className="inline-flex items-center -space-x-px">
                  <li>
                    <button
                      onClick={() =>
                        handlePageChange(OperationalManagerCurrentPage - 1)
                      }
                      className="px-3 py-1 border rounded-l"
                    >
                      <IoChevronBack />
                    </button>
                  </li>
                  <li>
                    <div className="px-4 py-1 border">
                      {OperationalManagerCurrentPage} /{" "}
                      {OperationalManagerTotalPages || 1}
                    </div>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        handlePageChange(OperationalManagerCurrentPage + 1)
                      }
                      className="px-3 py-1 border rounded-r"
                    >
                      <IoChevronForwardOutline />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* allot university modal */}
      {allotUniversityOpen && (
        <Allotuniversity
          HandleOnClickUpdatePushUniversity={HandleOnClickUpdatePushUniversity}
          HandleRemoveUniversity={HandleRemoveUniversity}
          OnCloseAllotUniversity={closeAllotUniversity}
          FetchTheListData={operationalDataById}
        />
      )}

      {/* update modal */}
      {updateOperationsOpen && editOperationsData && (
        <UpdateOperations
          EditOperationsUpdate={editOperationsData}
          FetchOperationalManagerByPagination={
            FetchOperationalManagerByPagination
          }
          HandleCloseUpdateOperations={closeUpdateOperations}
        />
      )}
    </>
  );
};

export default ListOperations;
