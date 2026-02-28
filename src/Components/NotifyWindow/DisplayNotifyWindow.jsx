import React from "react";
import { IoClose } from "react-icons/io5";

const DisplayNotifyWindow = ({
  EditUpdateNotifyWindow,
  HandleViewCloseNotifyWindow,
}) => {
  return (
    <div className=" absolute z-30 top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-80 ">
      <div className="flex justify-center items-center mt-10">
        <div className="bg-white dark:bg-slate-900 dark:text-white rounded-md px-4 w-[85vh] ">
          <div className=" flex justify-between items-center flex-row px-4 py-3 border-b-2 border-b-slate-400">
            <div className="text-lg font-semibold">Notify Look</div>
            <button onClick={HandleViewCloseNotifyWindow}>
              <IoClose
                size={28}
                className="text-red-600 hover:bg-red-600 hover:text-white rounded-full p-1"
              />
            </button>
          </div>
          <div className="px-10 py-10">
            <div className="m-4 ">
              <div className=" text-lg font-bold tracking-wider">
                <span className=" font-semibold">Label :-</span>{" "}
                {EditUpdateNotifyWindow?.NotifyName}
              </div>
            </div>
            <div className="m-4 ">
              <div className=" font-semibold text-lg">Content</div>
              <div
                className="flex justify-center items-center m-4"
                dangerouslySetInnerHTML={{
                  __html: EditUpdateNotifyWindow?.NotifyContent,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayNotifyWindow;
