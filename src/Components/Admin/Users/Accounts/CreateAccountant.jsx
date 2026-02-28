import React, { useEffect, useState } from "react";
import uploadFile from "../../../../Helper/UploadFile";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";

const CreateAccountant = ({
  HandleCloseCreateAccountant,
  AccountantLoading,
  AccountantError,
  Accountant,
  GetAccountantData,
}) => {
  const [CreateAccountantData, setCreateAccountantData] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Photo: "",
    EmployeId: "",
  });

  const [localPreview, setLocalPreview] = useState("");

  const HandleInputData = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setCreateAccountantData((preve) => ({
      ...preve,
      [name]: value,
    }));
  };

  const HandleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // optional quick local preview
    const reader = new FileReader();
    reader.onload = () => setLocalPreview(reader.result);
    reader.readAsDataURL(file);

    // upload
    try {
      const response = await uploadFile(file);
      setCreateAccountantData((Preve) => {
        return {
          ...Preve,
          Photo: response?.url,
        };
      });
    } catch (err) {
      toast.error("Photo upload failed");
    }
  };

  const UniversitySelectedRedux = useSelector((state) => state.university);

  const HandleCreateAccountantData = async (e) => {
    e.preventDefault();
    try {
      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register-accountant`,
        {
          University: UniversitySelectedRedux?.id,
          name: CreateAccountantData?.Name,
          email: CreateAccountantData?.Email,
          photo: CreateAccountantData?.Photo,
          contact: CreateAccountantData?.Phone,
          code: CreateAccountantData?.EmployeId,
          role: "Accountant",
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        GetAccountantData();
        HandleCloseCreateAccountant();
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
    setRequiredMsg1(CreateAccountantData?.Name === "");
    setRequiredMsg2(CreateAccountantData?.Email === "");
    setRequiredMsg3(CreateAccountantData?.Phone === "");
    setRequiredMsg4(CreateAccountantData?.EmployeId === "");
    setRequiredMsg5(CreateAccountantData?.Phone === "");
  };

  useEffect(() => {
    validationFunc();
  }, [CreateAccountantData]);

  return (
    <>
      {/* overlay */}
      <section
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        role="dialog"
        aria-modal="true"
      >
        {/* modal */}
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-5 py-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                Create Accountant
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Add a new accountant for the selected university
              </p>
            </div>
            <div>
              <button
                aria-label="Close create accountant"
                onClick={HandleCloseCreateAccountant}
                className="text-xl text-red-600 hover:opacity-90 p-1"
              >
                ×
              </button>
            </div>
          </div>

          {/* body */}
          <form
            onSubmit={HandleCreateAccountantData}
            className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Name */}
            <div className="col-span-1">
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
                value={CreateAccountantData?.Name}
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
            <div className="col-span-1">
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
                value={CreateAccountantData?.Email}
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
            <div className="col-span-1">
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
                value={CreateAccountantData?.Phone}
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
            <div className="col-span-1">
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
                value={CreateAccountantData?.EmployeId}
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

            {/* Photo upload */}
            <div className="col-span-1 md:col-span-2">
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
                  className={`text-sm block w-full md:w-auto ${
                    RequiredMsg5 ? "border-red-500" : ""
                  }`}
                />

                {/* preview */}
                <div className="min-w-[80px] min-h-[80px] bg-gray-50 dark:bg-slate-800 flex items-center justify-center rounded overflow-hidden border">
                  {localPreview || CreateAccountantData?.Photo ? (
                    // prefer local preview when available
                    <img
                      src={localPreview || CreateAccountantData?.Photo}
                      alt="preview"
                      className="w-20 h-20 object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No photo</span>
                  )}
                </div>
              </div>
              {RequiredMsg5 && (
                <p className="text-rose-500 text-xs mt-1">Photo is required</p>
              )}
            </div>

            {/* actions */}
            <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={HandleCloseCreateAccountant}
                className="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50 dark:border-slate-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 rounded-md bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                disabled={AccountantLoading}
              >
                {AccountantLoading ? "Creating..." : "Create Accountant"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default CreateAccountant;
