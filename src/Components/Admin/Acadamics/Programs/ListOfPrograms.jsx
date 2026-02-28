import React, { useEffect, useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import UpdatePrograms from "./UpdatePrograms";
import ToggleButton from "../../../../Common/ToggleButton";
import Loader from "../../../../Helper/Loader";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const ListOfPrograms = ({
  ProgramListData,
  ProgramCurrentPage,
  ProgramTotalPages,
  ProgramLimit,
  ProgramLoading,
  ProgramTotalDocs,
  handleLimitChange,
  handlePageChange,
  FetchProgramByPagination,
}) => {
  const [QuerySeachData, SetQuerySeachData] = useState("");
  const [UpdateCreateButton, setUpdateCreateButton] = useState(false);
  const [EditUpdateProgram, setEditUpdateProgram] = useState(null);

  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  // ===== Search =====
  const HandleSearchQuery = (e) => {
    const searchValue = e.target.value;
    SetQuerySeachData(searchValue);
    FetchProgramByPagination(1, ProgramLimit, searchValue);
  };

  // ===== Edit modal open/close =====
  const HandleButtonUpdateOpenCreateProgram = () => {
    setUpdateCreateButton(true);
  };

  const HandleButtonUpdateCloseCreateProgram = () => {
    setUpdateCreateButton(false);
  };

  // ===== Status Toggle =====
  const HandleUpdateStatusToggleProgram = async (ProgramId, BooleanValue) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ProgramisAvailableToggle`,
        { ProgramId, BooleanValue },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchProgramByPagination();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const HandleProgramStatusYes = (data) => {
    HandleUpdateStatusToggleProgram(data?._id, true);
  };
  const HandleProgramStatusNo = (data) => {
    HandleUpdateStatusToggleProgram(data?._id, false);
  };

  // ===== Delete Program =====
  const HandleDeleteProgram = async (data) => {
    Swal.fire({
      title: `Do you want to Delete ${data?.shortName} `,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
      customClass: {
        confirmButton: "custom-confirm-button",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        HandleDeleteProgramAPI(data?._id, true);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const HandleDeleteProgramAPI = async (ProgramId, BooleanValue) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteProgramForm`,
        { ProgramId, BooleanValue },
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
            FetchProgramByPagination();
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

  // ===== Filter data as per selected university (same logic, cleaner) =====
  const filteredPrograms =
    ProgramListData?.filter(
      (data) =>
        data?.university?._id === UniversityGetDataFromRedux?.id &&
        !data?.isDeleted
    ) || [];

  const hasAnyForCurrentUniversity = ProgramListData?.some(
    (data) =>
      data?.university?._id === UniversityGetDataFromRedux?.id &&
      !data?.isDeleted
  );

  const hasBlankUniversity = ProgramListData?.some(
    (data) => data?.university?._id === "" && !data?.isDeleted
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
          {/* Top controls: Search + Limit (same as Universities) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-4">
            <div className="flex-1">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                  onChange={HandleSearchQuery}
                  value={QuerySeachData}
                  name="QuerySeachData"
                  id="QuerySeachData"
                  className="w-full pl-10 pr-4 py-2 rounded-full border text-sm bg-gray-50 dark:bg-gray-700 dark:text-white"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                  placeholder="Search programs..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label
                htmlFor="itemsPerPage"
                className="text-sm"
                style={{ color: "var(--muted)" }}
              >
                Items per page
              </label>
              <select
                id="itemsPerPage"
                className="px-3 py-2 rounded-full text-xs border bg-white dark:bg-gray-800 dark:text-white"
                value={ProgramLimit}
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

          {/* Table wrapper same layout as Universities */}
          <div className="px-4 pb-4">
            <div className="h-[calc(100vh-245px)] min-h-[175px] overflow-auto">
              {ProgramLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader />
                </div>
              ) : filteredPrograms.length ? (
                <table
                  className="min-w-full text-sm table-fixed"
                  style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}
                >
                  <thead className="sticky top-0 bg-white dark:bg-gray-900">
                    <tr>
                      {[
                        "Name",
                        "Short Name",
                        "Type",
                        "Department",
                        "University",
                        "Status",
                        "Action",
                      ].map((head) => (
                        <th
                          key={head}
                          className="px-4 py-2 text-left"
                          style={{
                            color: "var(--brand-ink)",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrograms.map((data, index) => (
                      <tr
                        key={data?._id || index}
                        style={{
                          background: "var(--surface)",
                          boxShadow: "0 4px 12px rgba(16,24,40,0.03)",
                          borderRadius: 12,
                        }}
                        className="align-middle"
                      >
                        {/* Name */}
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

                        {/* Short Name */}
                        <td className="px-4 py-3">
                          <div className="w-full max-w-lg whitespace-nowrap overflow-hidden text-ellipsis">
                            {data?.shortName}
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3">
                          <div className="w-full max-w-lg whitespace-nowrap overflow-hidden text-ellipsis uppercase">
                            {data?.programType?.name}
                          </div>
                        </td>

                        {/* Department */}
                        <td className="px-4 py-3">
                          <div className="w-full max-w-lg whitespace-nowrap overflow-hidden text-ellipsis">
                            {data?.Department?.name}
                          </div>
                        </td>

                        {/* University */}
                        <td className="px-4 py-3">
                          <div className="w-full max-w-lg whitespace-nowrap overflow-hidden text-ellipsis">
                            ({data?.university?.shortName}) -{" "}
                            {data?.university?.name}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <ToggleButton
                            ClickYes={() => HandleProgramStatusYes(data)}
                            ClickNo={() => HandleProgramStatusNo(data)}
                            StateUpdate={data?.isAvailable}
                          />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 items-center justify-center">
                            <button
                              onClick={() => {
                                HandleButtonUpdateOpenCreateProgram();
                                setEditUpdateProgram(data);
                              }}
                              className="text-base text-green-600 dark:text-green-500 hover:underline"
                              aria-label={`Edit ${data?.name}`}
                            >
                              <AiTwotoneEdit size={20} />
                            </button>
                            <button
                              onClick={() => HandleDeleteProgram(data)}
                              className="text-base text-red-600 dark:text-red-500 hover:underline"
                              aria-label={`Delete ${data?.name}`}
                            >
                              <MdDelete size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : ProgramListData?.length ? (
                <div
                  className="flex justify-center items-center h-full text-sm font-medium"
                  style={{ color: "var(--muted)" }}
                >
                  {hasAnyForCurrentUniversity
                    ? "Not Created ANY Data Inside This University"
                    : hasBlankUniversity
                    ? "Select The University"
                    : "Not Created ANY Data Inside This University"}
                </div>
              ) : (
                <div
                  className="flex justify-center items-center h-full text-sm font-semibold"
                  style={{ color: "var(--muted)" }}
                >
                  No Data Found for This University
                </div>
              )}
            </div>

            {/* Pagination - same style as others */}
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
                  {ProgramListData.length}
                </span>
                of
                <span
                  className="font-semibold"
                  style={{ color: "var(--brand-ink)" }}
                >
                  {ProgramTotalDocs}
                </span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px text-xs">
                <li>
                  <button
                    onClick={() => handlePageChange(ProgramCurrentPage - 1)}
                    className="flex items-center justify-center h-full py-1.5 px-3 ml-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <IoChevronBack />
                  </button>
                </li>
                <li>
                  <div className="flex items-center justify-center py-1.5 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                    {ProgramCurrentPage + "-" + ProgramTotalPages}
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

      {UpdateCreateButton && (
        <UpdatePrograms
          EditUpdateProgram={EditUpdateProgram}
          FetchProgramByPagination={FetchProgramByPagination}
          CloseCreateProgram={HandleButtonUpdateCloseCreateProgram}
        />
      )}
    </>
  );
};

export default ListOfPrograms;
