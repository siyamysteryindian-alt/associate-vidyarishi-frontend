import React, { useEffect, useState } from "react";
import { IoChevronForwardOutline, IoChevronBack } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { AiTwotoneEdit } from "react-icons/ai";
import UpdateUniversity from "./UpdateUniversity";
import ToggleButton from "../../../../Common/ToggleButton";
import Loader from "../../../../Helper/Loader";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";
import CenterCode from "../../../../Common/CenterCode";
import StudentId from "../../../../Common/StudentId";
import PaymentDetails from "./PaymentDetails";
import { useSelector } from "react-redux";
import CreateUniversityApiKey from "./CreateUniversityApiKey";
import UniversityApiKeyModal from "./CreateUniversityApiKey";
import UpdateUniversityApiKey from "./UpdateUniversityApiKey";
import CreateApiKeyModal from "./CreateUniversityApiKey";
import UpdateApiKeyModal from "./UpdateUniversityApiKey";

const ListOfUniversities = ({
  UniversityListData,
  UniversityCurrentPage,
  UniversityTotalPages,
  UniversityLimit,
  UniversityLoading,
  UniversityTotalDocs,
  FetchUniversitiesByPagination,
  handlePageChange,
  handleLimitChange,
}) => {
  const [QuerySeachData, SetQuerySeachData] = useState("");
  const [EditUniversityData, setEditUniversityData] = useState(null);
  const [OpenUpdateListData, setOpenUpdateListData] = useState(false);
  const [AccountingWindowOpen, setAccountingWindowOpen] = useState(false);

  const [CenterCodeToggle, setCenterCodeToggle] = useState(false);
  const [StudentIdToggle, setStudentIdToggle] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [ApiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "create" or "update"
  const [SelectedUniversity, setSelectedUniversity] = useState(null);

  const ReduxLoggedUser = useSelector((state) => state?.user);
  const ReduxLSelectedUniversity = useSelector((state) => state?.university);

  // search
  const HandleSearchQuery = (e) => {
    const searchValue = e.target.value;
    SetQuerySeachData(searchValue);
    FetchUniversitiesByPagination(1, UniversityLimit, searchValue);
  };

  // delete
  const HandleDeleteUniversity = (data) => {
    Swal.fire({
      title: `Do you want to Delete ${data?.name}?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      customClass: {
        confirmButton: "swal2-confirm",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        HandleDeleteSpecializationAPI(data?._id, true);
      }
    });
  };

  const HandleDeleteSpecializationAPI = async (UniversityId, BooleanValue) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteUniversityForm`,
        { UniversityId, BooleanValue },
        { withCredentials: true },
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        Swal.fire({ title: "Deleted Successfully!", icon: "success" }).then(
          () => {
            FetchUniversitiesByPagination();
          },
        );
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };

  // update modal toggles
  const HandleOpenUpdateButton = () => setOpenUpdateListData(true);
  const HandleCloseUpdateButton = () => setOpenUpdateListData(false);

  // status updates (keeps same API calls)
  const HandleUpdateStatusToggle = async (UniversityId, BooleanValue) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/UniversityIsActiveToggle`,
        { UniversityId, BooleanValue },
        { withCredentials: true },
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchUniversitiesByPagination();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };

  const HandleStatusYes = (data) => HandleUpdateStatusToggle(data?._id, true);
  const HandleStatusNo = (data) => HandleUpdateStatusToggle(data?._id, false);

  // Vocational toggle
  const HandleUpdateVocationalToggle = async (UniversityId, BooleanValue) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/UniversityIsVocationalToggle`,
        { UniversityId, BooleanValue },
        { withCredentials: true },
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchUniversitiesByPagination();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };

  const HandleIsVocationalYes = (data) =>
    HandleUpdateVocationalToggle(data?._id, true);
  const HandleIsVocationalNo = (data) =>
    HandleUpdateVocationalToggle(data?._id, false);

  // hasLMS toggle
  const HandleUpdateHasLMSToggle = async (UniversityId, BooleanValue) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/UniversityHasLMSToggle`,
        { UniversityId, BooleanValue },
        { withCredentials: true },
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchUniversitiesByPagination();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };

  const HandleHasLMSYes = (data) => HandleUpdateHasLMSToggle(data?._id, true);
  const HandleHasLMSNo = (data) => HandleUpdateHasLMSToggle(data?._id, false);

  // unique center toggle
  const HandleUpdatehasUniqueCenterToggle = async (
    UniversityId,
    BooleanValue,
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/UniversityHasUniqueCenterToggle`,
        { UniversityId, BooleanValue },
        { withCredentials: true },
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchUniversitiesByPagination();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };
  const HandleHasUniqueCenterYes = (data) =>
    HandleUpdatehasUniqueCenterToggle(data?._id, true);
  const HandleHasUniqueCenterNo = (data) =>
    HandleUpdatehasUniqueCenterToggle(data?._id, false);

  // unique studentId toggle
  const HandleUpdatehasUniqueStudentIDToggle = async (
    UniversityId,
    BooleanValue,
  ) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/UniversityHasUniqueStudentIdToggle`,
        { UniversityId, BooleanValue },
        { withCredentials: true },
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchUniversitiesByPagination();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };
  const HandleHasUniqueStudentIdYes = (data) =>
    HandleUpdatehasUniqueStudentIDToggle(data?._id, true);
  const HandleHasUniqueStudentIdNo = (data) =>
    HandleUpdatehasUniqueStudentIDToggle(data?._id, false);

  // center code & student id panels
  const HandleOnClickCenterCodeOpen = () => {
    setCenterCodeToggle(true);
    setStudentIdToggle(false);
  };
  const HandleOnClickCenterCodeClose = () => setCenterCodeToggle(false);
  const HandleOnClickStudentIdOpen = () => {
    setStudentIdToggle(true);
    setCenterCodeToggle(false);
  };

  const HandleOnClickStudentIdClose = () => setStudentIdToggle(false);

  const HandleDelete = async (universityId) => {
    if (!window.confirm("Are you sure you want to delete this API key?"))
      return;

    const payload = {};

    try {
      setIsSubmitting(true);
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/university-dynamic-api-key/${universityId}`,

        { withCredentials: true },
      );
      toast.success(response?.data?.message || "API key deleted!");
      FetchUniversitiesByPagination();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete API key.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {/* Search & controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-4">
            <div className="flex-1">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                  </svg>
                </div>
                <input
                  id="SearchQuery"
                  name="SearchQuery"
                  value={QuerySeachData}
                  onChange={HandleSearchQuery}
                  placeholder="Search universities..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm mr-2" style={{ color: "var(--muted)" }}>
                Items per page
              </label>
              <select
                className="px-3 py-2 rounded-full text-sm"
                value={UniversityLimit}
                onChange={handleLimitChange}
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <option value="">All</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>

          {/* Table area */}
          <div className="px-4 pb-4">
            <div className="h-[calc(100vh-250px)] min-h-[175px] overflow-auto">
              {UniversityLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader />
                </div>
              ) : UniversityListData?.filter((d) => !d?.isDeleted)?.length ? (
                <table
                  className="min-w-full text-sm table-fixed"
                  style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}
                >
                  <thead className=" sticky top-0 bg-white">
                    <tr>
                      {[
                        "Logo",
                        "Name",
                        "Vertical",
                        "Status",
                        "Dealing With",
                        "Is Vocational",
                        "Has LMS?",
                        "Has Unique Center?",
                        "Has Unique Student Id?",
                        ...(ReduxLoggedUser?.role === "Admin"
                          ? ["Payment Details", "Api Key"]
                          : []),
                        "Action",
                      ].map((head) => (
                        <th
                          key={head}
                          className="px-4 py-2 mx-2 text-left"
                          style={{
                            color: "var(--brand-ink)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {UniversityListData.filter((d) => !d?.isDeleted).map(
                      (data, idx) => (
                        <tr
                          key={data?._id || idx}
                          style={{
                            background: "var(--surface)",
                            boxShadow: "0 4px 12px rgba(16,24,40,0.03)",
                            borderRadius: 12,
                          }}
                          className="align-top"
                        >
                          <td className="px-4 py-3">
                            <div
                              style={{
                                width: 56,
                                height: 40,
                                overflow: "hidden",
                                borderRadius: 8,
                              }}
                            >
                              <img
                                src={data?.photo}
                                alt={data?.name || "logo"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>

                          <td className="px-4 py-3 mx-2 ">
                            <div
                              style={{
                                color: "var(--brand-ink)",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {data?.name}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div>{data?.vertical}</div>
                          </td>

                          <td className="px-4 py-3">
                            <ToggleButton
                              ClickYes={() => HandleStatusYes(data)}
                              ClickNo={() => HandleStatusNo(data)}
                              StateUpdate={data?.isAvailable}
                            />
                          </td>

                          <td
                            className="px-4 py-3"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <div>{data?.UniversityDealingWith || "-"}</div>
                          </td>

                          <td className="px-4 py-3">
                            <ToggleButton
                              ClickYes={() => HandleIsVocationalYes(data)}
                              ClickNo={() => HandleIsVocationalNo(data)}
                              StateUpdate={data?.isVocational}
                            />
                          </td>

                          <td className="px-4 py-3">
                            <ToggleButton
                              ClickYes={() => HandleHasLMSYes(data)}
                              ClickNo={() => HandleHasLMSNo(data)}
                              StateUpdate={data?.hasLMS}
                            />
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <ToggleButton
                                ClickYes={() => HandleHasUniqueCenterYes(data)}
                                ClickNo={() => HandleHasUniqueCenterNo(data)}
                                StateUpdate={data?.hasUniqueCenter}
                              />
                              {/* {data?.hasUniqueCenter && (
                                <button
                                  onClick={() =>
                                    HandleOnClickCenterCodeOpen(data)
                                  }
                                  style={{ color: "var(--muted)" }}
                                >
                                  ⚙
                                </button>
                              )} */}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <ToggleButton
                                ClickYes={() =>
                                  HandleHasUniqueStudentIdYes(data)
                                }
                                ClickNo={() => HandleHasUniqueStudentIdNo(data)}
                                StateUpdate={data?.hasUniqueStudentID}
                              />
                              {/* {data?.hasUniqueStudentID && (
                                <button
                                  onClick={() =>
                                    HandleOnClickStudentIdOpen(data)
                                  }
                                  style={{ color: "var(--muted)" }}
                                >
                                  ⚙
                                </button>
                              )} */}
                            </div>
                          </td>

                          {ReduxLoggedUser?.role === "Admin" && (
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => {
                                  setAccountingWindowOpen(true);
                                  setEditUniversityData(data);
                                }}
                                style={{ color: "var(--brand-ink)" }}
                              >
                                <AiTwotoneEdit size={18} />
                              </button>
                            </td>
                          )}

                          <td className="px-4 py-3 text-center flex justify-center gap-3">
                            {/* CREATE BUTTON */}
                            {data?.vertical === "Online" ? (
                              <>
                                {!data?.UniversityApiKey && (
                                  <button
                                    onClick={() => {
                                      setApiKeyModalOpen(true);
                                      setModalType("create");
                                      setSelectedUniversity(data);
                                    }}
                                    className="text-green-600 px-4 py-2 bg-green-200 rounded-md hover:underline"
                                  >
                                    Create
                                  </button>
                                )}
                                {/* UPDATE BUTTON */}
                                {data?.UniversityApiKey && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setApiKeyModalOpen(true);
                                        setModalType("update");
                                        setSelectedUniversity(data);
                                      }}
                                      className="text-orange-500 px-4 py-2 bg-orange-200 rounded-md hover:underline"
                                    >
                                      Update
                                    </button>

                                    <button
                                      onClick={() => {
                                        HandleDelete(data?._id);
                                      }}
                                      className="text-red-500 px-4 py-2 bg-red-200 rounded-md hover:underline"
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <div className=" whitespace-nowrap text-yellow-800 px-4 py-2 bg-yellow-200 rounded-md hover:underline">
                                  No Api key for Distance
                                </div>
                              </>
                            )}
                          </td>

                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => {
                                  HandleOpenUpdateButton();
                                  setEditUniversityData(data);
                                }}
                                style={{ color: "var(--brand-ink)" }}
                              >
                                <AiTwotoneEdit size={18} />
                              </button>

                              <button
                                onClick={() => HandleDeleteUniversity(data)}
                                style={{ color: "#e11d48" }}
                                aria-label={`Delete ${data?.name}`}
                              >
                                <MdDelete size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              ) : (
                <div
                  className="flex items-center justify-center h-60 text-slate-500"
                  style={{ color: "var(--muted)" }}
                >
                  Create Universities
                </div>
              )}
            </div>

            {/* Pagination */}
            <nav
              className="flex text-sm flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 mt-2 px-1"
              aria-label="Table navigation"
            >
              <div style={{ color: "var(--muted)" }}>
                Showing{" "}
                <strong style={{ color: "var(--brand-ink)" }}>
                  {UniversityListData.length}
                </strong>{" "}
                of{" "}
                <strong style={{ color: "var(--brand-ink)" }}>
                  {UniversityTotalDocs}
                </strong>
              </div>

              <div className="inline-flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(UniversityCurrentPage - 1)}
                  className="px-3 py-1 rounded-full"
                  style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <IoChevronBack />
                </button>

                <div
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  {UniversityCurrentPage + " - " + UniversityTotalPages}
                </div>

                <button
                  onClick={() => handlePageChange(UniversityCurrentPage + 1)}
                  className="px-3 py-1 rounded-full"
                  style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <IoChevronForwardOutline />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </section>

      {/* Modals/Drawers */}
      {OpenUpdateListData && (
        <UpdateUniversity
          EditUniversityData={EditUniversityData}
          CloseUpdateButton={HandleCloseUpdateButton}
          FetchUniversitiesByPagination={FetchUniversitiesByPagination}
        />
      )}

      {AccountingWindowOpen && (
        <PaymentDetails
          EditUniversityData={EditUniversityData}
          HandleCloseUpdatePaymentButton={() => setAccountingWindowOpen(false)}
          FetchUniversitiesByPagination={FetchUniversitiesByPagination}
        />
      )}

      {ApiKeyModalOpen && modalType === "create" && (
        <CreateApiKeyModal
          universityId={SelectedUniversity?._id}
          onSaved={FetchUniversitiesByPagination}
          onClose={() => setApiKeyModalOpen(false)}
        />
      )}

      {ApiKeyModalOpen && modalType === "update" && (
        <UpdateApiKeyModal
          universityId={SelectedUniversity?._id}
          onSaved={FetchUniversitiesByPagination}
          onClose={() => setApiKeyModalOpen(false)}
        />
      )}

      {CenterCodeToggle && (
        <CenterCode onClose={HandleOnClickCenterCodeClose} />
      )}

      {StudentIdToggle && <StudentId onClose={HandleOnClickStudentIdClose} />}
    </>
  );
};

export default ListOfUniversities;
