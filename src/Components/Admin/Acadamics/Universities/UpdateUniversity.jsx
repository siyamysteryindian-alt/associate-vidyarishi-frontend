import React, { useEffect, useState, useCallback } from "react";
import uploadFile from "../../../../Helper/UploadFile";
import toast from "react-hot-toast";
import axios from "axios";

/**
 * UpdateUniversity
 * - Header and footer are sticky; only the form body scrolls.
 * - Preserves original behavior (upload, preview, patch request) and prop signatures.
 *
 * Props:
 * - CloseUpdateButton: function to close modal
 * - EditUniversityData: object containing data to prefill the form
 * - FetchUniversitiesByPagination: callback to refresh list after update
 *
 * NOTE: fallback preview image path (local upload):
 * "/mnt/data/2f284af6-deb0-4c5f-91d6-997cb24eaf68.png"
 */

const FALLBACK_PREVIEW = "/mnt/data/2f284af6-deb0-4c5f-91d6-997cb24eaf68.png";

const UpdateUniversity = ({
  CloseUpdateButton,
  EditUniversityData,
  FetchUniversitiesByPagination,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [UniversityDataform, setUniversityDataform] = useState({
    id: "",
    UniversityDealingWith: "",
    Name: "",
    ShortName: "",
    address: "",
    Vertical: "",
    Photo: "",
  });

  // sync incoming edit data
  useEffect(() => {
    if (EditUniversityData) {
      setUniversityDataform({
        id: EditUniversityData?._id || "",
        UniversityDealingWith: EditUniversityData?.UniversityDealingWith || "",
        Name: EditUniversityData?.name || "",
        ShortName: EditUniversityData?.shortName || "",
        address: EditUniversityData?.address || "",
        Vertical: EditUniversityData?.vertical || "",
        Photo: EditUniversityData?.photo || "",
      });
    }
  }, [EditUniversityData]);

  // close on Escape
  const handleClose = useCallback(() => {
    if (!isSubmitting && !uploadingPhoto)
      CloseUpdateButton && CloseUpdateButton();
  }, [isSubmitting, uploadingPhoto, CloseUpdateButton]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUniversityDataform((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_DOCUMENT_SIZE = 1 * 1024 * 1024; // 1MB
    if (file.size > MAX_DOCUMENT_SIZE) {
      toast.error("File size exceeds the 1 MB limit.");
      return;
    }

    try {
      setUploadingPhoto(true);
      const res = await uploadFile(file);
      if (res?.url) {
        setUniversityDataform((prev) => ({ ...prev, Photo: res.url }));
        toast.success("Image uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    // basic client-side validation
    if (
      !UniversityDataform.Name ||
      !UniversityDataform.ShortName ||
      !UniversityDataform.Vertical ||
      !UniversityDataform.address ||
      !UniversityDataform.UniversityDealingWith ||
      !UniversityDataform.Photo
    ) {
      toast.error("Please fill all required fields and upload a photo.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdateUniversity`,
        {
          id: UniversityDataform?.id,
          name: UniversityDataform?.Name,
          shortName: UniversityDataform?.ShortName,
          address: UniversityDataform?.address,
          vertical: UniversityDataform?.Vertical,
          UniversityDealingWith: UniversityDataform?.UniversityDealingWith,
          photo: UniversityDataform?.Photo,
        },
        { withCredentials: true }
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message || "University updated");
        CloseUpdateButton && CloseUpdateButton();
        FetchUniversitiesByPagination && FetchUniversitiesByPagination();
      } else {
        toast.error(res?.data?.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSaveDisabled =
    isSubmitting ||
    uploadingPhoto ||
    !UniversityDataform.Name ||
    !UniversityDataform.ShortName ||
    !UniversityDataform.Vertical ||
    !UniversityDataform.address ||
    !UniversityDataform.UniversityDealingWith ||
    !UniversityDataform.Photo;

  /* small reusable input wrapper for consistent visuals */
  const InputWrap = ({ children }) => (
    <div
      style={{
        background: "var(--bg, #fff)",
        borderRadius: 12,
        padding: 6,
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
    >
      {children}
    </div>
  );

  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      aria-modal="true"
      role="dialog"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      {/* Modal card */}
      <div
        className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.98))",
          border: "1px solid rgba(16,24,40,0.06)",
          maxHeight: "calc(100vh - 48px)",
        }}
      >
        {/* Sticky Header */}
        <header
          className="sticky top-0 z-20"
          style={{
            background:
              "linear-gradient(90deg, rgba(236,72,153,0.04), rgba(99,102,241,0.03))",
            borderBottom: "1px solid rgba(16,24,40,0.03)",
          }}
        >
          <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
            <div>
              <h3
                className="text-lg sm:text-xl font-semibold"
                style={{ color: "rgb(15,23,42)" }}
              >
                Update University
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
                Edit university profile and branding. Changes reflect across
                listings.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting || uploadingPhoto}
                aria-label="Close"
                className="inline-flex items-center justify-center rounded-full p-2 transition-colors"
                style={{
                  color:
                    isSubmitting || uploadingPhoto
                      ? "rgba(239,68,68,0.35)"
                      : "#ef4444",
                  background: "rgba(239,68,68,0.06)",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable form body only */}
        <div
          className="overflow-y-auto px-0"
          style={{
            paddingLeft: 0,
            paddingRight: 0,
            // leave space for header + footer (approx 160px), adjustable if needed
            maxHeight: "calc(100vh - 200px)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-0"
          >
            {/* Left: form (spans 2 columns) */}
            <div className="col-span-2 p-6 sm:p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-xs font-medium text-slate-700">
                    University Type <span className="text-red-500">*</span>
                  </label>
                  <InputWrap>
                    <select
                      name="UniversityDealingWith"
                      value={UniversityDataform.UniversityDealingWith}
                      onChange={handleInput}
                      className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                      required
                    >
                      <option value="">Select</option>
                      <option value="outSourced Partner">
                        Outsourced Partner
                      </option>
                      <option value="inHouse Student">In-house Student</option>
                      <option value="Both">Both</option>
                    </select>
                  </InputWrap>
                </div>

                <div>
                  <label className="block mb-2 text-xs font-medium text-slate-700">
                    Short Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="ShortName"
                    value={UniversityDataform.ShortName}
                    onChange={handleInput}
                    placeholder="GTU"
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                    required
                    style={{
                      background: "var(--bg)",
                      borderRadius: 12,
                      padding: "8px",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-xs font-medium text-slate-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="Name"
                    value={UniversityDataform.Name}
                    onChange={handleInput}
                    placeholder="Global Tech University"
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                    required
                    style={{
                      background: "var(--bg)",
                      borderRadius: 12,
                      padding: "8px",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-xs font-medium text-slate-700">
                    Vertical <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="Vertical"
                    value={UniversityDataform.Vertical}
                    onChange={handleInput}
                    placeholder="Engineering / Management"
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                    required
                    style={{
                      background: "var(--bg)",
                      borderRadius: 12,
                      padding: "8px",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-xs font-medium text-slate-700">
                  Address <span className="text-red-500">*</span>
                </label>

                <textarea
                  name="address"
                  rows={3}
                  value={UniversityDataform.address}
                  onChange={handleInput}
                  placeholder="Street, City, Pincode..."
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none resize-none"
                  required
                  style={{
                    background: "var(--bg)",
                    borderRadius: 12,
                    padding: "8px",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                />
              </div>
              {/* mobile actions (inside scrollable area, visible on small screens) */}
              <div className="flex items-center justify-between gap-3 lg:hidden pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting || uploadingPhoto}
                  className="flex-1 px-4 py-2 rounded-full border text-sm"
                  style={{ borderColor: "rgba(16,24,40,0.06)" }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaveDisabled}
                  className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-shadow ${
                    isSaveDisabled
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md hover:brightness-95"
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
              <div style={{ height: 16 }} />{" "}
              {/* spacing bottom so content not hidden behind footer on very small screens */}
            </div>

            {/* Right: upload & preview (sticky inside the scrollable area) */}
            <aside
              className="col-span-1 border-l"
              style={{ borderLeft: "1px solid rgba(16,24,40,0.03)" }}
            >
              <div
                className="p-6 flex flex-col gap-4 h-full"
                style={{ minHeight: 360 }}
              >
                <div>
                  <label className="block mb-2 text-xs font-medium text-slate-700">
                    Photo <span className="text-red-500">*</span>
                  </label>

                  <label
                    htmlFor="UploadUniversityPhoto"
                    className="block cursor-pointer"
                    tabIndex={0}
                  >
                    <div
                      className={`w-full h-36 rounded-2xl flex items-center justify-center transition-all duration-200
                        ${
                          UniversityDataform.Photo
                            ? "ring-2 ring-offset-2 ring-green-200"
                            : "border-2 border-dashed border-slate-200"
                        }`}
                      style={{
                        background: "linear-gradient(180deg, #fff,#f8fafc)",
                      }}
                    >
                      {uploadingPhoto ? (
                        <div className="text-sm text-slate-600">
                          Uploading...
                        </div>
                      ) : UniversityDataform.Photo ? (
                        <img
                          src={UniversityDataform.Photo}
                          alt="preview"
                          className="w-full h-full object-cover rounded-2xl"
                          style={{ maxHeight: 220 }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                          <svg
                            width="34"
                            height="34"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 3v10"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="text-xs">
                            Click to upload image (max 1 MB)
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  <input
                    id="UploadUniversityPhoto"
                    type="file"
                    accept="image/*"
                    onChange={handleUploadPhoto}
                    hidden
                  />
                </div>

                {UniversityDataform.Photo ? (
                  <div className="mt-2 rounded-lg p-3 bg-white shadow-sm">
                    <div className="flex items-start gap-3">
                      <img
                        src={UniversityDataform.Photo}
                        alt="preview"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-800">
                          {UniversityDataform.Name || "University name"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {UniversityDataform.ShortName || "Short name"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-slate-500">
                      Image uploaded & ready. This appears on listings and
                      cards.
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-slate-400 flex items-center gap-3">
                    <img
                      src={FALLBACK_PREVIEW}
                      alt="fallback"
                      className="w-12 h-12 object-cover rounded-md opacity-60"
                    />
                    <div>No preview yet — upload an image under 1 MB.</div>
                  </div>
                )}

                {/* actions for wide screens remain at the bottom of this aside */}
                <div className="mt-auto flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting || uploadingPhoto}
                    className="flex-1 px-4 py-2 rounded-full border text-sm"
                    style={{ borderColor: "rgba(16,24,40,0.06)" }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // trigger the main form submit which is higher in the DOM
                      const form = document.querySelector("form");
                      if (form) form.requestSubmit();
                    }}
                    disabled={isSaveDisabled}
                    className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-shadow ${
                      isSaveDisabled
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md hover:brightness-95"
                    }`}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </aside>
          </form>
        </div>

        {/* Sticky Footer (visible on small screens as well) */}
        <footer
          className="sticky bottom-0 z-20 lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.98))",
            borderTop: "1px solid rgba(16,24,40,0.03)",
          }}
        >
          <div className="p-4 sm:p-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting || uploadingPhoto}
              className="px-5 py-2 text-xs rounded-full border"
              style={{
                borderColor: "rgba(16,24,40,0.06)",
                color: "var(--muted)",
                background: "transparent",
              }}
            >
              Cancel
            </button>

            <button
              onClick={() => {
                const form = document.querySelector("form");
                if (form) form.requestSubmit();
              }}
              disabled={isSaveDisabled}
              className="px-6 py-2 text-xs font-semibold rounded-full flex items-center gap-2 justify-center"
              style={{
                background: isSaveDisabled
                  ? "rgba(164,245,166,0.35)"
                  : "var(--accent-mint)",
                color: "var(--brand-ink)",
                boxShadow: isSaveDisabled ? "none" : "var(--soft-shadow)",
                cursor: isSaveDisabled ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default UpdateUniversity;
