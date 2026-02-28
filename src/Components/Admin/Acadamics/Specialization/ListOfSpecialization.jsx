import React, { useEffect, useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import UpdateSpecialization from "./UpdateSpecialization";
import ToggleButton from "../../../../Common/ToggleButton";
import Loader from "../../../../Helper/Loader";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";

const ListOfSpecialization = ({
  SpecializationListData,
  SpecializationCurrentPage,
  SpecializationTotalPages,
  SpecializationLimit,
  SpecializationLoading,
  SpecializationTotalDocs,
  handlePageChange,
  handleLimitChange,
  FetchSpecializationByPagination,
}) => {
  const [QuerySeachData, SetQuerySeachData] = useState("");

  const [CreateSpecialization, setCreateSpecialization] = useState(false);
  const [EditSpecializationUpdate, setEditSpecializationUpdate] =
    useState(null);

  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  // ===== Search =====
  const HandleSearchQuery = (e) => {
    const searchValue = e.target.value;
    SetQuerySeachData(searchValue);
    FetchSpecializationByPagination(1, SpecializationLimit, searchValue);
  };

  // ===== Update Modal Toggle (naming same as your logic) =====
  const HandleButtonUpdateOpenCreateSpecialization = () => {
    setCreateSpecialization(true);
  };

  const HandleButtonUpdateCloseCreateSpecialization = () => {
    setCreateSpecialization(false);
  };

  // ===== Status Toggle =====
  const HandleUpdateStatusToggleSpecialization = async (
    SpecializationId,
    BooleanValue
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/SpecializationisAvailableToggle`,
        { SpecializationId, BooleanValue },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchSpecializationByPagination();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const HandleStatusSpecializationToggleYes = (data) => {
    HandleUpdateStatusToggleSpecialization(data?._id, true);
  };
  const HandleStatusSpecializationToggleNo = (data) => {
    HandleUpdateStatusToggleSpecialization(data?._id, false);
  };

  // ===== Delete Specialization =====
  const HandleDeleteSpecialization = async (data) => {
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
        HandleDeleteSpecializationAPI(data?._id, true);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const HandleDeleteSpecializationAPI = async (
    SpecializationId,
    BooleanValue
  ) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteSpecializationForm`,
        { SpecializationId, BooleanValue },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        Swal.fire({
          title: `Deleted Successfulyy!`,
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            FetchSpecializationByPagination();
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

  // filter list for selected university (same logic as before, bas clean)
  const filteredSpecializations =
    SpecializationListData?.filter(
      (data) =>
        data?.university?._id === UniversityGetDataFromRedux?.id &&
        !data?.isDeleted
    ) || [];

  const hasAnyForCurrentUniversity = SpecializationListData?.some(
    (data) =>
      data?.university?._id === UniversityGetDataFromRedux?.id &&
      !data?.isDeleted
  );

  const hasBlankUniversity = SpecializationListData?.some(
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
          {/* Top controls: Search + Limit (same UI pattern as Universities / Specializations) */}
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
                  id="QuerySeachData"
                  name="QuerySeachData"
                  value={QuerySeachData}
                  onChange={HandleSearchQuery}
                  className="w-full pl-10 pr-4 py-2 rounded-full border text-sm bg-gray-50 dark:bg-gray-700 dark:text-white"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                  placeholder="Search specialization..."
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
                value={SpecializationLimit}
                onChange={handleLimitChange}
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
              >
                <option value="">Select</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>

          {/* Table wrapper same height pattern */}
          <div className="px-4 pb-4">
            <div className="h-[calc(100vh-250px)] min-h-[175px] overflow-auto">
              {SpecializationLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader />
                </div>
              ) : filteredSpecializations.length ? (
                <table
                  className="min-w-full text-sm table-fixed"
                  style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}
                >
                  <thead className="sticky top-0 bg-white dark:bg-gray-900">
                    <tr>
                      {[
                        "Name",
                        "Program",
                        "Type",
                        "Scheme",
                        "MODE",
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
                    {filteredSpecializations.map((data, index) => (
                      <tr
                        key={data?._id || index}
                        style={{
                          background: "var(--surface)",
                          boxShadow: "0 4px 12px rgba(16,24,40,0.03)",
                          borderRadius: 12,
                        }}
                        className="align-middle"
                      >
                        {/* Name + ShortName */}
                        <td className="px-4 py-3">
                          <span
                            className="whitespace-nowrap overflow-hidden text-ellipsis"
                            style={{
                              color: "var(--brand-ink)",
                              fontWeight: 600,
                            }}
                          >
                            {data?.name}{" "}
                            {data?.shortName && `(${data?.shortName})`}
                          </span>
                        </td>

                        {/* Program */}
                        <td className="px-4 py-3">
                          <div className="w-full max-w-lg">
                            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                              {data?.Program?.name}{" "}
                              {data?.Program?.shortName &&
                                `(${data?.Program?.shortName})`}
                            </span>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3">
                          <div className="w-full max-w-lg">
                            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                              {data?.Program?.programType?.name}
                            </span>
                          </div>
                        </td>

                        {/* Scheme */}
                        <td className="px-4 py-3">
                          <div className="w-full max-w-lg">
                            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                              {data?.scheme?.name}
                            </span>
                          </div>
                        </td>

                        {/* Mode */}
                        <td className="px-4 py-3">
                          <div className="w-full max-w-lg">
                            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                              {data?.mode?.name}
                            </span>
                          </div>
                        </td>

                        {/* University */}
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
                              HandleStatusSpecializationToggleYes(data)
                            }
                            ClickNo={() =>
                              HandleStatusSpecializationToggleNo(data)
                            }
                            StateUpdate={data?.isAvailable}
                          />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 items-center justify-center">
                            <button
                              onClick={() => {
                                HandleButtonUpdateOpenCreateSpecialization();
                                setEditSpecializationUpdate(data);
                              }}
                              className="text-green-600 dark:text-green-400"
                              aria-label={`Edit ${data?.name}`}
                            >
                              <AiTwotoneEdit size={18} />
                            </button>
                            <button
                              onClick={() => HandleDeleteSpecialization(data)}
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
              ) : SpecializationListData?.length ? (
                <div
                  className="flex items-center justify-center h-full text-sm font-medium"
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
                  className="flex items-center justify-center h-full text-sm font-semibold"
                  style={{ color: "var(--muted)" }}
                >
                  Create Specialization
                </div>
              )}
            </div>

            {/* Pagination (same pattern) */}

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
                  {filteredSpecializations.length}
                </span>
                of
                <span
                  className="font-semibold"
                  style={{ color: "var(--brand-ink)" }}
                >
                  {SpecializationTotalDocs}
                </span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px text-xs">
                <li>
                  <button
                    onClick={() =>
                      handlePageChange(SpecializationCurrentPage - 1)
                    }
                    className="flex items-center justify-center h-full py-1.5 px-3 ml-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <IoChevronBack />
                  </button>
                </li>
                <li>
                  <div className="flex items-center justify-center py-1.5 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                    {SpecializationCurrentPage + "-" + SpecializationTotalPages}
                  </div>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handlePageChange(SpecializationCurrentPage + 1)
                    }
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

      {CreateSpecialization && (
        <UpdateSpecialization
          EditSpecializationUpdate={EditSpecializationUpdate}
          FetchSpecializationByPagination={FetchSpecializationByPagination}
          CloseCreateSpecialization={
            HandleButtonUpdateCloseCreateSpecialization
          }
        />
      )}
    </>
  );
};

export default ListOfSpecialization;
