import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import uploadFile from "../../../../Helper/UploadFile";

const UpdateAccountant = ({
  GetAccountantDataByClick,
  HandleUpdateAccountantCloseButton,
  AccountantLoading,
  AccountantError,
  Accountant,
  GetAccountantData,
}) => {
  const [UpdateAccountantData, setUpdateAccountantData] = useState({
    Name: GetAccountantDataByClick?.name || "",
    Email: GetAccountantDataByClick?.email || "",
    Phone: GetAccountantDataByClick?.contact || "",
    Photo: GetAccountantDataByClick?.photo || "",
    EmployeId: GetAccountantDataByClick?.code || "",
  });

  const [localPreview, setLocalPreview] = useState(
    GetAccountantDataByClick?.photo || ""
  );
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    // if the prop changes, sync initial values
    setUpdateAccountantData({
      Name: GetAccountantDataByClick?.name || "",
      Email: GetAccountantDataByClick?.email || "",
      Phone: GetAccountantDataByClick?.contact || "",
      Photo: GetAccountantDataByClick?.photo || "",
      EmployeId: GetAccountantDataByClick?.code || "",
    });
    setLocalPreview(GetAccountantDataByClick?.photo || "");
  }, [GetAccountantDataByClick]);

  const HandleInputData = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUpdateAccountantData((preve) => ({
      ...preve,
      [name]: value,
    }));
  };

  // If user selects a file, upload it and set Photo to uploaded URL
  const HandleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // local preview
    const reader = new FileReader();
    reader.onload = () => setLocalPreview(reader.result);
    reader.readAsDataURL(file);

    // upload with helper (if it fails, keep preview but show toast)
    try {
      setUploadingPhoto(true);
      const response = await uploadFile(file);
      if (response?.url) {
        setUpdateAccountantData((preve) => ({
          ...preve,
          Photo: response.url,
        }));
      } else {
        toast.error("Photo upload failed");
      }
    } catch (err) {
      toast.error("Photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const HandleUpdateAccountantData = async (e) => {
    e.preventDefault();

    try {
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/Update-accountant`,
        {
          id: GetAccountantDataByClick?._id,
          name: UpdateAccountantData?.Name,
          email: UpdateAccountantData?.Email,
          contact: UpdateAccountantData?.Phone,
          photo: UpdateAccountantData?.Photo,
          code: UpdateAccountantData?.EmployeId,
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        GetAccountantData();
        HandleUpdateAccountantCloseButton();
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const [RequiredMsg1, setRequiredMsg1] = useState(false);
  const [RequiredMsg2, setRequiredMsg2] = useState(false);
  const [RequiredMsg3, setRequiredMsg3] = useState(false);
  const [RequiredMsg4, setRequiredMsg4] = useState(false);
  const [RequiredMsg5, setRequiredMsg5] = useState(false);

  const validationFunc = () => {
    setRequiredMsg1(UpdateAccountantData?.Name === "");
    setRequiredMsg2(UpdateAccountantData?.Email === "");
    setRequiredMsg3(UpdateAccountantData?.Phone === "");
    setRequiredMsg4(UpdateAccountantData?.EmployeId === "");
    setRequiredMsg5(UpdateAccountantData?.Phone === "");
  };

  useEffect(() => {
    validationFunc();
  }, [UpdateAccountantData]);

  return (
    <>
      <section
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-5 py-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Update Accountant
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Edit details for the selected accountant
              </p>
            </div>
            <div>
              <button
                aria-label="Close update accountant"
                onClick={HandleUpdateAccountantCloseButton}
                className="text-xl text-red-600 hover:opacity-90 p-1"
              >
                ×
              </button>
            </div>
          </div>

          <form
            onSubmit={HandleUpdateAccountantData}
            className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="Name"
                className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="Name"
                name="Name"
                type="text"
                placeholder="Ex: JHON BOSCO"
                value={UpdateAccountantData?.Name}
                onChange={HandleInputData}
                className={`w-full text-sm px-3 py-2 rounded-lg border ${
                  RequiredMsg1 ? "border-red-500" : "border-gray-300"
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                required
              />
              {RequiredMsg1 && (
                <p className="text-rose-500 text-xs mt-1">Name is required</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="Email"
                className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1"
              >
                Email Id <span className="text-red-500">*</span>
              </label>
              <input
                id="Email"
                name="Email"
                type="email"
                placeholder="Ex: it@gmail.com"
                value={UpdateAccountantData?.Email}
                onChange={HandleInputData}
                className={`w-full text-sm px-3 py-2 rounded-lg border ${
                  RequiredMsg2 ? "border-red-500" : "border-gray-300"
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                required
              />
              {RequiredMsg2 && (
                <p className="text-rose-500 text-xs mt-1">Email is required</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="Phone"
                className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1"
              >
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                id="Phone"
                name="Phone"
                type="tel"
                inputMode="tel"
                placeholder="Ex: +91 12345 12345"
                value={UpdateAccountantData?.Phone}
                onChange={HandleInputData}
                className={`w-full text-sm px-3 py-2 rounded-lg border ${
                  RequiredMsg3 ? "border-red-500" : "border-gray-300"
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                required
              />
              {RequiredMsg3 && (
                <p className="text-rose-500 text-xs mt-1">
                  Contact number is required
                </p>
              )}
            </div>

            {/* Employee ID */}
            <div>
              <label
                htmlFor="EmployeId"
                className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1"
              >
                Employee Id <span className="text-red-500">*</span>
              </label>
              <input
                id="EmployeId"
                name="EmployeId"
                type="text"
                placeholder="Ex: ACCT-01"
                value={UpdateAccountantData?.EmployeId}
                onChange={HandleInputData}
                className={`w-full text-sm px-3 py-2 rounded-lg border ${
                  RequiredMsg4 ? "border-red-500" : "border-gray-300"
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                required
              />
              {RequiredMsg4 && (
                <p className="text-rose-500 text-xs mt-1">
                  Employee Id is required
                </p>
              )}
            </div>

            {/* Photo upload & preview (span full width) */}
            <div className="md:col-span-2">
              <label
                htmlFor="Photo"
                className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1"
              >
                Photo <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                <input
                  id="Photo"
                  name="Photo"
                  type="file"
                  accept="image/*"
                  onChange={HandleUploadPhoto}
                  className={`text-sm block w-full md:w-auto`}
                />

                <div className="min-w-[80px] min-h-[80px] bg-gray-50 dark:bg-slate-800 flex items-center justify-center rounded overflow-hidden border">
                  {localPreview ? (
                    <img
                      src={localPreview}
                      alt="preview"
                      className="w-20 h-20 object-cover"
                    />
                  ) : UpdateAccountantData?.Photo ? (
                    <img
                      src={UpdateAccountantData?.Photo}
                      alt="accountant"
                      className="w-20 h-20 object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No photo</span>
                  )}
                </div>

                {uploadingPhoto && (
                  <div className="text-xs text-gray-500">Uploading...</div>
                )}
              </div>

              {RequiredMsg5 && (
                <p className="text-rose-500 text-xs mt-1">Photo is required</p>
              )}
            </div>

            {/* actions */}
            <div className="md:col-span-2 flex flex-col md:flex-row gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={HandleUpdateAccountantCloseButton}
                className="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50 dark:border-slate-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 rounded-md bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                disabled={AccountantLoading || uploadingPhoto}
              >
                {AccountantLoading ? "Updating..." : "Update Accountant"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default UpdateAccountant;
