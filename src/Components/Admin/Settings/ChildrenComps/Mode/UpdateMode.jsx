import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const UpdateMode = ({
  HandleCloseUpdateMode,
  FetchModeByPagination,
  EditUpdateMode,
}) => {
  const [ModeData, setModeData] = useState(EditUpdateMode?.name);

  const HandleOnChangeMode = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setModeData(value);
  };

  const HandleUpdateMode = async (e) => {
    e.preventDefault();
    FetchModeByPagination();

    try {
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdateMode`,
        {
          id: EditUpdateMode?._id,
          name: ModeData,
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        console.log(Response?.data);
        FetchModeByPagination();
        HandleCloseUpdateMode();
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
      console.log(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <>
      <div className=" absolute z-30 top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-80 ">
        <div className="flex justify-center items-center mt-10">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-xl w-[70vh] ">
            <div className=" flex justify-between items-center flex-row px-4 py-3 border-b-2 border-b-slate-400">
              <div className="text-lg font-semibold">Update Mode</div>
              <button onClick={HandleCloseUpdateMode}>
                <IoClose
                  size={28}
                  className="text-red-600 hover:bg-red-600 hover:text-white rounded-full p-1"
                />
              </button>
            </div>
            <div>
              <form onSubmit={HandleUpdateMode}>
                <div className="m-6">
                  <label
                    for="ModeData"
                    className="block text-gray-700 dark:text-white font-bold mb-2"
                  >
                    Mode Name
                  </label>
                  <input
                    type="text"
                    onChange={HandleOnChangeMode}
                    value={ModeData}
                    name="ModeData"
                    id="ModeData"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 
                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                 dark:focus:border-blue-500"
                    placeholder="Ex: Year , Semester"
                    required
                  />
                </div>

                <div className="m-6">
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

export default UpdateMode;
