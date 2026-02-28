import React, { useEffect, useState } from "react";
import uploadFile from "../../../../Helper/UploadFile";
import { toast } from "react-hot-toast";
import axios from "axios";
import UseGetCenterSubCenter from "../../../../CustomHooks/UseGetCenterSubCenter";
import { useSelector } from "react-redux";

const CreateSubCenters = ({
  HandleCloseSubCreateCenter,
  FetchSubCenterByPagination,
}) => {
  const { GetCenter, CenterLoading, CenterError, Center } =
    UseGetCenterSubCenter();

  const [CreateSubCenterData, setCreateSubCenterData] = useState({
    center: "",
    Name: "",
    contact: "",
    email: "",
    photo: "",
  });

  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const HandleInputData = (e) => {
    const { name, value } = e.target;
    setCreateSubCenterData((prev) => ({ ...prev, [name]: value }));
  };

  const HandleUploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadedFileName(file.name);
    try {
      const response = await uploadFile(file);
      setCreateSubCenterData((prev) => ({ ...prev, photo: response?.url }));
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const UniversitySelectedRedux = useSelector((state) => state.university);

  const HandleCreateSubCenterData = async (e) => {
    e.preventDefault();
    try {
      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register-sub-center`,
        {
          University: UniversitySelectedRedux?.id,
          center: CreateSubCenterData?.center,
          name: CreateSubCenterData?.Name,
          email: CreateSubCenterData?.email,
          contact: CreateSubCenterData?.contact,
          photo: CreateSubCenterData?.photo,
          role: "subCenter",
        },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        FetchSubCenterByPagination();
        HandleCloseSubCreateCenter();
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // validation states
  const [Required, setRequired] = useState({
    name: false,
    email: false,
    contact: false,
    photo: false,
    center: false,
  });

  const validationFunc = () => {
    setRequired({
      name: !CreateSubCenterData?.Name,
      email: !CreateSubCenterData?.email,
      contact: !CreateSubCenterData?.contact,
      photo: !CreateSubCenterData?.photo,
      center: !CreateSubCenterData?.center,
    });
  };

  useEffect(() => {
    GetCenter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    validationFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CreateSubCenterData]);

  const ReduxLoggedUserId = useSelector((state) => state?.user);

  return (
    <section
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-black/60"
    >
      <div
        className="bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-400 rounded-2xl
                   w-full max-w-2xl mx-auto overflow-auto max-h-[90vh] p-4 sm:p-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Create Sub Center</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Add a new sub center
            </p>
          </div>
          <button
            onClick={HandleCloseSubCreateCenter}
            className="text-lg text-red-600 hover:text-red-700 ml-2"
            aria-label="Close create sub center dialog"
          >
            ×
          </button>
        </div>

        <form onSubmit={HandleCreateSubCenterData} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Center select */}
            <div>
              <label className="block text-xs font-medium mb-1">
                Center <span className="text-red-500">*</span>
              </label>
              <select
                id="center"
                name="center"
                required
                onChange={HandleInputData}
                value={CreateSubCenterData?.center}
                className={`block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  Required.center
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-indigo-300"
                } bg-white dark:bg-slate-800`}
              >
                <option value="">Select Center</option>
                {CenterLoading ? (
                  <option value="">Loading...</option>
                ) : ReduxLoggedUserId?.role === "center" ? (
                  Center?.filter((c) => c?._id === ReduxLoggedUserId?.id).map(
                    (c) => (
                      <option key={c?._id} value={c?._id}>
                        {c?.name}
                      </option>
                    )
                  )
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
              {Required.center && (
                <p className="text-xs text-red-500 mt-1">Select center</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="Name"
                name="Name"
                required
                value={CreateSubCenterData?.Name}
                onChange={HandleInputData}
                placeholder="Ex: JHON BOSCO"
                className={`block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  Required.name
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-indigo-300"
                } bg-white dark:bg-slate-800`}
              />
              {Required.name && (
                <p className="text-xs text-red-500 mt-1">Name is required</p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-xs font-medium mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="contact"
                name="contact"
                required
                type="tel"
                value={CreateSubCenterData?.contact}
                onChange={HandleInputData}
                placeholder="Ex: 9123456789"
                className={`block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  Required.contact
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-indigo-300"
                } bg-white dark:bg-slate-800`}
              />
              {Required.contact && (
                <p className="text-xs text-red-500 mt-1">Phone is required</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                required
                type="email"
                value={CreateSubCenterData?.email}
                onChange={HandleInputData}
                placeholder="Ex: JHONBOSCO@gmail.com"
                className={`block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  Required.email
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-indigo-300"
                } bg-white dark:bg-slate-800`}
              />
              {Required.email && (
                <p className="text-xs text-red-500 mt-1">Email is required</p>
              )}
            </div>
          </div>

          {/* Photo upload */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Photo <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                id="photo"
                name="photo"
                required
                type="file"
                accept="image/*"
                onChange={HandleUploadPhoto}
                className={`text-sm ${
                  Required.photo ? "outline-red-500" : "outline-none"
                }`}
              />
              {uploading ? (
                <span className="text-xs text-gray-600">Uploading...</span>
              ) : uploadedFileName ? (
                <span className="text-xs text-gray-600 truncate max-w-xs">
                  {uploadedFileName}
                </span>
              ) : CreateSubCenterData?.photo ? (
                <span className="text-xs text-gray-600">Image uploaded</span>
              ) : null}
            </div>
            {Required.photo && (
              <p className="text-xs text-red-500 mt-1">Photo is required</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={HandleCloseSubCreateCenter}
              className="px-4 py-2 text-sm rounded-md border hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-60"
              disabled={
                Required.name ||
                Required.email ||
                Required.contact ||
                Required.photo ||
                Required.center ||
                uploading
              }
            >
              {uploading ? "Creating..." : "Create Sub Center"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateSubCenters;
