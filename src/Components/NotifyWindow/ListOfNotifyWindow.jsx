import React, { useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../Helper/Loader";
import UpdateNotifyWindow from "./UpdateNotifyWindow";
import ToggleButton from "../../Common/ToggleButton";
import { IoMdEye } from "react-icons/io";
import DisplayNotifyWindow from "./DisplayNotifyWindow";

const ListOfNotifyWindow = ({
  NotifyWindowListData,
  NotifyWindowLoading,
  FetchNotifyWindow,
}) => {
  const [UpdateNotifyWindowButton, setUpdateNotifyWindowButton] =
    useState(false);
  const [EditUpdateNotifyWindow, setEditUpdateNotifyWindow] = useState(null);

  const HandleOpenUpdateNotifyWindow = () => {
    setUpdateNotifyWindowButton(true);
  };
  const HandleCloseUpdateNotifyWindow = () => {
    setUpdateNotifyWindowButton(false);
  };

  const [viewNotifyWindow, setviewNotifyWindow] = useState(false);
  const HandleViewOpenNotifyWindow = (data) => {
    setviewNotifyWindow(true);
    setEditUpdateNotifyWindow(data);
  };
  const HandleViewCloseNotifyWindow = () => {
    setviewNotifyWindow(false);
  };

  const HandleDeleteNotifyWindow = (data) => {
    Swal.fire({
      title: `Do you want to Delete ${data?.NotifyName}`,
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
        HandleDeleteNotifyWindowAPI(data?._id, true);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const HandleDeleteNotifyWindowAPI = async (Notifyid, BooleanVal) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteNotify`,
        { Notifyid, BooleanVal },
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
            FetchNotifyWindow();
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
  const HandlePublishToCounsellorToggleYes = (NotifyWindows) => {
    console.log(NotifyWindows?._id);
    HandleUpdatePublishToCounsellorNotifyWindow(NotifyWindows?._id, true);
  };
  const HandlePublishToCounsellorToggleNo = (NotifyWindows) => {
    HandleUpdatePublishToCounsellorNotifyWindow(NotifyWindows?._id, false);
  };
  const HandleUpdatePublishToCounsellorNotifyWindow = async (
    NotifyWindowId,
    BooleanValue
  ) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/NotifyPublishToCounsellor`,
        { Notifyid: NotifyWindowId, BooleanVal: BooleanValue },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        console.log(response);
        FetchNotifyWindow();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  //   Sub Counsellor
  const HandlePublishToSubCounsellorToggleYes = (NotifyWindows) => {
    HandleUpdatePublishToSubCounsellorNotifyWindow(NotifyWindows?._id, true);
  };
  const HandlePublishToSubCounsellorToggleNo = (NotifyWindows) => {
    HandleUpdatePublishToSubCounsellorNotifyWindow(NotifyWindows?._id, false);
  };
  const HandleUpdatePublishToSubCounsellorNotifyWindow = async (
    NotifyWindowId,
    BooleanValue
  ) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/NotifyPublishToSubCounsellor`,
        { Notifyid: NotifyWindowId, BooleanVal: BooleanValue },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchNotifyWindow();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Sub Center
  const HandlePublishToSubCenterToggleYes = (NotifyWindows) => {
    HandleUpdatePublishToSubCenterNotifyWindow(NotifyWindows?._id, true);
  };
  const HandlePublishToSubCenterToggleNo = (NotifyWindows) => {
    HandleUpdatePublishToSubCenterNotifyWindow(NotifyWindows?._id, false);
  };
  const HandleUpdatePublishToSubCenterNotifyWindow = async (
    NotifyWindowId,
    BooleanValue
  ) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/NotifyPublishToSubCenter`,
        { Notifyid: NotifyWindowId, BooleanVal: BooleanValue },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchNotifyWindow();
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
  const HandlePublishToCenterToggleYes = (NotifyWindows) => {
    HandleUpdatePublishToCenterNotifyWindow(NotifyWindows?._id, true);
  };
  const HandlePublishToCenterToggleNo = (NotifyWindows) => {
    HandleUpdatePublishToCenterNotifyWindow(NotifyWindows?._id, false);
  };
  const HandleUpdatePublishToCenterNotifyWindow = async (
    NotifyWindowId,
    BooleanValue
  ) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/NotifyPublishToCenter`,
        { Notifyid: NotifyWindowId, BooleanVal: BooleanValue },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchNotifyWindow();
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
  const HandlePublishToAllToggleYes = (NotifyWindows) => {
    HandleUpdatePublishToAllNotifyWindow(NotifyWindows?._id, true);
  };
  const HandlePublishToAllToggleNo = (NotifyWindows) => {
    HandleUpdatePublishToAllNotifyWindow(NotifyWindows?._id, false);
  };
  const HandleUpdatePublishToAllNotifyWindow = async (
    NotifyWindowId,
    BooleanValue
  ) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/NotifyPublishToAll`,
        { Notifyid: NotifyWindowId, BooleanVal: BooleanValue },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        FetchNotifyWindow();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // To Stop All
  const HandleStopPublishToggleYes = (NotifyWindows) => {
    HandleUpdateStopPublishNotifyWindow(NotifyWindows?._id, true);
  };
  const HandleStopPublishToggleNo = (NotifyWindows) => {
    HandleUpdateStopPublishNotifyWindow(NotifyWindows?._id, false);
  };
  const HandleUpdateStopPublishNotifyWindow = async (
    NotifyWindowId,
    BooleanVal
  ) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/NotifyStopPublish`,
        { Notifyid: NotifyWindowId, BooleanVal: BooleanVal },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        console.log(response);
        toast.success(response?.data?.message);
        FetchNotifyWindow();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <>
      <div className="py-2.5 px-4">
        <div className="h-auto w-[80vh]">
          {/* <!-- Table --> */}
          <table className=" min-w-full max-w-screen-xl  overflow-x-scroll text-base text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm sticky top-0 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="p-2 mt-1">
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className=" whitespace-nowrap overflow-hidden text-ellipsis">
                      Content
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      To Counsellor
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      To SubCounsellor
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      To Center
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      To SubCenter
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      To All
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
              {NotifyWindowLoading ? (
                <div className=" absolute">
                  <div
                    className="flex justify-center items-center h-[60vh] 
       w-[135vh] relative top-0 left-0 "
                  >
                    <Loader />
                  </div>
                </div>
              ) : NotifyWindowListData?.length !== 0 ? (
                NotifyWindowListData?.filter((fil) => !fil?.isDeleted)?.map(
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
                          {data?.NotifyName}
                        </div>
                      </th>

                      {/* Counsellor */}
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

                      {/* Sub Counsellor */}
                      <td className="px-4 py-2">
                        <div className="w-[15vh] flex gap-y-1 flex-row">
                          <ToggleButton
                            ClickYes={() =>
                              HandlePublishToSubCounsellorToggleYes(data)
                            }
                            ClickNo={() =>
                              HandlePublishToSubCounsellorToggleNo(data)
                            }
                            StateUpdate={data?.isPublishToSubCounsellor}
                          />
                        </div>
                      </td>

                      {/* Center */}
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

                      {/* Sub Center */}
                      <td className="px-4 py-2">
                        <div className="w-[15vh] flex gap-y-1 flex-row">
                          <ToggleButton
                            ClickYes={() =>
                              HandlePublishToSubCenterToggleYes(data)
                            }
                            ClickNo={() =>
                              HandlePublishToSubCenterToggleNo(data)
                            }
                            StateUpdate={data?.isPublishToSubCenter}
                          />
                        </div>
                      </td>

                      {/* To All */}
                      <td className="px-4 py-2">
                        <div className="w-[15vh] flex gap-y-1 flex-row">
                          <ToggleButton
                            ClickYes={() => HandlePublishToAllToggleYes(data)}
                            ClickNo={() => HandlePublishToAllToggleNo(data)}
                            StateUpdate={data?.isPublishToAll}
                          />
                        </div>
                      </td>

                      {/* To Stop */}
                      <td className="px-4 py-2">
                        <div className="w-[15vh] flex gap-y-1 flex-row">
                          <ToggleButton
                            ClickYes={() => HandleStopPublishToggleYes(data)}
                            ClickNo={() => HandleStopPublishToggleNo(data)}
                            StateUpdate={data?.isStopPublish}
                          />
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-2 flex gap-4">
                        <button
                          onClick={() => {
                            HandleOpenUpdateNotifyWindow();
                            setEditUpdateNotifyWindow(data);
                          }}
                          className="text-base text-green-600 dark:text-green-500 hover:underline"
                        >
                          <AiTwotoneEdit size={20} />
                        </button>
                        <button
                          onClick={() => HandleViewOpenNotifyWindow(data)}
                          className="text-base text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          <IoMdEye size={20} />
                        </button>
                        <button
                          onClick={() => HandleDeleteNotifyWindow(data)}
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
                  Create NotifyWindow
                </div>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {UpdateNotifyWindowButton && (
        <UpdateNotifyWindow
          FetchNotifyWindow={FetchNotifyWindow}
          EditUpdateNotifyWindow={EditUpdateNotifyWindow}
          HandleCloseUpdateNotifyWindow={HandleCloseUpdateNotifyWindow}
          NotifyWindowListData={NotifyWindowListData}
        />
      )}
      {viewNotifyWindow && (
        <DisplayNotifyWindow
          EditUpdateNotifyWindow={EditUpdateNotifyWindow}
          HandleViewCloseNotifyWindow={HandleViewCloseNotifyWindow}
        />
      )}
    </>
  );
};

export default ListOfNotifyWindow;
