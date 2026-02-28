import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UpdateCounsellors = ({
  HandleCloseCounsellorUpdate,
  EditCounsellorUpdate,
  FetchCounsellorByPagination,
}) => {
  const [UpdateCounsellorsData, setUpdateCounsellorsData] = useState({
    UserType: EditCounsellorUpdate?.userType,
    Name: EditCounsellorUpdate?.name,
    Email: EditCounsellorUpdate?.email,
    Phone: EditCounsellorUpdate?.contact,
    Photo: EditCounsellorUpdate?.photo,
    EmployeId: EditCounsellorUpdate?.code,
  });

  const HandleInputData = (e) => {
    const { name, value, files } = e.target;
    setUpdateCounsellorsData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const HandleUpdateCounsellorsData = async (e) => {
    e.preventDefault();

    try {
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdateCounsellor`,
        {
          id: EditCounsellorUpdate?._id,
          name: UpdateCounsellorsData?.Name,
          email: UpdateCounsellorsData?.Email,
          contact: UpdateCounsellorsData?.Phone,
          photo: UpdateCounsellorsData?.Photo,
          code: UpdateCounsellorsData?.EmployeId,
          userType: UpdateCounsellorsData?.UserType,
        },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        FetchCounsellorByPagination();
        HandleCloseCounsellorUpdate();
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <section className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-900 dark:text-white rounded-xl w-[90%] md:w-[500px] p-5 shadow-2xl border border-gray-300 dark:border-slate-700">

        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-300 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold">Update Counsellor</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Modify counsellor details
            </p>
          </div>

          <button
            onClick={HandleCloseCounsellorUpdate}
            className="text-red-500 hover:text-red-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={HandleUpdateCounsellorsData} className="space-y-4">

          {/* USER TYPE (full width) */}
          <div>
            <label className="text-xs font-medium">User Type *</label>
            <select
              name="UserType"
              value={UpdateCounsellorsData?.UserType}
              onChange={HandleInputData}
              className="w-full p-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Outsourced">Outsourced</option>
              <option value="Inhouse">Inhouse</option>
              <option value="Both">Both</option>
            </select>
          </div>

          {/* Row 1 — 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-xs font-medium">Name *</label>
              <input
                type="text"
                name="Name"
                value={UpdateCounsellorsData?.Name}
                onChange={HandleInputData}
                placeholder="John Bosco"
                className="w-full p-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-medium">Email *</label>
              <input
                type="email"
                name="Email"
                value={UpdateCounsellorsData?.Email}
                onChange={HandleInputData}
                placeholder="it@gmail.com"
                className="w-full p-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Row 2 — 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="text-xs font-medium">Phone *</label>
              <input
                type="number"
                name="Phone"
                value={UpdateCounsellorsData?.Phone}
                onChange={HandleInputData}
                placeholder="+91 98765 43210"
                className="w-full p-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Employee ID */}
            <div>
              <label className="text-xs font-medium">Employee ID *</label>
              <input
                type="text"
                name="EmployeId"
                value={UpdateCounsellorsData?.EmployeId}
                onChange={HandleInputData}
                placeholder="EMP001"
                className="w-full p-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Row 3 — 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Photo Upload */}
            <div>
              <label className="text-xs font-medium">Photo *</label>
              <input
                type="file"
                name="Photo"
                onChange={HandleInputData}
                className="w-full p-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer"
              />
            </div>

            {/* Photo Preview */}
            <div className="flex justify-center items-center">
              <img
                src={
                  UpdateCounsellorsData.Photo instanceof File
                    ? URL.createObjectURL(UpdateCounsellorsData.Photo)
                    : UpdateCounsellorsData.Photo
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
              Update Counsellor
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UpdateCounsellors;
