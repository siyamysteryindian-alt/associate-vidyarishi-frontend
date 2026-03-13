import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const DeleteEmailTemplate = ({
  SelectedEmailData,
  HandleCloseDeleteEmailTemplate,
  FetchEmailTemplate,
}) => {

  const HandleDelete = async () => {
    try {
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteEmailTemplate`,
        {
          emailId: SelectedEmailData?._id,
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        FetchEmailTemplate();
        HandleCloseDeleteEmailTemplate();
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="absolute z-30 top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-80">
      <div className="flex justify-center items-center mt-40">
        <div className="bg-white dark:bg-slate-900 dark:text-white rounded-xl w-[400px] p-6">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Delete Email Template</h2>

            <button onClick={HandleCloseDeleteEmailTemplate}>
              <IoClose
                size={26}
                className="text-red-600 hover:bg-red-600 hover:text-white rounded-full p-1"
              />
            </button>
          </div>

          <p className="text-sm mb-6">
            Are you sure you want to delete this template?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={HandleCloseDeleteEmailTemplate}
              className="px-4 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-200"
            >
              Cancel
            </button>

            <button
              onClick={HandleDelete}
              className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DeleteEmailTemplate;