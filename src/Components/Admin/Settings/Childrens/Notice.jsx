import React, { useEffect, useState } from "react";
import ListNotice from "../ChildrenComps/Notice/ListNotice";
import CreateNotice from "../ChildrenComps/Notice/CreateNotice";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";

const Notice = () => {
  const [CreateNoticeButton, setCreateNoticeButton] = useState(false);

  const HandleOpenCreateNotice = () => {
    setCreateNoticeButton(true);
  };
  const HandleCloseCreateNotice = () => {
    setCreateNoticeButton(false);
  };

  // fetching Data
  const [NoticeListData, setNoticeListData] = useState([]);
  const [NoticeLoading, setNoticeLoading] = useState(false);

  const FetchNotice = async () => {
    try {
      setNoticeLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetAllNotice`,
        {
          withCredentials : true
        }
      );

      if (response?.data?.success) {
        setNoticeListData(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setNoticeLoading(false);
    }
  };

  const GetFromReduxUser = useSelector((state) => state?.user);

  useEffect(() => {
    if (GetFromReduxUser?.id) {
      FetchNotice();
    }
  }, [GetFromReduxUser?.id]);

  return (
    <>
      <section className="top-0  py-1 h-[calc(80vh-115px)]  rounded-lg">
        <div className="px-8 w-full h-14  rounded-t-lg dark:bg-slate-900 dark:text-white bg-slate-100 flex items-center justify-between">
          <div className="text-lg font-bold tracking-wide">Publish Notice</div>
          <div className="text-lg font-bold flex justify-center items-center gap-x-6">
            {/* <button className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white">
            <BiSolidDownload size={19} />
          </button> */}
            <button
              onClick={HandleOpenCreateNotice}
              className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white"
            >
              <MdOutlineAddCircleOutline size={19} />
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 dark:text-white h-full overflow-auto">
          <ListNotice
            NoticeListData={NoticeListData}
            NoticeLoading={NoticeLoading}
            FetchNotice={FetchNotice}
          />
        </div>
      </section>

      {CreateNoticeButton && (
        <>
          <CreateNotice
            FetchNotice={FetchNotice}
            HandleCloseCreateNotice={HandleCloseCreateNotice}
          />
        </>
      )}
    </>
  );
};

export default Notice;
