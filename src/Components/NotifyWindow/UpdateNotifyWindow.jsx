import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import NotifyTemplate from "./NotifyEditor";

const UpdateNotifyWindow = ({
  FetchNotifyWindow,
  EditUpdateNotifyWindow,
  HandleCloseUpdateNotifyWindow,
  NotifyWindowListData,
}) => {
  const [NotifyWindowName, setNotifyWindowName] = useState(
    EditUpdateNotifyWindow?.NotifyName
  );
  const [NotifyWindowContent, setNotifyWindowContent] = useState(
    EditUpdateNotifyWindow?.NotifyContent
  );

  const HandleOnChangeInput = (e) => {
    e.preventDefault();
    setNotifyWindowName(e.target.value);
  };

  const HandleUpdateNotifyWindow = async (e) => {
    e.preventDefault();
    try {
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdateNotify`,
        {
          Notifyid: EditUpdateNotifyWindow?._id,
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
        HandleCloseUpdateNotifyWindow();
        console.log(Response);
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <div className=" absolute z-30 top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-80 ">
        <div className="flex justify-center items-center mt-10">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-xl w-[70vh] ">
            <div className=" flex justify-between items-center flex-row px-4 py-3 border-b-2 border-b-slate-400">
              <div className="text-lg font-semibold">Update Notify Window</div>
              <button onClick={HandleCloseUpdateNotifyWindow}>
                <IoClose
                  size={28}
                  className="text-red-600 hover:bg-red-600 hover:text-white rounded-full p-1"
                />
              </button>
            </div>
            <div>
              <form onSubmit={HandleUpdateNotifyWindow}>
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
                    value={NotifyWindowName}
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
                    for="NotifyWindowData"
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

export default UpdateNotifyWindow;
