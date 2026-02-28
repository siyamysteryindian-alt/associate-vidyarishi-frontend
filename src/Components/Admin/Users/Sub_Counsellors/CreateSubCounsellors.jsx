import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import uploadFile from "../../../../Helper/UploadFile";
import { useSelector } from "react-redux";

const CreateSubCounsellors = ({
  HandleCloseCreateSubCounsellors,
  FetchSubCounsellorByPagination,
  CounsellorManager = [],
  CounsellorManagerLoading = false,
}) => {
  const [form, setForm] = useState({
    Counsellor: "",
    Name: "",
    Email: "",
    Phone: "",
    Photo: "",
    EmployeId: "",
  });

  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const UserRedux = useSelector((state) => state.user);
  const UniversitySelectedRedux = useSelector((state) => state.university);

  // derived validation
  const errors = {
    Counsellor: form.Counsellor.trim() === "",
    Name: form.Name.trim() === "",
    Email: form.Email.trim() === "",
    Phone: String(form.Phone).trim() === "",
    EmployeId: String(form.EmployeId).trim() === "",
    Photo: !form.Photo,
  };

  const isFormValid = !Object.values(errors).some(Boolean);

  // handle form changes
  const HandleInputData = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const HandleUploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const response = await uploadFile(file);
      const url = response?.url || "";
      setForm((p) => ({ ...p, Photo: url }));
      setPreview(url);
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const HandleCreateSubCounsellorsData = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register-subcounsellor`,
        {
          University: UniversitySelectedRedux?.id,
          counsellors: form?.Counsellor,
          name: form?.Name,
          email: form?.Email,
          photo: form?.Photo,
          contact: form?.Phone,
          code: form?.EmployeId,
          role: "subCenter",
        },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        toast.success(Response.data.message);
        if (typeof FetchSubCounsellorByPagination === "function")
          FetchSubCounsellorByPagination();
        if (typeof HandleCloseCreateSubCounsellors === "function")
          HandleCloseCreateSubCounsellors();
      } else {
        toast.error(Response?.data?.message || "Failed to create.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // filtered counsellors for select (if user role is Counsellor)
  const counsellorOptions = (CounsellorManager || []).filter((c) =>
    UserRedux?.role === "Counsellor" ? c?._id === UserRedux?.id : true
  );

  return (
    <section
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-black/60"
      aria-modal="true"
      role="dialog"
    >
      {/* Modal container: full-height on small screens, constrained on md+ */}
      <div className="w-full h-full md:h-auto overflow-y-scroll md:max-h-[90vh] max-w-xl md:max-w-3xl bg-white dark:bg-slate-900 dark:text-white border border-slate-300 rounded-lg md:rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-start md:items-center justify-between px-4 py-3 border-b dark:border-slate-800">
          <div>
            <h2 className="text-lg font-semibold leading-tight">
              Create Sub Counsellor
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Add a new sub-counsellor for the selected university.
            </p>
          </div>
          <div>
            <button
              onClick={HandleCloseCreateSubCounsellors}
              aria-label="Close"
              className="text-2xl text-red-600 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form area */}
        <form
          onSubmit={HandleCreateSubCounsellorsData}
          className="p-4 md:p-6 grid grid-cols-1 gap-4"
        >
          {/* Grid: 1 col mobile, 2 cols md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1">
            {/* Counsellor select */}
            <div className="flex flex-col">
              <label htmlFor="Counsellor" className="text-xs font-medium mb-1">
                Counsellor <span className="text-red-500">*</span>
              </label>
              <select
                id="Counsellor"
                name="Counsellor"
                value={form.Counsellor}
                onChange={HandleInputData}
                className={`w-full px-3 py-2 text-sm rounded border focus:outline-none focus:ring-2 ${
                  errors.Counsellor
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                } bg-white dark:bg-gray-700`}
                aria-required="true"
              >
                <option value="">Select counsellor</option>
                {CounsellorManagerLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  counsellorOptions.map((c) => (
                    <option key={c?._id} value={c?._id}>
                      {c?.name}
                    </option>
                  ))
                )}
              </select>
              {errors.Counsellor && (
                <p className="text-xs text-red-500 mt-1">
                  Please select a counsellor.
                </p>
              )}
            </div>

            {/* Name */}
            <div className="flex flex-col">
              <label htmlFor="Name" className="text-xs font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="Name"
                name="Name"
                value={form.Name}
                onChange={HandleInputData}
                placeholder="Ex: John Bosco"
                className={`w-full px-3 py-2 text-sm rounded border focus:outline-none focus:ring-2 ${
                  errors.Name
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                } bg-white dark:bg-gray-700`}
              />
              {errors.Name && (
                <p className="text-xs text-red-500 mt-1">Name is required.</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="Email" className="text-xs font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="Email"
                name="Email"
                type="email"
                value={form.Email}
                onChange={HandleInputData}
                placeholder="it@example.com"
                className={`w-full px-3 py-2 text-sm rounded border focus:outline-none focus:ring-2 ${
                  errors.Email
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                } bg-white dark:bg-gray-700`}
              />
              {errors.Email && (
                <p className="text-xs text-red-500 mt-1">Email is required.</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label htmlFor="Phone" className="text-xs font-medium mb-1">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                id="Phone"
                name="Phone"
                type="tel"
                value={form.Phone}
                onChange={HandleInputData}
                placeholder="+91 12345 12345"
                className={`w-full px-3 py-2 text-sm rounded border focus:outline-none focus:ring-2 ${
                  errors.Phone
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                } bg-white dark:bg-gray-700`}
              />
              {errors.Phone && (
                <p className="text-xs text-red-500 mt-1">Phone is required.</p>
              )}
            </div>

            {/* Employee Id */}
            <div className="flex flex-col">
              <label htmlFor="EmployeId" className="text-xs font-medium mb-1">
                Employee Id <span className="text-red-500">*</span>
              </label>
              <input
                id="EmployeId"
                name="EmployeId"
                value={form.EmployeId}
                onChange={HandleInputData}
                placeholder="Ex: 1234"
                className={`w-full px-3 py-2 text-sm rounded border focus:outline-none focus:ring-2 ${
                  errors.EmployeId
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                } bg-white dark:bg-gray-700`}
              />
              {errors.EmployeId && (
                <p className="text-xs text-red-500 mt-1">
                  Employee Id is required.
                </p>
              )}
            </div>
          </div>

          {/* Photo upload row (spans full width) */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-1">
            <div className="flex-1">
              <label htmlFor="photo" className="text-xs font-medium mb-1 block">
                Photo <span className="text-red-500">*</span>
              </label>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={HandleUploadPhoto}
                className="block text-sm"
                aria-required="true"
              />
              {errors.Photo && (
                <p className="text-xs text-red-500 mt-1">Photo is required.</p>
              )}
              {uploading && (
                <p className="text-xs text-gray-500 mt-1">Uploading...</p>
              )}
            </div>

            <div className="w-36 h-28 rounded border overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              {form.Photo || preview ? (
                <img
                  src={form.Photo || preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-500">No photo</span>
              )}
            </div>
          </div>

          {/* Actions: stacked on mobile, inline on md+ */}
          <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-end">
            <button
              type="button"
              onClick={HandleCloseCreateSubCounsellors}
              className="w-full md:w-auto px-4 py-2 rounded border text-sm bg-white text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isFormValid || uploading}
              className={`w-full md:w-auto px-4 py-2 rounded text-sm font-semibold text-white ${
                isFormValid && !uploading
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Create Sub Counsellor
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateSubCounsellors;
