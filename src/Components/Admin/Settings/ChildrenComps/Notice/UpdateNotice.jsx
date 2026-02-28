import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const UpdateNotice = ({
  EditUpdateNotice,
  HandleCloseUpdateNotice,
  FetchNotice,
}) => {
  const [NoticeData, setNoticeData] = useState(EditUpdateNotice?.NoticeName);

  const HandleOnChangeNotice = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setNoticeData(value);
  };

  const HandleUpdateNotice = async (e) => {
    e.preventDefault();
    try {
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdateNotice`,
        {
          Noticeid: EditUpdateNotice?._id,
          NoticeName: NoticeData,
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        FetchNotice();
        HandleCloseUpdateNotice();
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
              <div className="text-lg font-semibold">Update Notice</div>
              <button onClick={HandleCloseUpdateNotice}>
                <IoClose
                  size={28}
                  className="text-red-600 hover:bg-red-600 hover:text-white rounded-full p-1"
                />
              </button>
            </div>
            <div>
              <form onSubmit={HandleUpdateNotice}>
                <div className="m-4">
                  {/* <label
                    for="NoticeData"
                    className="block text-gray-700 dark:text-white font-bold mb-2"
                  >
                    Notice Name
                  </label> */}
                  <input
                    type="text"
                    onChange={HandleOnChangeNotice}
                    value={NoticeData}
                    name="NoticeData"
                    id="NoticeData"
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

export default UpdateNotice;
