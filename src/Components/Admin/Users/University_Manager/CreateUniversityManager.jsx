import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import uploadFile from "../../../../Helper/UploadFile";

const CreateUniversityManager = ({
  HandleCloseCreateUniversityManager,
  FetchUniversityManagerByPagination,
}) => {
  const [form, setForm] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Photo: "",
    EmployeId: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // update preview when Photo url changes
    setPreview(form.Photo || null);
  }, [form.Photo]);

  const validate = (values) => {
    const errs = {};
    if (!values.Name || values.Name.trim().length < 2) {
      errs.Name = "Name is required (min 2 chars).";
    }
    if (!values.Email) {
      errs.Email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.Email.trim())
    ) {
      errs.Email = "Enter a valid email address.";
    }
    if (!values.Phone) {
      errs.Phone = "Contact number is required.";
    } else if (!/^\d{7,15}$/.test(String(values.Phone).replace(/\s+/g, ""))) {
      errs.Phone = "Enter a valid phone number (7–15 digits).";
    }
    if (!values.EmployeId) {
      errs.EmployeId = "Employee ID is required.";
    }
    if (!values.Photo) {
      errs.Photo = "Photo is required.";
    }
    return errs;
  };

  useEffect(() => {
    setErrors(validate(form));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // optimistic local preview
    const url = URL.createObjectURL(file);
    setPreview(url);

    try {
      setLoading(true);
      const res = await uploadFile(file); // your helper
      if (res?.url) {
        setForm((p) => ({ ...p, Photo: res.url }));
        // toast.success("Photo uploaded");
      } else {
        toast.error("Upload failed, try again.");
        setPreview(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed, try again.");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = () => {
    setForm((p) => ({ ...p, Photo: "" }));
    setPreview(null);
  };

  const handleBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      Name: true,
      Email: true,
      Phone: true,
      Photo: true,
      EmployeId: true,
    });

    const validation = validate(form);
    if (Object.keys(validation).length) {
      setErrors(validation);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: form.Name.trim(),
        email: form.Email.trim(),
        contact: String(form.Phone).trim(),
        photo: form.Photo,
        code: `UM${String(form.EmployeId).trim()}`,
        role: "university-manager",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register-main`,
        payload,
        { withCredentials: true }
      );

      if (response?.data?.success) {
        toast.success(response.data.message || "University manager created.");
        // refresh list & close
        if (typeof FetchUniversityManagerByPagination === "function")
          FetchUniversityManagerByPagination();
        if (typeof HandleCloseCreateUniversityManager === "function")
          HandleCloseCreateUniversityManager();
        // reset form (optional)
        setForm({
          Name: "",
          Email: "",
          Phone: "",
          Photo: "",
          EmployeId: "",
        });
        setPreview(null);
        setTouched({});
      } else {
        toast.error(response?.data?.message || "Failed to create manager.");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-black/60 overflow-auto"
    >
      <div className="bg-white dark:bg-slate-900 dark:text-white border border-slate-400 rounded-2xl w-full max-w-2xl px-6 py-5 my-8">
        <header className="flex items-start md:items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold">Create University Manager</h1>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Add a new manager — credentials will be created automatically.
            </p>
          </div>
          <div>
            <button
              onClick={HandleCloseCreateUniversityManager}
              aria-label="Close"
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded p-1"
            >
              ✕
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                name="Name"
                value={form.Name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ex: John Bosco"
                className={`w-full px-3 py-2 rounded text-sm border ${
                  touched.Name && errors.Name
                    ? "border-red-500"
                    : "border-gray-300"
                } bg-white dark:bg-gray-700`}
                aria-invalid={!!(touched.Name && errors.Name)}
                aria-describedby={
                  touched.Name && errors.Name ? "err-name" : undefined
                }
              />
              {touched.Name && errors.Name && (
                <p id="err-name" className="text-red-500 text-xs mt-1">
                  {errors.Name}
                </p>
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
                onBlur={handleBlur}
                placeholder="Ex: it@example.com"
                className={`w-full px-3 py-2 rounded text-sm border ${
                  touched.Email && errors.Email
                    ? "border-red-500"
                    : "border-gray-300"
                } bg-white dark:bg-gray-700`}
                aria-invalid={!!(touched.Email && errors.Email)}
                aria-describedby={
                  touched.Email && errors.Email ? "err-email" : undefined
                }
              />
              {touched.Email && errors.Email && (
                <p id="err-email" className="text-red-500 text-xs mt-1">
                  {errors.Email}
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
                onBlur={handleBlur}
                placeholder="Digits only, 7-15 chars"
                className={`w-full px-3 py-2 rounded text-sm border ${
                  touched.Phone && errors.Phone
                    ? "border-red-500"
                    : "border-gray-300"
                } bg-white dark:bg-gray-700`}
                aria-invalid={!!(touched.Phone && errors.Phone)}
                aria-describedby={
                  touched.Phone && errors.Phone ? "err-phone" : undefined
                }
              />
              {touched.Phone && errors.Phone && (
                <p id="err-phone" className="text-red-500 text-xs mt-1">
                  {errors.Phone}
                </p>
              )}
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-xs font-medium mb-1">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <input
                name="EmployeId"
                value={form.EmployeId}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Numeric employee id (used for code)"
                className={`w-full px-3 py-2 rounded text-sm border ${
                  touched.EmployeId && errors.EmployeId
                    ? "border-red-500"
                    : "border-gray-300"
                } bg-white dark:bg-gray-700`}
                aria-invalid={!!(touched.EmployeId && errors.EmployeId)}
                aria-describedby={
                  touched.EmployeId && errors.EmployeId ? "err-eid" : undefined
                }
              />
              {touched.EmployeId && errors.EmployeId && (
                <p id="err-eid" className="text-red-500 text-xs mt-1">
                  {errors.EmployeId}
                </p>
              )}
            </div>

            {/* Photo */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1">
                Photo <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3 items-start">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  onBlur={handleBlur}
                  aria-describedby={
                    touched.Photo && errors.Photo ? "err-photo" : undefined
                  }
                  className="text-sm"
                />
                {loading && <div className="text-xs">Uploading…</div>}

                {preview ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-xs px-2 py-1 rounded bg-red-100 text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : null}
              </div>
              {touched.Photo && errors.Photo && (
                <p id="err-photo" className="text-red-500 text-xs mt-1">
                  {errors.Photo}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={HandleCloseCreateUniversityManager}
              className="px-4 py-2 rounded border text-sm"
              aria-label="Cancel create university manager"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded text-sm font-semibold ${
                loading
                  ? "bg-gray-400 text-white"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateUniversityManager;
