import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-hot-toast";
import useGetScheme from "../../../../../CustomHooks/UseGetScheme";
import { useSelector } from "react-redux";

const UpdateAdmissionsession = ({
  EditUpdateAdmissionsession,
  FetchAdmissionsessionByPagination,
  HandleCloseUpdateAdmissionsession,
}) => {
  const { GetAllScheme, loadingScheme, SchemeError, Scheme } = useGetScheme();
  useEffect(() => {
    GetAllScheme();
  }, []);

  const [Admissionsession, setAdmissionsession] = useState({
    AdmissionsessionName: EditUpdateAdmissionsession?.name,
    Examsession: EditUpdateAdmissionsession?.examSession,
    Scheme: EditUpdateAdmissionsession?._id,
  });
  const HandleOnChangeInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAdmissionsession((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const UniversityGetFromRedux = useSelector((state) => state?.university);


  const handleSubmitForm = async (e) => {
    e.preventDefault();


    try {
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdateAdmissionSession`,
        {
          id: EditUpdateAdmissionsession?._id,
          name: Admissionsession?.AdmissionsessionName,
          examSession: Admissionsession?.Examsession,
          scheme: Admissionsession?.Scheme,
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        FetchAdmissionsessionByPagination();
        HandleCloseUpdateAdmissionsession();
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
    <div className=" absolute z-30 top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-80 ">
      <div className="flex justify-center items-center mt-10">
        <div className="bg-white dark:bg-slate-900 dark:text-white rounded-xl w-[70vh] ">
          <div className=" flex justify-between items-center flex-row px-4 py-3 border-b-2 border-b-slate-400">
            <div className="text-lg font-semibold">
              Create Admission session
            </div>
            <button onClick={HandleCloseUpdateAdmissionsession}>
              <IoClose
                size={28}
                className="text-red-600 hover:bg-red-600 hover:text-white rounded-full p-1"
              />
            </button>
          </div>
          <div>
            <form onSubmit={handleSubmitForm}>
              <div className="m-4">
                <label
                  for="AdmissionsessionName"
                  className="block text-gray-700 dark:text-white font-bold mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="AdmissionsessionName"
                  value={Admissionsession?.AdmissionsessionName}
                  onChange={HandleOnChangeInput}
                  id="AdmissionsessionName"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
            focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
             dark:focus:border-blue-500"
                  placeholder="Ex: Year , Semester"
                  required
                />
              </div>

              <div className="m-4">
                <label
                  for="Examsession"
                  className="block text-gray-700 dark:text-white font-bold mb-2"
                >
                  Exam session
                </label>
                <input
                  type="text"
                  name="Examsession"
                  value={Admissionsession?.Examsession}
                  onChange={HandleOnChangeInput}
                  id="Examsession"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
            focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
             dark:focus:border-blue-500"
                  placeholder="Ex: Year , Semester"
                  required
                />
              </div>

              <div className="m-4">
                <label
                  htmlFor="Scheme"
                  className="block text-gray-700 dark:text-white font-bold mb-2"
                >
                  Scheme
                </label>
                <select
                  name="Scheme"
                  onChange={HandleOnChangeInput}
                  // value={Admissionsession?.Scheme}
                  id="Scheme"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
      focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 
      dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
      dark:focus:border-blue-500"
                  // required
                >
                  <option value="">Select</option>
                  {Scheme?.map((data) => (
                    <option
                      selected={Admissionsession?.Scheme === data?._id}
                      key={data?._id}
                      value={data?._id}
                    >
                      {data?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="m-4">
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
  );
};

export default UpdateAdmissionsession;
