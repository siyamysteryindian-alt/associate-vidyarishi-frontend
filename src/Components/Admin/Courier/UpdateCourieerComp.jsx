import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const UpdateCourieerComp = ({
  FetchCourieerCompanies,
  EditUpdateCourieer,
  HandleCloseUpdateCourieer,
}) => {
  console.log(EditUpdateCourieer);
  const [CourierData, setCourierData] = useState({
    CourierName: EditUpdateCourieer?.CourierName || "",
    CourierAddress: EditUpdateCourieer?.CourierAddress || "",
  });

  const HandleOnChangeCourier = (e) => {
    const { name, value } = e.target;
    setCourierData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const HandleUpdateCourier = async (e) => {
    e.preventDefault();
    try {
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdateCourierDetails`,
        {
          CourierId: EditUpdateCourieer?._id,
          CourierName: CourierData.CourierName,
          CourierAddress: CourierData.CourierAddress,
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        FetchCourieerCompanies(); // Refresh the list after update
        HandleCloseUpdateCourieer(); // Close the update modal/form
        console.log("Update successful:", Response);
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      console.error("Error during update:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <div className=" absolute z-30 top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-80 ">
        <div className="flex justify-center items-center mt-10">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-xl w-[70vh] ">
            <div className=" flex justify-between items-center flex-row px-4 py-3 border-b-2 border-b-slate-400">
              <div className="text-lg font-semibold">Update Courieer</div>
              <button onClick={HandleCloseUpdateCourieer}>
                <IoClose
                  size={28}
                  className="text-red-600 hover:bg-red-600 hover:text-white rounded-full p-1"
                />
              </button>
            </div>
            <div>
              <form onSubmit={HandleUpdateCourier}>
                <div className="m-4">
                  <input
                    type="text"
                    onChange={HandleOnChangeCourier}
                    value={CourierData?.CourierName}
                    name="CourierName"
                    id="CourierName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-2 dark:bg-gray-700 
              dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
               dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="m-4">
                  <input
                    type="text"
                    onChange={HandleOnChangeCourier}
                    value={CourierData?.CourierAddress}
                    name="CourierAddress"
                    id="CourierAddress"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-2 dark:bg-gray-700 
              dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
               dark:focus:border-blue-500"
                    required
                  />
                </div>

                <div className="m-2.5">
                  <div className="flex justify-between">
                    <div></div>
                    <div>
                      <button className="px-10 py-1.5 rounded-lg hover:bg-green-600 hover:text-white text-sm font-bold border-green-600 border-2 text-green-600">
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateCourieerComp;
