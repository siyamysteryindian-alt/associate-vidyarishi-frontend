import React, { useEffect, useState } from "react";
import UseGetCenterSubCenter from "../../../../CustomHooks/UseGetCenterSubCenter";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const UpdateSubCenters = ({
  HandleUpdateSubCenterCloseButton,
  FetchSubCenterByPagination,
  EditUpdateSubCenterData,
}) => {
  const { GetCenter, CenterLoading, Center } = UseGetCenterSubCenter();

  useEffect(() => {
    GetCenter();
  }, []);

  const [UpdateSubCenterData, setUpdateSubCenterData] = useState({
    Center: EditUpdateSubCenterData?.center?._id || "",
    Name: EditUpdateSubCenterData?.name || "",
    Email: EditUpdateSubCenterData?.email || "",
  });

  useEffect(() => {
    setUpdateSubCenterData({
      Center: EditUpdateSubCenterData?.center?._id || "",
      Name: EditUpdateSubCenterData?.name || "",
      Email: EditUpdateSubCenterData?.email || "",
    });
  }, [EditUpdateSubCenterData]);

  const HandleInputData = (e) => {
    const { name, value } = e.target;
    setUpdateSubCenterData((prev) => ({ ...prev, [name]: value }));
  };

  const HandleUpdateSubCenterData = async (e) => {
    e.preventDefault();
    try {
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdateSubCenter`,
        {
          id: EditUpdateSubCenterData?._id,
          center: UpdateSubCenterData?.Center,
          name: UpdateSubCenterData?.Name,
          email: UpdateSubCenterData?.Email,
        },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        HandleUpdateSubCenterCloseButton();
        FetchSubCenterByPagination();
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const [required, setRequired] = useState({ center: false, name: false });

  useEffect(() => {
    setRequired({
      center: !UpdateSubCenterData?.Center,
      name: !UpdateSubCenterData?.Name?.trim(),
    });
  }, [UpdateSubCenterData]);

  const ReduxLoggedUserId = useSelector((state) => state?.user);

  return (
    <section
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-black/60"
    >
      <div className="bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-400 rounded-lg w-full max-w-2xl mx-auto overflow-auto max-h-[90vh] p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Update Sub Center</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Edit details for the selected sub center
            </p>
          </div>

          <button
            onClick={HandleUpdateSubCenterCloseButton}
            aria-label="Close update sub center dialog"
            className="text-xl text-red-600 hover:text-red-700 ml-2"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={HandleUpdateSubCenterData}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Center select */}
          <div>
            <label
              htmlFor="Center"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
            >
              Center <span className="text-red-500">*</span>
            </label>

            <select
              id="Center"
              name="Center"
              value={UpdateSubCenterData.Center}
              onChange={HandleInputData}
              required
              className={`block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                required.center
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-indigo-200"
              } bg-white dark:bg-slate-800`}
            >
              <option value="">Select center</option>
              {CenterLoading ? (
                <option value="">Loading...</option>
              ) : ReduxLoggedUserId?.role === "center" ? (
                Center?.filter(
                  (center) => center?._id === ReduxLoggedUserId?.id
                ).map((c) => (
                  <option key={c?._id} value={c?._id}>
                    {c?.name}
                  </option>
                ))
              ) : ReduxLoggedUserId?.role === "Admin" ? (
                Center?.map((c) => (
                  <option key={c?._id} value={c?._id}>
                    {c?.name}
                  </option>
                ))
              ) : (
                <option value="">You don't have permission</option>
              )}
            </select>
            {required.center && (
              <p className="text-xs text-red-500 mt-1">
                Please select a center.
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="Name"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
            >
              Name <span className="text-red-500">*</span>
            </label>

            <input
              id="Name"
              name="Name"
              value={UpdateSubCenterData.Name}
              onChange={HandleInputData}
              required
              placeholder="Enter sub center name"
              className={`block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                required.name
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-indigo-200"
              } bg-white dark:bg-slate-800`}
            />
            {required.name && (
              <p className="text-xs text-red-500 mt-1">Name is required.</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="Email"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
            >
              Email <span className="text-red-500">*</span>
            </label>

            <input
              id="Email"
              name="Email"
              value={UpdateSubCenterData.Email}
              onChange={HandleInputData}
              required
              placeholder="Enter sub center Email"
              className={`block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                required.Email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-indigo-200"
              } bg-white dark:bg-slate-800`}
            />
            {required.Email && (
              <p className="text-xs text-red-500 mt-1">Email is required.</p>
            )}
          </div>

          {/* Actions: full width */}
          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={HandleUpdateSubCenterCloseButton}
              className="px-4 py-2 text-sm rounded-md border hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-60"
              disabled={required.center || required.name}
            >
              Update Sub Center
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UpdateSubCenters;
