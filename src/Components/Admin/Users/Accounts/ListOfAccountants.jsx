import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { IoChevronForwardOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import ToggleButton from "../../../../Common/ToggleButton";
import UpdateAccountant from "./UpdateAccountant";
import Allotuniversity from "../../../../Helper/Allotuniversity";
import { useSelector } from "react-redux";
import Loader from "../../../../Helper/Loader";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ListOfAccountants = ({
  HandleCloseCreateAccountant,
  AccountantLoading,
  AccountantError,
  Accountant,
  GetAccountantData,
}) => {
  const [QuerySeachData, SetQuerySeachData] = useState("");

  const HandleSearchQuery = (e) => {
    const searchValue = e.target.value;
    SetQuerySeachData(searchValue);
    GetAccountantData(1, 100, searchValue);
  };

  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  // Allot Accountant
  const [GetAccountantDataByClick, setGetAccountantDataByClick] = useState();

  const [AssignedUniversityToAccountant, setAssignedUniversityToAccountant] =
    useState(false);

  const HandleAllotUniversitytoAccountantOpenButton = (data) => {
    setAssignedUniversityToAccountant(true);
    setGetAccountantDataByClick(data);
    // optionally fetch details
    HandleGetAccountant(data);
  };
  const HandleAllotUniversitytoAccountantCloseButton = () => {
    setAssignedUniversityToAccountant(false);
  };

  // Update Accountant
  const [OpenUpdateAccount, setOpenUpdateAccount] = useState(false);
  const HandleUpdateAccountantOpenButton = (data) => {
    setOpenUpdateAccount(true);
    setGetAccountantDataByClick(data);
  };
  const HandleUpdateAccountantCloseButton = () => {
    setOpenUpdateAccount(false);
  };

  // Re useable function
  const HandleUpdateStatusTogglCounsellor = async (
    AccountantId,
    BooleanValue
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/accountant-isavailable-toggle`,
        { AccountantId, BooleanValue },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        GetAccountantData();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // toggle status
  const HandleAvailableStatusToggleYes = (data) => {
    HandleUpdateStatusTogglCounsellor(data?._id, true);
  };

  const HandleAvailableStatusToggleNo = (data) => {
    HandleUpdateStatusTogglCounsellor(data?._id, false);
  };

  const [AccountantDataByid, setAccountantDataByid] = useState(null);
  // get Accountant by id
  const HandleGetAccountant = async (data) => {
    if (!data?._id) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetAccountantById/${data?._id}`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setAccountantDataByid(response?.data?.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Allot University To Accountant
  const HandleOnClickUpdatePushUniversity = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/accountant-alloted-university`,
        { id: GetAccountantDataByClick?._id, universityId: data?._id },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        HandleGetAccountant(GetAccountantDataByClick);
        GetAccountantData();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  //  Remove University To Accountant
  const HandleRemoveUniversity = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/accountant-remove-university`,
        { id: GetAccountantDataByClick?._id, universityId: data?._id },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        HandleGetAccountant(GetAccountantDataByClick);
        GetAccountantData();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const HandleDeleteAccountant = async (data) => {
    Swal.fire({
      title: `Do you want to Delete ${data?.name} `,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
      customClass: {
        confirmButton: "custom-confirm-button",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        HandleDeleteAccountantApi(data?._id, true);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const HandleDeleteAccountantApi = async (AccountantId, BooleanValue) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteAccountantForm`,
        { AccountantId, BooleanValue },
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
            GetAccountantData();
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

  // filtered list by current university
  const filteredAccountants = Accountant?.filter(
    (data) =>
      !data?.isDeleted &&
      data?.allotedUniversities?.some(
        (university) => university?._id === UniversityGetDataFromRedux?.id
      )
  );

  return (
    <>
      <section className="pt-2 text-xs flex flex-col h-[calc(100vh-110px)]">
        {/* main card: header + table + footer */}
        <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 shadow-md sm:rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 gap-3">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
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
                  id="QuerySeachData"
                  name="QuerySeachData"
                  value={QuerySeachData}
                  onChange={HandleSearchQuery}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500
                      focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600
                      dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search accountants..."
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm hidden md:block">
                <label>Items per page: </label>
                <select className="p-2 border shadow-lg text-xs ml-2">
                  <option value="">Select</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="20">20</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table for md+ */}
          <div className="overflow-auto pb-2.5 px-4 flex-1">
            <table className="min-w-[900px] w-full text-sm text-left text-slate-900">
              <thead className="text-sm sticky top-0 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {[
                    "Sr No",
                    "Photo",
                    "Name",
                    "Alloted University",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th key={header} className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                          {header}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {AccountantLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8">
                      <div className="flex justify-center">
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : filteredAccountants?.length ? (
                  filteredAccountants.map((data, index) => (
                    <tr
                      key={data?._id}
                      className="bg-white dark:bg-slate-900 dark:text-white border-b"
                    >
                      <td className="px-4 py-3 align-top">{index + 1}</td>

                      <td className="px-4 py-3 align-top">
                        <img
                          src={data?.photo}
                          alt=""
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>

                      <td className="px-4 py-3 align-top">
                        <div className="max-w-xs">
                          <div className="font-medium">{data?.name}</div>
                          <div className="text-xs text-gray-500">
                            Employee Id: {data?.code}
                          </div>
                          <div className="text-xs text-gray-500">
                            Email: {data?.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            Phone: {data?.contact}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col gap-1">
                          {data?.allotedUniversities?.length ? (
                            data?.allotedUniversities.map((univ, i) => (
                              <div key={i} className="text-xs uppercase">
                                <span>{univ?.name}</span>
                                <span className="text-gray-400">
                                  {" "}
                                  ({univ?.vertical})
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-gray-500">
                              Not Assigned University
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 align-top">
                        <ToggleButton
                          ClickYes={() => HandleAvailableStatusToggleYes(data)}
                          ClickNo={() => HandleAvailableStatusToggleNo(data)}
                          StateUpdate={data?.isAvailable}
                        />
                      </td>

                      <td className="px-4 py-3 align-top">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              HandleAllotUniversitytoAccountantOpenButton(data)
                            }
                            title="Allot University"
                            className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <FaCirclePlus size={18} />
                          </button>

                          <button
                            onClick={() =>
                              HandleUpdateAccountantOpenButton(data)
                            }
                            title="Edit Accountant"
                            className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <FaEdit size={18} />
                          </button>

                          <button
                            onClick={() => HandleDeleteAccountant(data)}
                            title="Delete Accountant"
                            className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-red-600"
                          >
                            <MdDeleteForever size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      Not Created ANY Data Inside This University
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked cards */}
          <div className="block md:hidden px-3 pb-4">
            {AccountantLoading ? (
              <div className="py-8 flex justify-center">
                <Loader />
              </div>
            ) : filteredAccountants?.length ? (
              filteredAccountants.map((data, idx) => (
                <div
                  key={data?._id}
                  className="bg-white dark:bg-slate-900 dark:text-white rounded-lg shadow-sm p-4 mb-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={data?.photo}
                      alt=""
                      className="w-14 h-14 rounded object-cover"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{data?.name}</div>
                          <div className="text-xs text-gray-500">
                            Employee Id: {data?.code}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              HandleAllotUniversitytoAccountantOpenButton(data)
                            }
                            className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                            aria-label="Allot university"
                          >
                            <FaCirclePlus />
                          </button>

                          <button
                            onClick={() =>
                              HandleUpdateAccountantOpenButton(data)
                            }
                            className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                            aria-label="Edit"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => HandleDeleteAccountant(data)}
                            className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-red-600"
                            aria-label="Delete"
                          >
                            <MdDeleteForever />
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                        <div>Email: {data?.email}</div>
                        <div>Phone: {data?.contact}</div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs">
                          {data?.allotedUniversities?.length ? (
                            data?.allotedUniversities.map((univ, i) => (
                              <div key={i} className="uppercase text-xs">
                                {univ?.name}{" "}
                                <span className="text-gray-400">
                                  ({univ?.vertical})
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-gray-500">
                              Not Assigned University
                            </div>
                          )}
                        </div>

                        <div>
                          <ToggleButton
                            ClickYes={() =>
                              HandleAvailableStatusToggleYes(data)
                            }
                            ClickNo={() => HandleAvailableStatusToggleNo(data)}
                            StateUpdate={data?.isAvailable}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Not Created ANY Data Inside This University
              </div>
            )}
          </div>

          {/* Pagination area (kept minimal, you can expand) */}
          <nav className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <span className="text-xs text-gray-500">
                Showing {filteredAccountants?.length || 0} of{" "}
                {Accountant?.length || 0}
              </span>
              {/* If you have page state & handlers, replace placeholders below with real values */}
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 text-sm border rounded">
                  Prev
                </button>
                <div className="px-3 py-1 border text-sm rounded">1 - 1</div>
                <button className="px-2 py-1 text-sm border rounded">
                  Next
                </button>
              </div>
            </div>
          </nav>
        </div>
      </section>

      {/* Update modal */}
      {OpenUpdateAccount && (
        <UpdateAccountant
          GetAccountantDataByClick={GetAccountantDataByClick}
          HandleUpdateAccountantCloseButton={HandleUpdateAccountantCloseButton}
          AccountantLoading={AccountantLoading}
          AccountantError={AccountantError}
          Accountant={Accountant}
          GetAccountantData={GetAccountantData}
        />
      )}

      {/* Allot university modal */}
      {AssignedUniversityToAccountant && (
        <Allotuniversity
          OnCloseAllotUniversity={HandleAllotUniversitytoAccountantCloseButton}
          HandleOnClickUpdatePushUniversity={HandleOnClickUpdatePushUniversity}
          HandleRemoveUniversity={HandleRemoveUniversity}
          FetchTheListData={AccountantDataByid}
        />
      )}
    </>
  );
};

export default ListOfAccountants;
