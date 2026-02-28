import React, { useEffect, useMemo, useState } from "react";
import uploadFile from "../../../../Helper/UploadFile";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import UseGetCenterSubCenter from "../../../../CustomHooks/UseGetCenterSubCenter";

const CreateCounsellors = ({
  HandleCloseCreateCounsellors,
  FetchCounsellorByPagination,
}) => {
  const UniversitySelectedRedux = useSelector((state) => state.university);
  const LoggedUserRedux = useSelector((state) => state.user);

  const [form, setForm] = useState({
    CenterId: "",
    UserType: "Outsourced",
    Name: "",
    Email: "",
    Phone: "",
    Photo: "",
    EmployeId: "",
  });

  const { GetCenter, CenterLoading, CenterError, Center } =
    UseGetCenterSubCenter();

  useEffect(() => {
    GetCenter();
  }, []);

  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const errors = useMemo(() => {
    return {
      UserType: !form.UserType,
      Name: form.Name.trim() === "",
      Email: form.Email.trim() === "" || !/^\S+@\S+\.\S+$/.test(form.Email),
      Phone: form.Phone.trim() === "",
      EmployeId: form.EmployeId.trim() === "",
      Photo: !form.Photo,
    };
  }, [form]);

  const isFormValid = Object.values(errors).every((v) => v === false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const resp = await uploadFile(file);
      const url = resp?.url || "";
      setForm((p) => ({ ...p, Photo: url }));
      setPreview(url);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register-counsellor`,
        {
          University: UniversitySelectedRedux?.id,
          CenterId: form.CenterId,
          userType: form.UserType,
          name: form.Name,
          email: form.Email,
          photo: form.Photo,
          contact: form.Phone,
          code: form.EmployeId,
          role: "Counsellor",
        },
        { withCredentials: true }
      );

      if (response?.data?.success) {
        toast.success(response.data.message || "Counsellor created");
        if (typeof FetchCounsellorByPagination === "function") {
          FetchCounsellorByPagination();
        }
        if (typeof HandleCloseCreateCounsellors === "function") {
          HandleCloseCreateCounsellors();
        }
      } else {
        toast.error(response?.data?.message || "Failed to create counsellor");
      }
    } catch (err) {
      console.error("Create counsellor error:", err);
      toast.error(
        err?.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  console.log(form)

  useEffect(() => {
    if (form.Photo) setPreview(form.Photo);
  }, [form.Photo]);

  return (
    <section
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-black/60 overflow-auto"
      aria-modal="true"
      role="dialog"
    >
      {/* container: full width on small screens, constrained on md+ */}
      <div className="bg-white dark:bg-slate-900 dark:text-white border border-slate-400 rounded-lg w-full max-w-3xl mx-auto my-8 shadow-lg">
        {/* header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 border-b dark:border-slate-700">
          <div>
            <h1 className="text-lg font-semibold">Create Counsellor</h1>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              Add a counsellor for the selected university. Required fields
              marked <span className="text-red-500">*</span>.
            </p>
          </div>

          <div className="mt-3 sm:mt-0">
            <button
              aria-label="Close Create Counsellor Modal"
              onClick={HandleCloseCreateCounsellors}
              className="px-3 py-1 rounded-md text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Close"
            >
              Close
            </button>
          </div>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* UserType */}
            {(LoggedUserRedux.role === "Admin" ||
              LoggedUserRedux.role === "operation-manager") && (
              <div>
                <label className="block text-xs font-medium mb-1">
                  Center <span className="text-red-500">*</span>
                </label>
                <select
                  id="CenterId"
                  name="CenterId"
                  required
                  onChange={handleChange}
                  value={form?.CenterId}
                  className={`block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    form?.CenterId
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-indigo-300"
                  } bg-white dark:bg-slate-800`}
                >
                  <option value="">Select Center</option>
                  {CenterLoading ? (
                    <option value="">Loading...</option>
                  ) : LoggedUserRedux?.role === "center" ? (
                    Center?.filter((c) => c?._id === LoggedUserRedux?.id).map(
                      (c) => (
                        <option key={c?._id} value={c?._id}>
                          {c?.name}
                        </option>
                      )
                    )
                  ) : LoggedUserRedux?.role === "Admin" ? (
                    Center?.map((c) => (
                      <option key={c?._id} value={c?._id}>
                        {c?.name}
                      </option>
                    ))
                  ) : (
                    <option value="">You don't have permission</option>
                  )}
                </select>
              </div>
            )}

            {/* UserType */}
            <div>
              <label className="block text-xs font-medium mb-1">
                User Type <span className="text-red-500">*</span>
              </label>
              <select
                name="UserType"
                value={form.UserType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded text-sm bg-white dark:bg-gray-700 ${
                  errors.UserType ? "border-red-400" : "border-gray-300"
                }`}
              >
                <option value="Outsourced">Outsourced</option>
                <option value="Inhouse">Inhouse</option>
                <option value="Both">Both</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                name="Name"
                value={form.Name}
                onChange={handleChange}
                placeholder="Ex: John Bosco"
                className={`w-full px-3 py-2 border rounded text-sm bg-white dark:bg-gray-700 ${
                  errors.Name ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.Name && (
                <p className="text-xs text-red-500 mt-1">Name is required.</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="Email"
                type="email"
                value={form.Email}
                onChange={handleChange}
                placeholder="Ex: it@example.com"
                className={`w-full px-3 py-2 border rounded text-sm bg-white dark:bg-gray-700 ${
                  errors.Email ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.Email && (
                <p className="text-xs text-red-500 mt-1">
                  Valid email is required.
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium mb-1">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                name="Phone"
                type="tel"
                value={form.Phone}
                onChange={handleChange}
                placeholder="Ex: +91 12345 12345"
                className={`w-full px-3 py-2 border rounded text-sm bg-white dark:bg-gray-700 ${
                  errors.Phone ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.Phone && (
                <p className="text-xs text-red-500 mt-1">
                  Contact number is required.
                </p>
              )}
            </div>

            {/* Employee Id */}
            <div>
              <label className="block text-xs font-medium mb-1">
                Employee Id <span className="text-red-500">*</span>
              </label>
              <input
                name="EmployeId"
                value={form.EmployeId}
                onChange={handleChange}
                placeholder="Ex: 1234"
                className={`w-full px-3 py-2 border rounded text-sm bg-white dark:bg-gray-700 ${
                  errors.EmployeId ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.EmployeId && (
                <p className="text-xs text-red-500 mt-1">
                  Employee Id is required.
                </p>
              )}
            </div>

            {/* Photo Upload */}
            <div className="md:col-span-1">
              <label className="block text-xs font-medium mb-1">
                Photo <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadPhoto}
                className={`w-full text-sm file:px-3 file:py-1 file:border file:rounded file:text-sm ${
                  errors.Photo ? "border-red-400" : "border-gray-300"
                }`}
              />
              {uploading && (
                <p className="text-xs text-gray-500 mt-1">Uploading...</p>
              )}
              {errors.Photo && !form.Photo && (
                <p className="text-xs text-red-500 mt-1">Photo is required.</p>
              )}
            </div>

            {/* Preview + university info (span full width on small screens) */}
            <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-full sm:w-36 h-28 rounded overflow-hidden border bg-gray-50 dark:bg-slate-800 flex-shrink-0">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    No photo
                  </div>
                )}
              </div>

              <div className="flex-1 text-sm">
                <div>
                  <span className="text-xs text-gray-500">
                    Selected University:
                  </span>
                  <div className="font-semibold">
                    {UniversitySelectedRedux?.name || "None selected"}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Tip: upload a square / portrait image for best preview.
                </div>
              </div>
            </div>
          </div>

          {/* actions: responsive - full width on small screens */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={HandleCloseCreateCounsellors}
              className="w-full sm:w-auto px-4 py-2 rounded border text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className={`w-full sm:w-auto px-4 py-2 rounded text-sm font-semibold text-white ${
                !isFormValid || submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {submitting ? "Saving..." : "Create Counsellor"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateCounsellors;
