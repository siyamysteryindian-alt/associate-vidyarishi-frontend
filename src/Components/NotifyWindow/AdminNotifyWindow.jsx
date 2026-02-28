import React, { useEffect, useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import ListOfNotifyWindow from "./ListOfNotifyWindow";
import CreateNotifyWindow from "./CreateNotifyWindow";

const AdminNotifyWindow = () => {
  const [CreateNotifyWindowButton, setCreateNotifyWindowButton] =
    useState(false);

  const HandleOpenCreateNotifyWindow = () => {
    setCreateNotifyWindowButton(true);
  };
  const HandleCloseCreateNotifyWindow = () => {
    setCreateNotifyWindowButton(false);
  };

  // fetching Data
  const [NotifyWindowListData, setNotifyWindowListData] = useState([]);
  const [NotifyWindowLoading, setNotifyWindowLoading] = useState(false);

  const FetchNotifyWindow = async () => {
    try {
      setNotifyWindowLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get-all-notify`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setNotifyWindowListData(response?.data?.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setNotifyWindowLoading(false);
    }
  };

  const GetFromReduxUser = useSelector((state) => state?.user);

  useEffect(() => {
    if (GetFromReduxUser?.id) {
      FetchNotifyWindow();
    }
  }, [GetFromReduxUser?.id]);

  return (
    <>
      <section className="top-0  py-1 h-[calc(80vh-115px)]  rounded-lg">
        <div className="px-8 w-full h-14  rounded-t-lg dark:bg-slate-900 dark:text-white bg-slate-100 flex items-center justify-between">
          <div className="text-lg font-bold tracking-wide">Notify Window</div>
          <div className="text-lg font-bold flex justify-center items-center gap-x-6">
            <button
              onClick={HandleOpenCreateNotifyWindow}
              className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white"
            >
              <MdOutlineAddCircleOutline size={19} />
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 dark:text-white h-[65vh] overflow-auto">
          <ListOfNotifyWindow
            NotifyWindowListData={NotifyWindowListData}
            NotifyWindowLoading={NotifyWindowLoading}
            FetchNotifyWindow={FetchNotifyWindow}
          />
        </div>
      </section>

      {CreateNotifyWindowButton && (
        <>
          <CreateNotifyWindow
            FetchNotifyWindow={FetchNotifyWindow}
            HandleCloseCreateNotifyWindow={HandleCloseCreateNotifyWindow}
          />
        </>
      )}
    </>
  );
};

export default AdminNotifyWindow;
