import React, { useEffect, useState } from "react";
import uploadFile from "../../../../Helper/UploadFile";
import axios from "axios";
import { toast } from "react-hot-toast";

const CreateOperations = ({
  HandleCloseCreateOperations,
  FetchOperationalManagerByPagination,
}) => {
  const [form, setForm] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Photo: "",
    EmployeId: "",
  });

  const [preview, setPreview] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);

  const [errors, setErrors] = useState({
    Name: false,
    Email: false,
    Phone: false,
    EmployeId: false,
    Photo: false,
  });

  useEffect(() => {
    setErrors({
      Name: form.Name.trim() === "",
      Email: form.Email.trim() === "",
      Phone: form.Phone === "" || form.Phone === null,
      EmployeId: form.EmployeId === "" || form.EmployeId === null,
      Photo: !form.Photo,
    });
  }, [form]);

  const HandleInputData = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const HandleUploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoadingUpload(true);
      const response = await uploadFile(file);
      const url = response?.url || "";
      setForm((prev) => ({ ...prev, Photo: url }));
      setPreview(url);
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoadingUpload(false);
    }
  };

  const isFormValid = Object.values(errors).every((v) => v === false);

  const HandleCreateOperationUserData = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register-main`,
        {
          name: form?.Name,
          email: form?.Email,
          contact: form?.Phone,
          photo: form?.Photo,
          code: `OP${form?.EmployeId}`,
          role: "operation-manager",
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        if (typeof FetchOperationalManagerByPagination === "function") {
          FetchOperationalManagerByPagination();
        }
        if (typeof HandleCloseCreateOperations === "function") {
          HandleCloseCreateOperations();
        }
      } else {
        toast.error(Response?.data?.message || "Failed to create.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <section
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-black/60"
      aria-modal="true"
      role="dialog"
    >
      {/* Modal container:
          - full-width & full-height on small screens (items-end -> slide up modal)
          - centered box on md+ screens
      */}
      <div
        className="w-full h-full md:h-auto md:max-h-[90vh] overflow-auto bg-white dark:bg-slate-900 dark:text-white border border-slate-400 rounded-t-2xl md:rounded-2xl
                      px-4 py-4 md:px-6 md:py-6
                      md:max-w-3xl"
      >
        {/* Header */}
        <div className="flex items-start md:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-lg font-bold">Create Operation User</h1>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Add a new operation manager. Required fields are marked with{" "}
              <span className="text-red-500">*</span>.
            </p>
          </div>

          <button
            aria-label="Close Create Operation Modal"
            onClick={HandleCloseCreateOperations}
            className="p-2 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={HandleCreateOperationUserData} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Name */}
            <div className="flex flex-col">
              <label className="block mb-1 text-xs font-medium dark:text-white text-gray-800">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="Name"
                value={form.Name}
                onChange={HandleInputData}
                placeholder="Ex: John Bosco"
                className={`w-full px-3 py-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 ${
                  errors.Name ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.Name && (
                <p className="text-red-500 text-xs mt-1">Name is required.</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="block mb-1 text-xs font-medium dark:text-white text-gray-800">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="Email"
                type="email"
                value={form.Email}
                onChange={HandleInputData}
                placeholder="Ex: it@example.com"
                className={`w-full px-3 py-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 ${
                  errors.Email ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.Email && (
                <p className="text-red-500 text-xs mt-1">Email is required.</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="block mb-1 text-xs font-medium dark:text-white text-gray-800">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="Phone"
                type="tel"
                value={form.Phone}
                onChange={HandleInputData}
                placeholder="Ex: +91 12345 12345"
                className={`w-full px-3 py-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 ${
                  errors.Phone ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.Phone && (
                <p className="text-red-500 text-xs mt-1">
                  Contact number is required.
                </p>
              )}
            </div>

            {/* Employee Id */}
            <div className="flex flex-col">
              <label className="block mb-1 text-xs font-medium dark:text-white text-gray-800">
                Employee Id <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="EmployeId"
                type="text"
                value={form.EmployeId}
                onChange={HandleInputData}
                placeholder="Ex: 1234"
                className={`w-full px-3 py-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 ${
                  errors.EmployeId ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.EmployeId && (
                <p className="text-red-500 text-xs mt-1">
                  Employee Id is required.
                </p>
              )}
            </div>

            {/* Photo upload */}
            <div className="flex flex-col">
              <label className="block mb-1 text-xs font-medium dark:text-white text-gray-800">
                Photo <span className="text-red-500">*</span>
              </label>

              <input
                required
                type="file"
                accept="image/*"
                onChange={HandleUploadPhoto}
                className={`w-full px-3 py-2 border rounded text-sm bg-white dark:bg-gray-700 ${
                  errors.Photo ? "border-red-400" : "border-gray-300"
                }`}
              />
              {loadingUpload && (
                <p className="text-xs text-gray-500 mt-1">Uploading...</p>
              )}
              {errors.Photo && !form.Photo && (
                <p className="text-red-500 text-xs mt-1">Photo is required.</p>
              )}
            </div>

            {/* Preview area (span full width) */}
            <div className="md:col-span-2 flex items-center gap-4">
              <div className="flex-1">
                {form.Photo || preview ? (
                  <div className="w-full sm:w-56 h-36 rounded-lg overflow-hidden border">
                    <img
                      src={form.Photo || preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">
                    No photo uploaded yet.
                  </div>
                )}
              </div>

              {/* on small screens buttons stack, on md+ they appear to right */}
              <div className="w-full md:w-auto mt-2 md:mt-0 flex flex-col md:flex-row gap-2 md:gap-3">
                <button
                  type="button"
                  onClick={HandleCloseCreateOperations}
                  className="w-full md:w-auto px-4 py-2 rounded border text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full md:w-auto px-4 py-2 rounded text-sm font-semibold text-white ${
                    isFormValid
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Create Operation User
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateOperations;
