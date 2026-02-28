import React, { useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import Loader from "../../../../../Helper/Loader";
import UpdateNotice from "./UpdateNotice";
import ToggleButton from "../../../../../Common/ToggleButton";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";

const ListNotice = ({ NoticeListData, NoticeLoading, FetchNotice }) => {
  const [UpdateNoticeButton, setUpdateNoticeButton] = useState(false);
  const [EditUpdateNotice, setEditUpdateNotice] = useState(null);

  const HandleOpenUpdateNotice = () => {
    setUpdateNoticeButton(true);
  };
  const HandleCloseUpdateNotice = () => {
    setUpdateNoticeButton(false);
  };

  const HandleDeleteNotice = (data) => {
    Swal.fire({
      title: `Do you want to Delete Notice`,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
      customClass: {
        // cancelButton: "custom-cancel-button",
        confirmButton: "custom-confirm-button",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        HandleDeleteNoticeAPI(data?._id, true);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const HandleDeleteNoticeAPI = async (Noticeid, BooleanVal) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteNotice`,
        { Noticeid, BooleanVal },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        Swal.fire({
          title: `Deleted Successfulyy!`,
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            FetchNotice();
          }
        });
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  //   Counsellor
  const HandlePublishToCounsellorToggleYes = (Notices) => {
    HandleUpdatePublishToCounsellorNotice(Notices?._id, true);
  };
  const HandlePublishToCounsellorToggleNo = (Notices) => {
    HandleUpdatePublishToCounsellorNotice(Notices?._id, false);
  };
  const HandleUpdatePublishToCounsellorNotice = async (
    NoticeId,
    BooleanValue
  ) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/PubishToCounsellorNotice`,
        { Noticeid: NoticeId, BooleanVal: BooleanValue },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchNotice();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Center
  const HandlePublishToCenterToggleYes = (Notices) => {
    HandleUpdatePublishToCenterNotice(Notices?._id, true);
  };
  const HandlePublishToCenterToggleNo = (Notices) => {
    HandleUpdatePublishToCenterNotice(Notices?._id, false);
  };
  const HandleUpdatePublishToCenterNotice = async (NoticeId, BooleanValue) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/PubishToCenterNotice`,
        { Noticeid: NoticeId, BooleanVal: BooleanValue },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchNotice();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // To All
  const HandlePublishToAllToggleYes = (Notices) => {
    HandleUpdatePublishToAllNotice(Notices?._id, true);
  };
  const HandlePublishToAllToggleNo = (Notices) => {
    HandleUpdatePublishToAllNotice(Notices?._id, false);
  };
  const HandleUpdatePublishToAllNotice = async (NoticeId, BooleanValue) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/PubishNoticeToAll`,
        { Noticeid: NoticeId, BooleanVal: BooleanValue },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchNotice();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // To All
  const HandleStopPublishToggleYes = (Notices) => {
    HandleUpdateStopPublishNotice(Notices?._id, true);
  };
  const HandleStopPublishToggleNo = (Notices) => {
    HandleUpdateStopPublishNotice(Notices?._id, false);
  };
  const HandleUpdateStopPublishNotice = async (NoticeId, BooleanValue) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/StopPubishNotice`,
        { Noticeid: NoticeId, isStopPublish: BooleanValue },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchNotice();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  //   PubishToCenterNotice
  // PubishToCounsellorNotice

  return (
    <>
      <div className="py-2.5 px-4">
        <div className="h-auto w-auto">
          {/* <!-- Table --> */}
          <table className=" min-w-full max-w-screen-xl  overflow-x-scroll text-base text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm sticky top-0 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="p-2 mt-1">
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className=" whitespace-nowrap overflow-hidden text-ellipsis">
                      Notice Name
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Publish To Counsellor
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Publish To Center
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Publish To All
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Stop Publish
                    </h1>
                  </div>
                </th>

                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Action
                    </h1>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {NoticeLoading ? (
                <div className=" absolute">
                  <div
                    className="flex justify-center items-center h-[60vh] 
       w-[135vh] relative top-0 left-0 "
                  >
                    <Loader />
                  </div>
                </div>
              ) : NoticeListData?.length !== 0 ? (
                NoticeListData?.filter((fil) => !fil?.isDeleted)?.map(
                  (data, i) => (
                    <tr
                      key={i}
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b
                   dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <div className=" w-52 truncate leading-1">
                          {data?.NoticeName}
                        </div>
                      </th>
                      <td className="px-4 py-2">
                        <div className="w-[15vh] flex gap-y-1 flex-row">
                          <ToggleButton
                            ClickYes={() =>
                              HandlePublishToCounsellorToggleYes(data)
                            }
                            ClickNo={() =>
                              HandlePublishToCounsellorToggleNo(data)
                            }
                            StateUpdate={data?.isPublishToCounsellor}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="w-[15vh] flex gap-y-1 flex-row">
                          <ToggleButton
                            ClickYes={() =>
                              HandlePublishToCenterToggleYes(data)
                            }
                            ClickNo={() => HandlePublishToCenterToggleNo(data)}
                            StateUpdate={data?.isPublishToCenter}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="w-[15vh] flex gap-y-1 flex-row">
                          <ToggleButton
                            ClickYes={() => HandlePublishToAllToggleYes(data)}
                            ClickNo={() => HandlePublishToAllToggleNo(data)}
                            StateUpdate={data?.isPublishToAll}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="w-[15vh] flex gap-y-1 flex-row">
                          <ToggleButton
                            ClickYes={() => HandleStopPublishToggleYes(data)}
                            ClickNo={() => HandleStopPublishToggleNo(data)}
                            StateUpdate={data?.isStopPublish}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() => {
                            HandleOpenUpdateNotice();
                            setEditUpdateNotice(data);
                          }}
                          className="text-base text-green-600 dark:text-green-500 hover:underline"
                        >
                          <AiTwotoneEdit size={20} />
                        </button>
                        <button
                          onClick={() => HandleDeleteNotice(data)}
                          className="text-base text-red-600 dark:text-red-500 hover:underline"
                        >
                          <MdDelete size={20} />
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <div
                  className="flex justify-center items-center h-[55vh] 
         w-auto relative -top-10 left-48  font-bold tracking-wider text-slate-500 "
                >
                  Create Notice
                </div>
              )}

              {/* <!-- Additional rows here --> */}
            </tbody>
          </table>
        </div>
      </div>

      {UpdateNoticeButton && (
        <UpdateNotice
          FetchNotice={FetchNotice}
          EditUpdateNotice={EditUpdateNotice}
          HandleCloseUpdateNotice={HandleCloseUpdateNotice}
          NoticeListData={NoticeListData}
        />
      )}
    </>
  );
};

export default ListNotice;
