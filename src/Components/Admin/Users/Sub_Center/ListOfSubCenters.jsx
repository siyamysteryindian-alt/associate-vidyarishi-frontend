import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import image from "../../../../../public/logo.jpg";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import UpdateSubCenters from "./UpdateSubCenters";
import ToggleButton from "../../../../Common/ToggleButton";
import Swal from "sweetalert2";
import Loader from "../../../../Helper/Loader";
import toast from "react-hot-toast";
import axios from "axios";
import Allotuniversity from "../../../../Helper/Allotuniversity";
import UseGetLoggedUser from "../../../../CustomHooks/UseGetLoggedUser";
import { useSelector } from "react-redux";

const ListOfSubCenters = ({
  SubCenterListData,
  SubCenterCurrentPage,
  SubCenterTotalPages,
  SubCenterLimit,
  SubCenterLoading,
  SubCenterTotalDocs,
  FetchSubCenterByPagination,
  handleLimitChange,
  handlePageChange,
}) => {
  const {
    GetLoginUserDetails,
    CheckingUserLogged,
    GetLoggedUserLoader,
    LoggedUserData,
  } = UseGetLoggedUser();

  useEffect(() => {
    GetLoginUserDetails();
  }, []);

  const ReduxLoggedUser = useSelector((state) => state?.user);

  const [QuerySeachData, SetQuerySeachData] = useState("");

  const HandleSearchQuery = (e) => {
    const searchValue = e.target.value;
    SetQuerySeachData(searchValue); // Update the search query state

    FetchSubCenterByPagination(1, SubCenterLimit, searchValue);
  };

  const [
    AllotUniversityToSubCenterButton,
    setAllotUniversityToSubCenterButton,
  ] = useState(false);

  // Open ALLOT University
  const [AssignUser, setAssignUser] = useState();
  const HandleAllotUniToSubCenterOpenButton = (data) => {
    setAllotUniversityToSubCenterButton(true);
    setAssignUser(data);
  };

  // Close Allot University
  const HandleAllotUniToSubCenterCloseButton = () => {
    setAllotUniversityToSubCenterButton(false);
  };

  // Get data by counsellor id
  const [SubCenterDataByid, setSubCenterDataByid] = useState();
  const HandleGetSubCenter = async () => {
    // call api
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetSubCenterById/${
          AssignUser?._id
        }`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setSubCenterDataByid(response?.data?.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // useEffect(() => {
  //   HandleGetSubCenter();
  // }, [AssignUser]);

  // Allot University To SubCenter
  const HandleOnClickUpdatePushUniversity = async (data) => {
    // call api
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/SubCenterAllotedUniversity`,
        { id: AssignUser?._id, universityId: data?._id },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        // setLoadData(response?.data);
        // GetUniversity();
        FetchSubCenterByPagination();
        HandleGetSubCenter();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  //  Remove University To SubCenter
  const HandleRemoveUniversity = async (data) => {
    // call api
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/SubCenterRemoveUniversity`,
        { id: AssignUser?._id, universityId: data?._id },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        // GetUniversity();
        FetchSubCenterByPagination();
        HandleGetSubCenter();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const [UpdateSubCenterButton, setUpdateSubCenterButton] = useState(false);

  const [EditUpdateSubCenterData, setEditUpdateSubCenterData] = useState(null);

  const HandleUpdateSubCenterOpenButton = () => {
    setUpdateSubCenterButton(true);
  };

  const HandleUpdateSubCenterCloseButton = () => {
    setUpdateSubCenterButton(false);
  };

  const [passwordToggle, setpasswordToggle] = useState(false);

  const HandlePasswordToggle = (e) => {
    e.preventDefault();
    setpasswordToggle(!passwordToggle);
  };

  // Login permission
  const HandleUpdateStatusToggleSubCenter = async (
    SubCenterId,
    BooleanValue
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/SubCenterisAvailableToggle`,
        { SubCenterId, BooleanValue },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchSubCenterByPagination();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const HandleLoginStatusToggleYes = (data) => {
    HandleUpdateStatusToggleSubCenter(data?._id, true);
  };
  const HandleLoginStatusToggleNo = (data) => {
    HandleUpdateStatusToggleSubCenter(data?._id, false);
  };

  const HandleDeleteSubcenter = async (data) => {
    Swal.fire({
      title: `Do you want to Delete ${data?.name} `,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
      customClass: {
        // cancelButton: "custom-cancel-button",
        confirmButton: "custom-confirm-button",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        HandleDeleteSubCenter(data?._id, true);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const HandleDeleteSubCenter = async (SubCenterId, BooleanValue) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteSubCenterForm`,
        { SubCenterId, BooleanValue },
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
            FetchSubCenterByPagination();
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

  const UniversityGetDataFromRedux = useSelector((state) => state?.university);
  const GetLoggedUserRedux = useSelector((state) => state?.user);

  return (
    <>
      <section className="pt-2 text-xs flex flex-col h-[calc(100vh-110px)]">
        {/* main card: header + table + footer */}
        <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 shadow-md sm:rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 gap-3">
            <div className="w-full">
              <div className="flex justify-between">
                <form className="w-1/2">
                  <label for="QuerySeachData" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="QuerySeachData"
                      id="QuerySeachData"
                      onChange={HandleSearchQuery}
                      value={QuerySeachData}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg 
                        focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 px-2 py-1.5 text-sm
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Search"
                      required=""
                    />
                  </div>
                </form>
                {/* limit */}
                <div className="mr-10 text-sm">
                  <label>Items per page: </label>
                  <select
                    className="p-2 border shadow-lg text-xs"
                    value={SubCenterLimit}
                    onChange={handleLimitChange}
                  >
                    <option selected value="">
                      All
                    </option>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Table --> */}
          <div className="overflow-auto pb-2.5 px-4 flex-1">
            <div className="max-w-screen-2xl">
              <table className="min-w-full text-sm text-left text-slate-900 ">
                <thead
                  className="text-sm sticky top-0 p-10 text-gray-700  capitalize bg-gray-50 dark:bg-gray-700 
              dark:text-gray-400"
                >
                  <tr>
                    {[
                      "Sr No",
                      "Photo",
                      "Name",
                      "Code",
                      "Reporting",
                      "Admissions",
                      // "Password",
                      ReduxLoggedUser?.role !== "university-manager" &&
                        "Status",
                      ReduxLoggedUser?.role !== "university-manager" &&
                        "Actions",
                    ].map((header) => (
                      <th
                        scope="col"
                        className="px-4 py-2 whitespace-nowrap"
                        key={header}
                      >
                        <div className=" flex gap-3 flex-row text-sm">
                          <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                            {header}
                          </h1>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="overflow-x-scroll text-sm ">
                  {LoggedUserData?.role === "Admin" ||
                  LoggedUserData?.role === "university-manager" ||
                  LoggedUserData?.role === "operation-manager" ||
                  LoggedUserData?.role === "Accountant" ? (
                    <>
                      {SubCenterLoading ? (
                        <div className=" absolute">
                          <div
                            className="flex justify-center items-center h-[60vh] 
                                     w-[150vh] relative top-0 left-0 "
                          >
                            <Loader />
                          </div>
                        </div>
                      ) : SubCenterListData?.length !== 0 ? (
                        <>
                          {SubCenterListData?.filter(
                            (data) =>
                              !data?.isDeleted &&
                              data?.allotedUniversities?.some(
                                (university) =>
                                  university?._id ===
                                  UniversityGetDataFromRedux?.id
                              )
                          ).length === 0 ? (
                            <>
                              <div className="absolute">
                                <div
                                  className="flex justify-center items-center h-[60vh] 
                      w-[150vh] relative top-0 left-0 font-bold tracking-wide"
                                >
                                  You Not Have Any Sub Centers
                                </div>
                              </div>
                            </>
                          ) : (
                            SubCenterListData?.filter(
                              (data) =>
                                !data?.isDeleted &&
                                data?.allotedUniversities?.some(
                                  (university) =>
                                    university?._id ===
                                    UniversityGetDataFromRedux?.id
                                )
                            ).map((data, i) => (
                              <tr className="text-sm bg-white dark:bg-slate-900 dark:text-white border-b-4 border-b-slate-300 m-2 ">
                                {/* SR NO */}
                                <th
                                  scope="row"
                                  className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
                                >
                                  <div className="w-[5vh] flex gap-y-1 flex-col items-start">
                                    <div className="text-sm text-gray-900 dark:text-white">
                                      {i + 1}
                                    </div>
                                  </div>
                                </th>

                                {/* Photo */}
                                <td className="px-2 py-2 align-top ">
                                  <div className="w-[12vh]  text-sm flex gap-y-1 flex-row">
                                    <img
                                      src={data?.photo}
                                      alt=""
                                      className="w-12 h-12 border "
                                    />
                                  </div>
                                </td>

                                {/* Name */}
                                <th
                                  scope="row"
                                  className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
                                >
                                  <div className="w-[20vh] flex gap-y-1 flex-col items-start">
                                    <div className="text-sm flex flex-col gap-1 text-gray-900 dark:text-white">
                                      <span>{data?.name}</span>
                                      <span>{data?.email}</span>
                                    </div>
                                  </div>
                                </th>

                                {/* CODE */}
                                <th
                                  scope="row"
                                  className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
                                >
                                  <div className="w-[20vh] flex gap-y-2 flex-col items-start">
                                    <div className="text-sm text-gray-900 dark:text-white">
                                      <span>{data?.code}</span>
                                    </div>
                                  </div>
                                </th>

                                {/* rEPORTING */}
                                <th
                                  scope="row"
                                  className="px-4 py-2 dark:text-white align-top"
                                >
                                  <div className="w-[20vh] flex gap-y-1 flex-col items-start whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-white">
                                      <span>{`${data?.center?.name} (${data?.center?.code})`}</span>
                                    </div>
                                  </div>
                                </th>

                                {/* Admissions */}
                                <th
                                  scope="row"
                                  className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
                                >
                                  {data?.Admissions.length === 0 ? (
                                    <div>
                                      <span>0</span>
                                    </div>
                                  ) : (
                                    data?.Admissions?.map((allot, index) => (
                                      <div className="w-[20vh] flex gap-y-1 flex-col items-start">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                          <span>{allot?.name}</span>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </th>

                                {/* Status */}
                                <th
                                  scope="row"
                                  className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
                                >
                                  <div className="w-[20vh] flex gap-y-1 flex-col items-start">
                                    <div className="text-sm dark:text-white text-gray-900">
                                      {ReduxLoggedUser?.role !==
                                        "university-manager" && (
                                        <div className="w-[15vh] flex gap-y-1 flex-row">
                                          <ToggleButton
                                            ClickYes={() =>
                                              HandleLoginStatusToggleYes(data)
                                            }
                                            ClickNo={() =>
                                              HandleLoginStatusToggleNo(data)
                                            }
                                            StateUpdate={data?.isAvailable}
                                          />
                                          {/* {data?.isAvailable ? "yes" : "No"} */}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </th>

                                {/* Actions */}
                                <td className="px-2 py-2  align-top ">
                                  {ReduxLoggedUser?.role !==
                                    "university-manager" && (
                                    <div className=" flex gap-x-2 flex-row">
                                      <button
                                        onClick={() => {
                                          HandleAllotUniToSubCenterOpenButton(
                                            data
                                          );
                                        }}
                                        title="Allot University"
                                        className="font-medium text-blue-600  hover:underline"
                                      >
                                        <FaCirclePlus size={18} />
                                      </button>
                                      <button
                                        onClick={() => {
                                          HandleUpdateSubCenterOpenButton();
                                          setEditUpdateSubCenterData(data);
                                        }}
                                        title="Edit Student"
                                        className="font-medium ml-2 text-green-600 hover:underline"
                                      >
                                        <FaEdit size={18} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          HandleDeleteSubcenter(data)
                                        }
                                        title="Delete Student"
                                        className="font-medium text-red-600 hover:underline"
                                      >
                                        <MdDeleteForever size={18} />
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}

                          {/* select university */}
                          {/* {SubCenterListData?.filter((data) =>
                            data?.allotedUniversities?.some(
                              (university) => university?._id === ""
                            )
                          ) && (
                            <>
                              <div className=" absolute">
                                <div
                                  className="flex justify-center items-center h-[60vh] 
                      w-[150vh] relative top-0 left-0 "
                                >
                                  Select The University
                                </div>
                              </div>
                            </>
                          )} */}
                        </>
                      ) : (
                        <div className=" absolute">
                          <div
                            className="flex justify-center items-center h-[60vh] 
                      w-[150vh] relative -top-10 left-0 font-bold tracking-wider text-slate-500 "
                          >
                            Create Sub Center
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    LoggedUserData?.role === "center" && (
                      <>
                        {SubCenterLoading ? (
                          <div className=" absolute">
                            <div
                              className="flex justify-center items-center h-[60vh] 
                                     w-[150vh] relative top-0 left-0 "
                            >
                              <Loader />
                            </div>
                          </div>
                        ) : SubCenterListData?.length !== 0 ? (
                          <>
                            {SubCenterListData?.filter(
                              (data) =>
                                !data?.isDeleted &&
                                data?.center &&
                                data?.center?._id === LoggedUserData?._id &&
                                data?.allotedUniversities?.some(
                                  (university) =>
                                    university?._id ===
                                    UniversityGetDataFromRedux?.id
                                )
                            ).length === 0 ? (
                              <>
                                <div className="absolute">
                                  <div
                                    className="flex justify-center items-center h-[60vh] 
                      w-[150vh] relative top-0 left-0 font-bold tracking-wide"
                                  >
                                    You Not Have Any Sub Centers
                                  </div>
                                </div>
                              </>
                            ) : (
                              SubCenterListData?.filter(
                                (data) =>
                                  !data?.isDeleted &&
                                  data?.center &&
                                  data?.center?._id === LoggedUserData?._id &&
                                  data?.allotedUniversities?.some(
                                    (university) =>
                                      university?._id ===
                                      UniversityGetDataFromRedux?.id
                                  )
                              ).map((data, i) => (
                                <tr className="text-sm bg-white dark:bg-slate-900 dark:text-white border-b-4 border-b-slate-300 m-2 ">
                                  {/* SR NO */}
                                  <th
                                    scope="row"
                                    className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
                                  >
                                    <div className="w-[5vh] flex gap-y-1 flex-col items-start">
                                      <div className="text-sm text-gray-900 dark:text-white">
                                        {i + 1}
                                      </div>
                                    </div>
                                  </th>

                                  {/* Photo */}
                                  <td className="px-2 py-2 align-top ">
                                    <div className="w-[12vh]  text-sm flex gap-y-1 flex-row">
                                      <img
                                        src={data?.photo}
                                        alt=""
                                        className="w-12 h-12 border "
                                      />
                                    </div>
                                  </td>

                                  {/* Name */}
                                  <th
                                    scope="row"
                                    className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
                                  >
                                    <div className="w-[20vh] flex gap-y-1 flex-col items-start">
                                      <div className="text-sm flex flex-col gap-1 text-gray-900 dark:text-white">
                                        <span>{data?.name}</span>
                                        <span>{data?.email}</span>
                                      </div>
                                    </div>
                                  </th>

                                  {/* CODE */}
                                  <th
                                    scope="row"
                                    className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
                                  >
                                    <div className="w-[20vh] flex gap-y-2 flex-col items-start">
                                      <div className="text-sm text-gray-900 dark:text-white">
                                        <span>{data?.code}</span>
                                      </div>
                                    </div>
                                  </th>

                                  {/* rEPORTING */}
                                  <th
                                    scope="row"
                                    className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
                                  >
                                    <div className="w-[20vh] flex gap-y-1 flex-col items-start">
                                      <div className="text-sm text-gray-900 dark:text-white">
                                        <span>{`${data?.center?.name} (${data?.center?.code})`}</span>
                                      </div>
                                    </div>
                                  </th>

                                  {/* Admissions */}
                                  <th
                                    scope="row"
                                    className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
                                  >
                                    {data?.Admissions.length === 0 ? (
                                      <div>
                                        <span>0</span>
                                      </div>
                                    ) : (
                                      data?.Admissions?.map((allot, index) => (
                                        <div className="w-[20vh] flex gap-y-1 flex-col items-start">
                                          <div className="text-sm text-gray-900 dark:text-white">
                                            <span>{allot?.name}</span>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </th>

                                  {/* Password */}
                                  {/* <td className="px-4 py-2 align-top">
                              <div className="w-[20vh] flex gap-y-1 flex-col text-left">
                                <div>
                                  <span className="text-black font-semibold">
                                    <div className="flex items-center outline-2  bg-white border border-gray-300 rounded-lg w-full">
                                      <input
                                        type={
                                          passwordToggle ? "password" : "text"
                                        }
                                        name="Password"
                                        id="base-input"
                                        className=" text-sm bg-slate-50 border 
                                border-gray-200
                      text-gray-900 rounded-lg focus:ring-blue-500 
                      focus:border-blue-500 block w-full px-2 py-1 "
                                        required
                                        readOnly
                                      />
                                      <div>
                                        <button
                                          className="px-3 relative top-1 -ml-12 z-50"
                                          aria-label={
                                            passwordToggle
                                              ? "Hide password"
                                              : "Show password"
                                          }
                                        >
                                          {passwordToggle ? (
                                            <FaEye
                                              size={18}
                                              onClick={HandlePasswordToggle}
                                            />
                                          ) : (
                                            <FaEyeSlash
                                              size={18}
                                              onClick={HandlePasswordToggle}
                                            />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </span>
                                </div>
                              </div>
                            </td> */}

                                  {/* Status */}
                                  <th
                                    scope="row"
                                    className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
                                  >
                                    <div className="w-[20vh] flex gap-y-1 flex-col items-start">
                                      <div className="text-sm dark:text-white text-gray-900">
                                        <div className="w-[15vh] flex gap-y-1 flex-row">
                                          <ToggleButton
                                            ClickYes={() =>
                                              HandleLoginStatusToggleYes(data)
                                            }
                                            ClickNo={() =>
                                              HandleLoginStatusToggleNo(data)
                                            }
                                            StateUpdate={data?.isAvailable}
                                          />
                                          {/* {data?.isAvailable ? "yes" : "No"} */}
                                        </div>
                                      </div>
                                    </div>
                                  </th>

                                  {/* Actions */}
                                  <td className="px-2 py-2  align-top ">
                                    <div className=" flex gap-x-2 flex-row">
                                      <button
                                        onClick={() => {
                                          HandleAllotUniToSubCenterOpenButton(
                                            data
                                          );
                                        }}
                                        title="Allot University"
                                        className="font-medium text-blue-600  hover:underline"
                                      >
                                        <FaCirclePlus size={18} />
                                      </button>
                                      <button
                                        onClick={() => {
                                          HandleUpdateSubCenterOpenButton();
                                          setEditUpdateSubCenterData(data);
                                        }}
                                        title="Edit Student"
                                        className="font-medium ml-2 text-green-600 hover:underline"
                                      >
                                        <FaEdit size={18} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          HandleDeleteSubcenter(data)
                                        }
                                        title="Delete Student"
                                        className="font-medium text-red-600 hover:underline"
                                      >
                                        <MdDeleteForever size={18} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </>
                        ) : (
                          <div className=" absolute">
                            <div
                              className="flex justify-center items-center h-[60vh] 
                      w-[150vh] relative -top-10 left-0 font-bold tracking-wider text-slate-500 "
                            >
                              Create Sub Center
                            </div>
                          </div>
                        )}
                      </>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* <!-- Pagination -->/ */}
          <nav className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-3">
            <div
              className="flex flex-col md:flex-row 
              justify-between items-start md:items-center space-y-3 md:space-y-0 px-4 py-3"
            >
              <span className="font-normal text-gray-500 dark:text-gray-400 flex gap-1 flex-row">
                Showing
                <span className="font-semibold text-gray-900 dark:text-white">
                  {SubCenterListData?.length}
                </span>
                of
                <span className="font-semibold text-gray-900 dark:text-white">
                  {SubCenterTotalDocs}
                </span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px text-xs">
                <li>
                  <button
                    onClick={() => handlePageChange(SubCenterCurrentPage - 1)}
                    className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <IoChevronBack />
                  </button>
                </li>
                <li>
                  <div className="flex items-center justify-center py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    {SubCenterCurrentPage + "-" + SubCenterTotalPages}
                  </div>
                </li>

                <li>
                  <button
                    onClick={() => handlePageChange(CenterCurrentPage + 1)}
                    className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <IoChevronForwardOutline />
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </section>

      {AllotUniversityToSubCenterButton && (
        <span>
          <Allotuniversity
            HandleOnClickUpdatePushUniversity={
              HandleOnClickUpdatePushUniversity
            }
            HandleRemoveUniversity={HandleRemoveUniversity}
            OnCloseAllotUniversity={HandleAllotUniToSubCenterCloseButton}
            FetchTheListData={SubCenterDataByid}
          />
        </span>
      )}

      {UpdateSubCenterButton && (
        <span>
          <UpdateSubCenters
            EditUpdateSubCenterData={EditUpdateSubCenterData}
            FetchSubCenterByPagination={FetchSubCenterByPagination}
            HandleUpdateSubCenterCloseButton={HandleUpdateSubCenterCloseButton}
          />
        </span>
      )}
    </>
  );
};

export default ListOfSubCenters;
