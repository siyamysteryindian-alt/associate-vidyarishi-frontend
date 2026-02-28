import React, { useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import Loader from "../../../Helper/Loader";
import ToggleButton from "../../../Common/ToggleButton";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";
import UpdateCourieerComp from "./UpdateCourieerComp";

const ListCourieer = ({
  CourieerCompaniesListData,
  CourieerCompaniesLoading,
  FetchCourieerCompanies,
}) => {
  const [UpdateCourieerButton, setUpdateCourieerButton] = useState(false);
  const [EditUpdateCourieer, setEditUpdateCourieer] = useState(null);

  const HandleOpenUpdateCourieer = () => {
    setUpdateCourieerButton(true);
  };
  const HandleCloseUpdateCourieer = () => {
    setUpdateCourieerButton(false);
  };

  const HandleDeleteCourieer = (data) => {
    Swal.fire({
      title: `Do you want to Delete Courieer`,
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
        HandleDeleteCourieerAPI(data?._id, true);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const HandleDeleteCourieerAPI = async (CourierId, BooleanValue) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteCourierDetails`,
        { CourierId, BooleanValue },
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
            FetchCourieerCompanies();
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

  return (
    <>
      <div className="py-2.5 px-4">
        <div className="h-auto w-auto">
          {/* <!-- Table --> */}
          <table className="min-w-full max-w-screen-xl overflow-x-scroll text-base text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm sticky top-0 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Courier Name
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Courier Address
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
            <tbody>
              {CourieerCompaniesLoading ? (
                <tr>
                  <td colSpan="3" className="relative">
                    <div className="flex justify-center items-center h-[60vh]">
                      <Loader />
                    </div>
                  </td>
                </tr>
              ) : CourieerCompaniesListData?.filter((data) => !data?.isDeleted)
                  ?.length ? (
                CourieerCompaniesListData.filter(
                  (item) => !item?.isDeleted
                ).map((data, i) => (
                  <tr key={i} className="bg-white dark:bg-gray-800 border-b">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white truncate">
                      {data?.CourierName}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white truncate">
                      {data?.CourierAddress}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => {
                          HandleOpenUpdateCourieer();
                          setEditUpdateCourieer(data);
                        }}
                        className="text-green-600 dark:text-green-500 hover:underline"
                      >
                        <AiTwotoneEdit size={20} />
                      </button>
                      <button
                        onClick={() => HandleDeleteCourieer(data)}
                        className="text-red-600 dark:text-red-500 hover:underline"
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="w-full justify-around items-center mt-40">
                  <td
                    colSpan="3"
                    className="text-center py-8 font-bold text-slate-500"
                  >
                    Create Courier
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {UpdateCourieerButton && (
        <UpdateCourieerComp
          FetchCourieerCompanies={FetchCourieerCompanies}
          EditUpdateCourieer={EditUpdateCourieer}
          HandleCloseUpdateCourieer={HandleCloseUpdateCourieer}
          CourieerCompaniesListData={CourieerCompaniesListData}
        />
      )}
    </>
  );
};

export default ListCourieer;
