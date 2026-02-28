import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaWhatsapp } from "react-icons/fa";
import { useSelector } from "react-redux";
import image from "../../../../../public/logo.png";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";
import Loader from "../../../../Helper/Loader";
import Swal from "sweetalert2";
import Allotuniversity from "../../../../Helper/Allotuniversity";
import { toast } from "react-hot-toast";
import axios from "axios";
import useGetUniversity from "../../../../CustomHooks/UseGetUniversities";

const ListOfCenter = ({
  CenterListData,
  CenterCurrentPage,
  CenterTotalPages,
  CenterLimit,
  CenterLoading,
  CenterTotalDocs,
  FetchCenterByPagination,
  handlePageChange,
  handleLimitChange,
}) => {
  const ReduxLoggedUser = useSelector((state) => state?.user);

  const { GetUniversity, UniversityLoading, UniversityError, universities } =
    useGetUniversity();

  const [QuerySeachData, SetQuerySeachData] = useState("");

  const HandleSearchQuery = (e) => {
    const searchValue = e.target.value;
    SetQuerySeachData(searchValue); // Update the search query state

    FetchCenterByPagination(1, CenterLimit, searchValue);
  };

  const [AllotUniversityButton, setAllotUniversityButton] = useState(false);

  // OPEN BUTTON
  const [AllotUniversityListData, setAllotUniversityListData] = useState();
  const HandleAllotUniversityOpenButton = (data) => {
    setAllotUniversityButton(true);
    setAllotUniversityListData(data);
  };

  // CLOSE BUTTON
  const HandleAllotUniversityCloseButton = () => {
    setAllotUniversityButton(false);
  };

  // Api To Get Center Data  By Id
  const [CenterDataByid, setCenterDataByid] = useState();
  const HandlegetdatabyCenter = async () => {
    // call api
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetCenterMasterById/${
          AllotUniversityListData?._id
        }`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setCenterDataByid(response?.data?.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Upload University From Center
  const HandleOnClickUpdatePushUniversity = async (data) => {
    // call api
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/CenterAllotedUniversity`,
        { id: AllotUniversityListData?._id, universityId: data?._id },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        // setLoadData(response?.data);
        GetUniversity();
        FetchCenterByPagination();
        setTimeout(() => {
          // HandleAllotUniversityCloseButton();
          HandlegetdatabyCenter();
        }, 500);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Remove University From Center
  const HandleRemoveUniversity = async (data) => {
    // call api
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/CenterRemoveUniversity`,
        { id: AllotUniversityListData?._id, universityId: data?._id },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        GetUniversity();
        FetchCenterByPagination();
        setTimeout(() => {
          // HandleAllotUniversityCloseButton();
          HandlegetdatabyCenter();
        }, 500);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // fetch Center Data
  // useEffect(() => {
  //   if (AllotUniversityListData?._id) {
  //     HandlegetdatabyCenter();
  //   }
  // }, [AllotUniversityListData]);

  const [passwordToggle, setpasswordToggle] = useState(false);
  const HandlePasswordToggle = (e) => {
    e.preventDefault();
    setpasswordToggle(!passwordToggle);
  };

  const CenterId = "";

  const UniversityGetDataFromRedux = useSelector((state) => state?.university);

  const whatsappMessage = "Hello, Center ";
  const encodedMessage = encodeURIComponent(whatsappMessage);

  return (
    <>
      <section className="pt-2 text-xs flex flex-col h-[calc(100vh-110px)]">
        {/* main card: header + table + footer */}
        <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 shadow-md sm:rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 gap-3">
            <div className="w-full">
              <div className="flex justify-between">
                <form className="w-1/2">
                  <label for="simple-search" className="sr-only">
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
                      id="simple-search"
                      name="QuerySeachData"
                      value={QuerySeachData}
                      onChange={HandleSearchQuery}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500
                         focus:border-primary-500 block w-full pl-10 p-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 
                         dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 
                         dark:focus:border-primary-500"
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
                    value={CenterLimit}
                    onChange={handleLimitChange}
                  >
                    <option selected value="">
                      Select
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
            <div className="lg:max-w-screen-2xl">
              <table className="min-w-full text-sm text-left dark:bg-slate-900 dark:text-white text-slate-900 ">
                <thead
                  className="text-sm sticky top-0 p-10 text-gray-700  capitalize bg-gray-50 dark:bg-gray-700 
                  dark:text-gray-400"
                >
                  <tr>
                    {[
                      "Sr No",
                      "Photo",
                      "Name",
                      "Email",
                      "Mobile No",
                      // "Fee Aloted",
                      "Admissions",
                      // "Password",
                      ReduxLoggedUser?.role !== "university-manager" &&
                        "Actions",
                    ].map((header) => (
                      <th
                        scope="col"
                        className="px-4 py-2 whitespace-nowrap"
                        key={header}
                      >
                        <div className=" flex gap-3 flex-row">
                          <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                            {header}
                          </h1>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="overflow-x-scroll ">
                  {CenterLoading ? (
                    <div className=" absolute">
                      <div
                        className="flex justify-center items-center h-[60vh] 
                 w-[150vh] relative top-0 left-0 "
                      >
                        <Loader />
                      </div>
                    </div>
                  ) : CenterListData?.length !== 0 ? (
                    <>
                      {CenterListData?.filter(
                        (data) =>
                          !data?.isDeleted &&
                          data?.allotedUniversities?.some(
                            (university) =>
                              university?._id === UniversityGetDataFromRedux?.id
                          )
                      ).length === 0 ? (
                        <>
                          <div className="absolute">
                            <div
                              className="flex justify-center items-center h-[60vh] 
        w-[150vh] relative top-0 left-0"
                            >
                              Not Created ANY Data Inside This University
                            </div>
                          </div>
                        </>
                      ) : (
                        CenterListData?.filter(
                          (data) =>
                            !data?.isDeleted &&
                            data?.allotedUniversities?.some(
                              (university) =>
                                university?._id ===
                                UniversityGetDataFromRedux?.id
                            )
                        ).map((data, index) => (
                          <tr
                            key={index}
                            className="bg-white dark:bg-slate-900 dark:text-white text-sm border-b-4 border-b-slate-300 m-2"
                          >
                            {/* SR NO */}
                            <th
                              scope="row"
                              className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
                            >
                              <div className="w-[5vh] flex gap-y-1 flex-col items-start">
                                <div className="text-sm dark:text-white text-gray-900">
                                  {index + 1}
                                </div>
                              </div>
                            </th>

                            {/* Photo */}
                            <td className="px-2 py-2 align-top ">
                              <div className="w-[12vh] flex gap-y-1 flex-row">
                                <img
                                  src={data?.photo}
                                  alt="Image Not Found"
                                  className="w-16 h-16 border "
                                />
                              </div>
                            </td>

                            {/* Name */}
                            <th
                              scope="row"
                              className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
                            >
                              <div className="w-auto pr-2 flex gap-y-1 flex-col items-start">
                                <div className="text-sm text-gray-900 dark:text-white">
                                  <span>{data?.name}</span>
                                </div>
                                <div className="text-xs">
                                  <span>Center Id: </span>
                                  <span>{data?.code}</span>
                                </div>
                              </div>
                            </th>

                            {/* Email */}
                            <td className="px-4 py-2 align-top ">
                              <div className="w-[28vh] flex gap-y-1 flex-col text-left">
                                <div>
                                  <span className="text-black dark:text-white font-semibold">
                                    {data?.email}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Mobile No */}
                            <td className="px-4 py-2 align-top ">
                              <div className="w-[20vh] flex gap-y-1 flex-col text-left">
                                <div>
                                  <span className="text-black dark:text-white font-semibold">
                                    {data?.contact}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Fee Aloted */}
                            {/* <td className="px-4 py-2 align-top">
                                <div className="w-[20vh] flex gap-y-1 flex-col text-left">
                                  <div>
                                    <span className="text-black dark:text-white font-semibold">
                                      0
                                    </span>
                                  </div>
                                </div>
                              </td> */}

                            {/* Admissions */}
                            <td className="px-4 py-2 align-top">
                              <div className="w-[20vh] flex gap-y-1 flex-col text-left">
                                <div>
                                  <span className="text-black dark:text-white font-semibold">
                                    {data?.admissions?.length}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Actions */}
                            {ReduxLoggedUser?.role !== "university-manager" && (
                              <td className="px-4 py-2 align-top ">
                                <div className="w-[15vh] flex gap-3 flex-row">
                                  <button
                                    onClick={() => {
                                      HandleAllotUniversityOpenButton(data);
                                    }}
                                    title="Allot University"
                                    className="font-medium text-sm text-blue-600  hover:underline"
                                  >
                                    <FaCirclePlus size={18} />
                                  </button>
                                  <button
                                    title="Edit Student"
                                    className="font-medium text-sm text-green-600 dark:text-green-500 hover:underline"
                                  >
                                    <a
                                      href={`https://wa.me/${data?.contact}?text=${encodedMessage}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <FaWhatsapp size={18} />
                                    </a>
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))
                      )}

                      {/* not created any condition */}

                      {CenterListData?.filter(
                        (data) =>
                          !data?.isDeleted &&
                          data?.allotedUniversities?.some(
                            (university) =>
                              university?._id === UniversityGetDataFromRedux?.id
                          )
                      ) ? (
                        <></>
                      ) : (
                        <div className=" absolute">
                          <div
                            className="flex justify-center items-center h-[60vh] 
             w-[150vh] relative top-0 left-0 "
                          >
                            Not Created ANY Data Inside This University
                          </div>
                        </div>
                      )}

                      {/* select university */}
                      {/* {CenterListData?.filter((data) =>
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
                        Create Center
                      </div>
                    </div>
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
                  {CenterListData?.length}
                </span>
                of
                <span className="font-semibold text-gray-900 dark:text-white">
                  {CenterTotalDocs}
                </span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px">
                <li>
                  <button
                    onClick={() => handlePageChange(CenterCurrentPage - 1)}
                    className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <IoChevronBack />
                  </button>
                </li>
                <li>
                  <div className="flex items-center justify-center py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    {CenterCurrentPage + "-" + CenterTotalPages}
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

      {AllotUniversityButton && (
        <span>
          <Allotuniversity
            HandleOnClickUpdatePushUniversity={
              HandleOnClickUpdatePushUniversity
            }
            HandleRemoveUniversity={HandleRemoveUniversity}
            OnCloseAllotUniversity={HandleAllotUniversityCloseButton}
            FetchTheListData={CenterDataByid}
          />
        </span>
      )}
    </>
  );
};

export default ListOfCenter;
