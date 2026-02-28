import React, { useEffect, useState } from "react";
import { IoChevronForwardOutline, IoChevronBack } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { AiTwotoneEdit } from "react-icons/ai";
import UpdateDepartments from "./UpdateDepartments";
import ToggleButton from "../../../../Common/ToggleButton";
import Loader from "../../../../Helper/Loader";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const ListOfDepartments = ({
  DepartmentListData,
  DepartmentCurrentPage,
  DepartmentTotalPages,
  DepartmentLimit,
  DepartmentLoading,
  DepartmentTotalDocs,
  handleLimitChange,
  handlePageChange,
  FetchDepartmentByPagination,
}) => {
  const [QuerySeachData, SetQuerySeachData] = useState("");
  const [OpenUpdateListItemProgram, setOpenUpdateListItemProgram] =
    useState(false);
  const [EditUpdateData, setEditUpdateData] = useState(null);

  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  // ===== Search =====
  const HandleSearchQuery = (e) => {
    const searchValue = e.target.value;
    SetQuerySeachData(searchValue);
    FetchDepartmentByPagination(1, DepartmentLimit, searchValue);
  };

  // ===== Update modal open/close =====
  const HandleButtonUpdateListItemProgram = () => {
    setOpenUpdateListItemProgram(true);
  };

  const HandleCloseButtonUpdateListPrograms = () => {
    setOpenUpdateListItemProgram(false);
  };

  // ===== Status toggle =====
  const HandleUpdateStatusToggleDepartment = async (
    DepartmentId,
    BooleanValue
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/DepartmentisAvailableToggle`,
        { DepartmentId, BooleanValue },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchDepartmentByPagination();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const HandleDepartmentstatusToggleYes = (data) => {
    HandleUpdateStatusToggleDepartment(data?._id, true);
  };

  const HandleDepartmentstatusToggleNo = (data) => {
    HandleUpdateStatusToggleDepartment(data?._id, false);
  };

  // ===== Delete Department =====
  const HandleDeleteDepartment = async (data) => {
    Swal.fire({
      title: `Do you want to Delete ${data?.name}?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      customClass: {
        confirmButton: "swal2-confirm",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        HandleDeleteDepartmentAPI(data?._id, true);
      }
    });
  };

  const HandleDeleteDepartmentAPI = async (DepartmentId, BooleanValue) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteDepartmentForm`,
        { DepartmentId, BooleanValue },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        Swal.fire({
          title: `Deleted Successfully!`,
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            FetchDepartmentByPagination();
          }
        });
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Filter current university ke departments
  const filteredDepartments =
    DepartmentListData?.filter(
      (data) =>
        data?.university?._id === UniversityGetDataFromRedux?.id &&
        !data?.isDeleted
    ) || [];

  const hasAnyDepartment = DepartmentListData?.some(
    (data) =>
      data?.university?._id === UniversityGetDataFromRedux?.id &&
      !data?.isDeleted
  );

  return (
    <>
      <section className="px-1 sm:py-4">
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            background: "var(--surface)",
            boxShadow: "var(--soft-shadow)",
            borderRadius: "18px",
          }}
        >
          {/* Top controls (search + limit) - same pattern as Universities */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-4">
            <div className="flex-1">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="QuerySeachData"
                  name="QuerySeachData"
                  value={QuerySeachData}
                  onChange={HandleSearchQuery}
                  placeholder="Search departments..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border text-sm bg-gray-50 dark:bg-gray-700 dark:text-white"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label
                className="text-sm"
                style={{ color: "var(--muted)" }}
                htmlFor="limit"
              >
                Items per page
              </label>
              <select
                id="limit"
                className="px-3 py-2 rounded-full text-xs border bg-white dark:bg-gray-800 dark:text-white"
                value={DepartmentLimit}
                onChange={handleLimitChange}
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
              >
                <option value="">Show All</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>

          {/* Table wrapper - same height behavior as universities */}
          <div className="px-4 pb-4">
            <div className="h-[calc(100vh-240px)] min-h-[175px] overflow-auto">
              {DepartmentLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader />
                </div>
              ) : filteredDepartments.length ? (
                <table
                  className="min-w-full text-sm table-fixed"
                  style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}
                >
                  <thead className="sticky top-0 bg-white dark:bg-gray-900">
                    <tr>
                      {["Name", "Department", "Status", "Action"].map(
                        (header) => (
                          <th
                            key={header}
                            className="px-4 py-2 text-left"
                            style={{
                              color: "var(--brand-ink)",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepartments.map((data, index) => (
                      <tr
                        key={data?._id || index}
                        style={{
                          background: "var(--surface)",
                          boxShadow: "0 4px 12px rgba(16,24,40,0.03)",
                          borderRadius: 12,
                        }}
                        className="align-middle"
                      >
                        {/* Department Name */}
                        <td className="px-4 py-3">
                          <span
                            className="whitespace-nowrap overflow-hidden text-ellipsis"
                            style={{
                              color: "var(--brand-ink)",
                              fontWeight: 600,
                            }}
                          >
                            {data?.name}
                          </span>
                        </td>

                        {/* University Name (they called it "Department" header earlier) */}
                        <td className="px-4 py-3">
                          <div className="w-full max-w-lg">
                            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                              {data?.university?.name}
                            </span>
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="px-4 py-3">
                          <ToggleButton
                            ClickYes={() =>
                              HandleDepartmentstatusToggleYes(data)
                            }
                            ClickNo={() => HandleDepartmentstatusToggleNo(data)}
                            StateUpdate={data?.isAvailable}
                          />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 items-center justify-center">
                            <button
                              onClick={() => {
                                HandleButtonUpdateListItemProgram();
                                setEditUpdateData(data);
                              }}
                              className="text-green-600 dark:text-green-400"
                              aria-label={`Edit ${data?.name}`}
                            >
                              <AiTwotoneEdit size={18} />
                            </button>
                            <button
                              onClick={() => HandleDeleteDepartment(data)}
                              className="text-red-600 dark:text-red-400"
                              aria-label={`Delete ${data?.name}`}
                            >
                              <MdDelete size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : DepartmentListData?.length ? (
                // Case: data hai, but current university ke liye nahi
                <div
                  className="flex items-center justify-center h-full text-sm font-medium"
                  style={{ color: "var(--muted)" }}
                >
                  {hasAnyDepartment
                    ? "Not created any data inside this university."
                    : "Select the university."}
                </div>
              ) : (
                // Fully empty state
                <div
                  className="flex items-center justify-center h-full text-sm font-semibold"
                  style={{ color: "var(--muted)" }}
                >
                  Create Department
                </div>
              )}
            </div>

            {/* Pagination - same layout as Universities */}
            <nav
              className="flex text-sm flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 mt-2 px-1"
              aria-label="Table navigation"
            >
              <span
                className="font-normal flex gap-1 flex-row"
                style={{ color: "var(--muted)" }}
              >
                Showing
                <span
                  className="font-semibold"
                  style={{ color: "var(--brand-ink)" }}
                >
                  {filteredDepartments.length}
                </span>
                of
                <span
                  className="font-semibold"
                  style={{ color: "var(--brand-ink)" }}
                >
                  {DepartmentTotalDocs}
                </span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px text-xs">
                <li>
                  <button
                    onClick={() => handlePageChange(DepartmentCurrentPage - 1)}
                    className="flex items-center justify-center h-full py-1.5 px-3 ml-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <IoChevronBack />
                  </button>
                </li>
                <li>
                  <div className="flex items-center justify-center py-1.5 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                    {DepartmentCurrentPage + "-" + DepartmentTotalPages}
                  </div>
                </li>
                <li>
                  <button
                    onClick={() => handlePageChange(DepartmentCurrentPage + 1)}
                    className="flex items-center justify-center h-full py-1.5 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <IoChevronForwardOutline />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>

      {OpenUpdateListItemProgram && (
        <UpdateDepartments
          FetchDepartmentByPagination={FetchDepartmentByPagination}
          EditUpdateData={EditUpdateData}
          CloseUpdateButton={HandleCloseButtonUpdateListPrograms}
        />
      )}
    </>
  );
};

export default ListOfDepartments;
