import React, { useEffect, useCallback, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const UpdateApiKeyModal = ({ universityId, onClose, onSaved }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    LoginLink: "",
    apiUrl: "",
    apiKey: "",
    UniversityAPIkey: true,
  });

  // Close logic
  const handleClose = useCallback(() => {
    if (typeof onClose === "function") onClose();
  }, [onClose]);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [handleClose]);

  // Fetch existing API data
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/university-dynamic-api-key/${universityId}`,
          { withCredentials: true }
        );

        const data = res?.data;

        if (data) {
          setForm({
            LoginLink: data.LoginLink || "",
            apiUrl: data.apiUrl || "",
            apiKey: data.decryptedApiKey,
            UniversityAPIkey: data.UniversityAPIkey ?? true,
          });
        }
      } catch {
        toast.error("Failed to load API Key.");
      }
    };

    fetchApi();
  }, [universityId]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  console.log(form);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.apiUrl || !form.apiKey) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        universityId,
        LoginLink: form.LoginLink || "",
        apiUrl: form.apiUrl,
        apiKey: form.apiKey,
        isUniversityAPIkey: form.UniversityAPIkey,
      };

      console.log(payload);

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/university-dynamic-api-key`,
        payload,
        { withCredentials: true }
      );

      toast.success(res?.data?.message || "API Key updated.");

      onSaved?.();
      handleClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update API Key.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || !form.apiUrl || !form.apiKey;

  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center px-3"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div
        className="w-full max-w-xl mx-auto rounded-[var(--card-radius)] overflow-hidden"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--soft-shadow)",
          maxHeight: "calc(100vh - 48px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <header
          className="sticky top-0 px-5 py-4"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.98))",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Update API Key</h2>
              <p className="text-xs text-gray-500 mt-1">
                Modify API credentials for this university.
              </p>
            </div>

            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 rounded-full"
              style={{
                background: "rgba(239,68,68,0.06)",
              }}
            >
              ✕
            </button>
          </div>
        </header>

        {/* BODY */}
        <div
          className="overflow-y-auto px-5"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            {/* Login Link */}
            <div>
              <label className="block mb-1 text-xs">Login Link</label>
              <input
                type="text"
                name="LoginLink"
                value={form.LoginLink}
                onChange={handleChange}
                className="w-full text-sm px-3 py-2 rounded-lg"
                style={{
                  background: "var(--bg)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              />
            </div>

            {/* API URL */}
            <div>
              <label className="block mb-1 text-xs">API URL *</label>
              <input
                type="text"
                name="apiUrl"
                value={form.apiUrl}
                onChange={handleChange}
                required
                className="w-full text-sm px-3 py-2 rounded-lg"
                style={{
                  background: "var(--bg)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              />
            </div>

            {/* API KEY */}
            <div>
              <label className="block mb-1 text-xs">API Key *</label>
              <input
                type="text"
                name="apiKey"
                value={form.apiKey}
                onChange={handleChange}
                required
                placeholder="Enter new API key"
                className="w-full text-sm px-3 py-2 rounded-lg"
                style={{
                  background: "var(--bg)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              />
            </div>

            {/* ENABLE */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="UniversityAPIkey"
                checked={form.UniversityAPIkey}
                onChange={handleChange}
              />
              Enable API Key
            </label>

            <div style={{ height: 20 }} />
          </form>
        </div>

        {/* FOOTER */}
        <footer
          className="sticky bottom-0 px-5 py-4 flex justify-end gap-3"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.98))",
            borderTop: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs rounded-full border"
          >
            Cancel
          </button>

          <button
            onClick={() => document.querySelector("form").requestSubmit()}
            disabled={isDisabled}
            className="px-6 py-2 text-xs font-semibold rounded-full"
            style={{
              background: isDisabled
                ? "rgba(164,245,166,0.35)"
                : "var(--accent-mint)",
            }}
          >
            {isSubmitting ? "Saving..." : "Update"}
          </button>
        </footer>
      </div>
    </section>
  );
};

export default UpdateApiKeyModal;
