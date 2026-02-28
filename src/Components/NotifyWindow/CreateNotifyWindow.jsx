import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import NotifyTemplate from "./NotifyEditor";

const CreateNotifyWindow = ({
  FetchNotifyWindow,
  HandleCloseCreateNotifyWindow,
}) => {
  const [NotifyWindowName, setNotifyWindowName] = useState("");
  const [NotifyWindowContent, setNotifyWindowContent] = useState("");

  const HandleOnChangeInput = (e) => {
    e.preventDefault();
    setNotifyWindowName(e.target.value);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    console.log(NotifyWindowName);
    console.log(NotifyWindowContent);

    try {
      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create-notify`,
        {
          NotifyName: NotifyWindowName,
          NotifyContent: NotifyWindowContent,
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        FetchNotifyWindow();
        HandleCloseCreateNotifyWindow();
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <>
      <div className=" absolute z-30 top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-80 ">
        <div className="flex justify-center items-center mt-10">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-md px-4 w-[85vh] ">
            <div className=" flex justify-between items-center flex-row px-4 py-3 border-b-2 border-b-slate-400">
              <div className="text-lg font-semibold">Create Notify Window</div>
              <button onClick={HandleCloseCreateNotifyWindow}>
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
                    for="NotifyName"
                    className="block text-gray-700 dark:text-white font-bold mb-2"
                  >
                    Notify Name
                  </label>
                  <input
                    type="text"
                    name="NotifyWindowName"
                    onChange={HandleOnChangeInput}
                    id="NotifyName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md 
              focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-2 dark:bg-gray-700 
              dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
               dark:focus:border-blue-500"
                    placeholder="Give Label To Your Updates"
                    required
                  />
                </div>
                <div className="m-4">
                  <label
                    for="NotifyWindowName"
                    className="block text-gray-700 dark:text-white font-bold mb-2"
                  >
                    Notify Content
                  </label>
                  <NotifyTemplate
                    NotifyWindowContent={NotifyWindowContent}
                    setNotifyWindowContent={setNotifyWindowContent}
                    placeholder={"WRITE NEWS/UPDATES/DEADLINES"}
                  />
                </div>

                <div className="m-2.5 mb-4">
                  <div className="flex justify-between">
                    <div></div>
                    <div>
                      <button
                        type="submit"
                        className="px-8 mx-2 text-sm py-1.5 rounded-lg hover:bg-green-600 hover:text-white font-bold border-green-600 border-2 text-green-600"
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

export default CreateNotifyWindow;
