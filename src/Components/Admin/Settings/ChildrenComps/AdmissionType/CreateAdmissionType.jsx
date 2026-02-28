import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const CreateAdmissionType = ({
  HandleCloseCreateAdmissionType,
  FetchAdmissionTypeByPagination,
}) => {
  const [AcademicName, setAcademicName] = useState("");

  const HandleOnChangeInput = (e) => {
    e.preventDefault();
    setAcademicName(e.target.value);
  };

  const UniversityGetFromRedux = useSelector((state) => state?.university);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/Create-AdmissionType`,
        {
          university: UniversityGetFromRedux?.id,
          name: AcademicName,
          role: "AdmissionType",
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        FetchAdmissionTypeByPagination();
        HandleCloseCreateAdmissionType();
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
      <div className=" absolute z-30 top-0 bottom-0 left-0 right-0  bg-gray-700 bg-opacity-80 ">
        <div className="flex justify-center items-center mt-10">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-xl w-[70vh] ">
            <div className=" flex justify-between items-center flex-row px-4 py-3 border-b-2 border-b-slate-400">
              <div className="text-lg font-semibold">Admission Type</div>
              <button onClick={HandleCloseCreateAdmissionType}>
                <IoClose
                  size={28}
                  className="text-red-600 hover:bg-red-600 hover:text-white rounded-full p-1"
                />
              </button>
            </div>
            <div>
              <form onSubmit={handleSubmitForm}>
                <div className="m-6">
                  <label
                    for="AcademicName"
                    className="block text-gray-700 dark:text-white font-bold mb-2"
                  >
                    Admission
                  </label>
                  <select
                    type="text"
                    name="AcademicName"
                    onChange={HandleOnChangeInput}
                    id="AcademicName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 
                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                 dark:focus:border-blue-500"
                    placeholder="Ex: Fee Pending"
                    required
                  >
                    <option value="LATERAL">LATERAL</option>
                    <option value="FRESH">FRESH</option>
                    <option value="REGULAR">REGULAR</option>
                  </select>
                </div>

                <div className="m-6">
                  <div className="flex justify-between">
                    <div></div>
                    <div>
                      <button
                        type="submit"
                        className="px-10 py-1.5 rounded-lg hover:bg-green-600 hover:text-white text-sm font-bold border-green-600 border-2 text-green-600"
                      >
                        Save
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

export default CreateAdmissionType;
