import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UpdateOperations = ({
  HandleCloseUpdateOperations,
  EditOperationsUpdate,
  FetchOperationalManagerByPagination,
}) => {
  const [UpdateOperationalUserData, setUpdateOperationalUserData] = useState({
    Name: EditOperationsUpdate?.name,
    Email: EditOperationsUpdate?.email,
    Phone: EditOperationsUpdate?.contact,
    Photo: EditOperationsUpdate?.photo,
    EmployeId: EditOperationsUpdate?.code,
  });

  const HandleInputData = (e) => {
    const { name, value, files } = e.target;
    setUpdateOperationalUserData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const HandleUpdateOperationalUserData = async (e) => {
    e.preventDefault();

    try {
      const Response = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/UpdateUniversityManagerAndOperational`,
        {
          id: EditOperationsUpdate?._id,
          name: UpdateOperationalUserData?.Name,
          email: UpdateOperationalUserData?.Email,
          contact: UpdateOperationalUserData?.Phone,
          photo: UpdateOperationalUserData?.Photo,
          code: UpdateOperationalUserData?.EmployeId,
        },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        FetchOperationalManagerByPagination();
        HandleCloseUpdateOperations();
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
    <section className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-900 dark:text-white rounded-xl w-[90%] md:w-[500px] p-5 shadow-2xl border border-gray-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-300 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold">Update Operation User</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Update user information
            </p>
          </div>

          <button
            onClick={HandleCloseUpdateOperations}
            className="text-red-500 hover:text-red-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={HandleUpdateOperationalUserData} className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-xs font-medium">Name *</label>
              <input
                type="text"
                name="Name"
                value={UpdateOperationalUserData?.Name}
                onChange={HandleInputData}
                placeholder="John Bosco"
                className="w-full p-2 rounded-lg text-sm border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-medium">Email *</label>
              <input
                type="email"
                name="Email"
                value={UpdateOperationalUserData?.Email}
                onChange={HandleInputData}
                placeholder="it@gmail.com"
                className="w-full p-2 rounded-lg text-sm border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="text-xs font-medium">Phone *</label>
              <input
                type="number"
                name="Phone"
                value={UpdateOperationalUserData?.Phone}
                onChange={HandleInputData}
                placeholder="+91 98765 43210"
                className="w-full p-2 rounded-lg text-sm border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* Employee ID */}
            <div>
              <label className="text-xs font-medium">Employee ID *</label>
              <input
                type="text"
                name="EmployeId"
                value={UpdateOperationalUserData?.EmployeId}
                onChange={HandleInputData}
                placeholder="EMP001"
                className="w-full p-2 rounded-lg text-sm border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Photo upload */}
            <div>
              <label className="text-xs font-medium">Photo *</label>
              <input
                type="file"
                name="Photo"
                onChange={HandleInputData}
                className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 cursor-pointer"
              />
            </div>

            {/* Photo Preview */}
            <div className="flex justify-center items-center">
              <img
                src={
                  UpdateOperationalUserData.Photo instanceof File
                    ? URL.createObjectURL(UpdateOperationalUserData.Photo)
                    : UpdateOperationalUserData.Photo
                }
                alt="preview"
                className="w-20 h-20 rounded-full object-cover shadow-md"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="text-right">
            <button
              type="submit"
              className="px-6 py-2 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UpdateOperations;
