import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const UpdateSubCounsellors = ({
  HandleCloseUpdateSubCounsellors,
  FetchSubCounsellorByPagination,
  EditOpenUpdateSubCounsellor,
}) => {
  const [UpdateSubCounsellorsData, setUpdateSubCounsellorsData] = useState({
    Counsellor: EditOpenUpdateSubCounsellor?.counsellors,
    Name: EditOpenUpdateSubCounsellor?.name,
    Email: EditOpenUpdateSubCounsellor?.email,
    Phone: EditOpenUpdateSubCounsellor?.contact,
    Photo: EditOpenUpdateSubCounsellor?.photo,
    EmployeId: EditOpenUpdateSubCounsellor?.code,
  });

  const HandleInputData = (e) => {
    const { name, value, files } = e.target;
    setUpdateSubCounsellorsData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const HandleUpdateSubCounsellorsData = async (e) => {
    e.preventDefault();
    try {
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdateSubCounsellor`,
        {
          id: EditOpenUpdateSubCounsellor?._id,
          name: UpdateSubCounsellorsData?.Name,
          email: UpdateSubCounsellorsData?.Email,
          contact: UpdateSubCounsellorsData?.Phone,
          photo: UpdateSubCounsellorsData?.Photo,
          code: UpdateSubCounsellorsData?.EmployeId,
        },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        FetchSubCounsellorByPagination();
        HandleCloseUpdateSubCounsellors();
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-900 dark:text-white rounded-xl shadow-2xl w-[90%] md:w-[500px] p-6 border border-gray-200 dark:border-slate-700">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-300 dark:border-slate-700">
          <div>
            <h1 className="text-lg font-semibold">Update Sub Counsellor</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Modify information
            </p>
          </div>

          <button
            onClick={HandleCloseUpdateSubCounsellors}
            className="text-red-500 hover:text-red-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={HandleUpdateSubCounsellorsData}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* NAME */}
          <div>
            <label className="text-xs font-medium mb-1 block">Name *</label>
            <input
              type="text"
              name="Name"
              placeholder="Ex: John Bosco"
              value={UpdateSubCounsellorsData?.Name}
              onChange={HandleInputData}
              className="w-full p-2.5 rounded-lg text-sm border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-xs font-medium mb-1 block">Email *</label>
            <input
              type="email"
              name="Email"
              placeholder="Ex: it@gmail.com"
              value={UpdateSubCounsellorsData?.Email}
              onChange={HandleInputData}
              className="w-full p-2.5 rounded-lg text-sm border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-xs font-medium mb-1 block">Contact *</label>
            <input
              type="number"
              name="Phone"
              placeholder="Ex: +91 12345 12345"
              value={UpdateSubCounsellorsData?.Phone}
              onChange={HandleInputData}
              className="w-full p-2.5 rounded-lg text-sm border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* EMPLOYEE ID */}
          <div>
            <label className="text-xs font-medium mb-1 block">
              Employee ID *
            </label>
            <input
              type="text"
              name="EmployeId"
              placeholder="Ex: EMP0054"
              value={UpdateSubCounsellorsData?.EmployeId}
              onChange={HandleInputData}
              className="w-full p-2.5 rounded-lg text-sm border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* PHOTO UPLOAD */}
          <div>
            <label className="text-xs font-medium mb-1 block">Photo *</label>
            <input
              type="file"
              name="Photo"
              onChange={HandleInputData}
              className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 rounded-lg text-sm border border-gray-300 dark:border-slate-600 cursor-pointer"
            />
          </div>

          {/* PHOTO PREVIEW */}
          <div className="flex justify-center items-center">
            {UpdateSubCounsellorsData?.Photo && (
              <img
                src={
                  UpdateSubCounsellorsData.Photo instanceof File
                    ? URL.createObjectURL(UpdateSubCounsellorsData.Photo)
                    : UpdateSubCounsellorsData.Photo
                }
                alt="Preview"
                className="w-24 h-24 rounded-full shadow-md object-cover"
              />
            )}
          </div>

          {/* BUTTON */}
          <div className="sm:col-span-2 text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UpdateSubCounsellors;
