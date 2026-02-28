import React, { useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import UpdateAdmissionType from "./UpdateAdmissionType";
import Loader from "../../../../../Helper/Loader";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

const ListOfAdmissionType = ({
  AdmissionTypeListData,
  AdmissionTypeCurrentPage,
  AdmissionTypeTotalPages,
  AdmissionTypeLimit,
  AdmissionTypeLoading,
  AdmissionTypeTotalDocs,
  handlePageChange,
  handleLimitChange,
  FetchAdmissionTypeByPagination,
}) => {
  const [UpdateAdmissionTypeButton, setUpdateAdmissionTypeButton] =
    useState(false);

  const [EditUpdateAdmissionType, setEditUpdateAdmissionType] = useState(null);

  const HandleOpenUpdateAdmissionType = () => {
    setUpdateAdmissionTypeButton(true);
  };
  const HandleCloseUpdateAdmissionType = () => {
    setUpdateAdmissionTypeButton(false);
  };

  const HandleDeleteAdmissionType = (data) => {
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
        HandleDeleteAdmissionTypeAPI(data?._id, true);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const HandleDeleteAdmissionTypeAPI = async (
    AdmissionTypeId,
    BooleanValue
  ) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteAdmissionTypeForm`,
        { AdmissionTypeId, BooleanValue },
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
            FetchAdmissionTypeByPagination();
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

  return (
    <>
      <div className="py-2.5 px-4">
        <div className="h-auto w-auto">
          {/* <!-- Table --> */}
          <table className="min-w-full max-w-screen-xl  overflow-x-scroll text-base text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm sticky top-0 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="p-2 mt-1">
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Name
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Action
                    </h1>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="">
              {AdmissionTypeLoading ? (
                <div className=" absolute">
                  <div
                    className="flex justify-center items-center h-[60vh] 
           w-[135vh] relative top-0 left-0 "
                  >
                    <Loader />
                  </div>
                </div>
              ) : AdmissionTypeListData?.length !== 0 ? (
                AdmissionTypeListData?.map((data, i) =>
                  data.university === UniversityGetDataFromRedux?.id &&
                  !data?.isDeleted ? (
                    <tr
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800
                     border-b
                   dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {data?.name}
                      </th>

                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() => {
                            HandleOpenUpdateAdmissionType();
                            setEditUpdateAdmissionType(data);
                          }}
                          className="text-base text-green-600 dark:text-green-500 hover:underline"
                        >
                          <AiTwotoneEdit size={20} />
                        </button>
                        <button
                          onClick={() => HandleDeleteAdmissionType(data)}
                          className="text-base text-red-600 dark:text-red-500 hover:underline"
                        >
                          <MdDelete size={20} />
                        </button>
                      </td>
                    </tr>
                  ) : null
                )
              ) : (
                <div
                  className="flex justify-center items-center h-[55vh] 
           w-auto relative -top-10 left-48  font-bold tracking-wider text-slate-500 "
                >
                  Create Admission Type
                </div>
              )}
            </tbody>
          </table>

          {/* <!-- Pagination -->/ */}
          <nav aria-label="Table navigation" className="relative ">
            <div
              className="flex flex-col md:flex-row 
              justify-between items-start bg-white md:items-center space-y-3 md:space-y-0 px-4 py-3"
            >
              <span className="font-normal text-gray-500 dark:text-gray-400 flex gap-1 flex-row">
                Showing
                <span className="font-semibold text-gray-900 dark:text-white">
                  {AdmissionTypeListData?.length}
                </span>
                of
                <span className="font-semibold text-gray-900 dark:text-white">
                  {AdmissionTypeTotalDocs}
                </span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px">
                <li>
                  <button
                    onClick={() =>
                      handlePageChange(AdmissionTypeCurrentPage - 1)
                    }
                    className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <IoChevronBack />
                  </button>
                </li>
                <li>
                  <div className="flex items-center justify-center py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    {AdmissionTypeCurrentPage + "-" + AdmissionTypeTotalPages}
                  </div>
                </li>

                <li>
                  <button
                    onClick={() =>
                      handlePageChange(AdmissionTypeCurrentPage + 1)
                    }
                    className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <IoChevronForwardOutline />
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      {UpdateAdmissionTypeButton && (
        <span>
          <UpdateAdmissionType
            EditUpdateAdmissionType={EditUpdateAdmissionType}
            FetchAdmissionTypeByPagination={FetchAdmissionTypeByPagination}
            HandleCloseUpdateAdmissionType={HandleCloseUpdateAdmissionType}
          />
        </span>
      )}
    </>
  );
};

export default ListOfAdmissionType;
