import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const UpdateAdmissionType = ({
  HandleCloseUpdateAdmissionType,
  FetchAdmissionTypeByPagination,
  EditUpdateAdmissionType,
}) => {
  const [AdmissionType, setAdmissionType] = useState(
    EditUpdateAdmissionType?.name
  );

  const HandleOnChangeAdmissionType = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setAdmissionType((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const HandleUpdateAdmissionType = async (e) => {
    e.preventDefault();
    FetchAdmissionTypeByPagination();

    try {
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdateAdmissionType`,
        {
          id: EditUpdateAdmissionType?._id,
          name: AdmissionType?.AdmissionType,
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        FetchAdmissionTypeByPagination();
        HandleCloseUpdateAdmissionType();
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <>
      <div className="  absolute z-30 top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-80 ">
        <div className="flex justify-center items-center mt-10">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-xl w-[70vh] ">
            <div className=" flex justify-between items-center flex-row px-4 py-3 border-b-2 border-b-slate-400">
              <div className="text-lg font-semibold">Update Admission Type</div>
              <button onClick={HandleCloseUpdateAdmissionType}>
                <IoClose
                  size={28}
                  className="text-red-600 hover:bg-red-600 hover:text-white rounded-full p-1"
                />
              </button>
            </div>
            <div>
              <form onSubmit={HandleUpdateAdmissionType}>
                <div className="m-6">
                  <label
                    for="Template"
                    className="block dark:text-white text-gray-700 font-bold mb-2"
                  >
                    Admission Type Name
                  </label>
                  <select
                    onChange={HandleOnChangeAdmissionType}
                    value={AdmissionType}
                    name="AdmissionType"
                    id="AdmissionType"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 
                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                 dark:focus:border-blue-500"
                    placeholder="Ex: Year , Semester"
                    required
                  >
                    {["LATERAL", "FRESH", "REGULAR"].map((data, i) => (
                      <option selected={AdmissionType === data} value={data}>
                        {data}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="m-6">
                  <div className="flex justify-between">
                    <div></div>
                    <div>
                      <button
                        type="submit"
                        className="px-8 py-1.5 rounded-lg hover:bg-green-600 hover:text-white text-sm font-bold border-green-600 border-2 text-green-600"
                      >
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

export default UpdateAdmissionType;
