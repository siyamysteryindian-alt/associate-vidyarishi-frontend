import React, { useEffect, useState, useCallback } from "react";
import uploadFile from "../../../../Helper/UploadFile";
import axios from "axios";
import { toast } from "react-hot-toast";
import useGetUniversity from "../../../../CustomHooks/UseGetUniversities";

/**
 * NOTE: I included your uploaded image path as a fallback preview asset.
 * Path from your environment (uploaded): /mnt/data/2f284af6-deb0-4c5f-91d6-997cb24eaf68.png
 * The consuming environment will transform this local path to a usable URL.
 */
const FALLBACK_PREVIEW = "/mnt/data/2f284af6-deb0-4c5f-91d6-997cb24eaf68.png";

const CreateUniversity = ({
  OncloseUniversityCreate,
  FetchUniversitiesByPagination,
}) => {
  const { GetUniversity } = useGetUniversity();

  const [UniversityDataform, setUniversityDataform] = useState({
    UniversityDealingWith: "",
    Name: "",
    ShortName: "",
    Address: "",
    Vertical: "",
    profile_Photo: "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const HandleClickCloseCreateUniversity = useCallback(() => {
    if (!isSubmitting && !uploadingImage) {
      OncloseUniversityCreate();
    }
  }, [isSubmitting, uploadingImage, OncloseUniversityCreate]);

  // close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") HandleClickCloseCreateUniversity();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [HandleClickCloseCreateUniversity]);

  const HandleOnchangeInputItems = (e) => {
    const { name, value } = e.target;
    setUniversityDataform((prev) => ({ ...prev, [name]: value }));
  };

  const HandleUploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_DOCUMENT_SIZE = 1 * 1024 * 1024;
    if (file.size > MAX_DOCUMENT_SIZE) {
      toast.error("File size exceeds the 1 MB limit.");
      return;
    }

    try {
      setUploadingImage(true);
      const response = await uploadFile(file);

      if (response?.url) {
        setUniversityDataform((prev) => ({
          ...prev,
          profile_Photo: response.url,
        }));
        toast.success("Image uploaded");
      } else {
        throw new Error("No URL returned from upload");
      }
    } catch (err) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const HandleSubmitUniversityForm = async (e) => {
    e.preventDefault();

    if (!UniversityDataform?.profile_Photo) {
      toast.error("Please upload university photo.");
      return;
    }

    try {
      setIsSubmitting(true);

      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/Create-Univeristy`,
        {
          UniversityDealingWith: UniversityDataform?.UniversityDealingWith,
          name: UniversityDataform?.Name,
          shortName: UniversityDataform?.ShortName,
          vertical: UniversityDataform?.Vertical,
          address: UniversityDataform?.Address,
          photo: UniversityDataform?.profile_Photo,
          role: "University",
        },
        { withCredentials: true },
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message || "University created");
        FetchUniversitiesByPagination();
        GetUniversity();
        OncloseUniversityCreate();
      } else {
        toast.error(Response?.data?.message || "Failed to create university.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSaveDisabled =
    isSubmitting ||
    uploadingImage ||
    !UniversityDataform.UniversityDealingWith ||
    !UniversityDataform.Name ||
    !UniversityDataform.ShortName ||
    !UniversityDataform.Vertical ||
    !UniversityDataform.Address ||
    !UniversityDataform.profile_Photo;

  /* Reusable input wrapper */
  const InputWrap = ({ children }) => (
    <div
      className="rounded-lg px-3 py-2 transition-shadow w-full"
      style={{
        background: "var(--bg)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.6), 0 6px 18px rgba(16,24,40,0.03)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {children}
    </div>
  );

  return (
    <>
      {/* Overlay / Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-university-title"
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* backdrop */}
        <div
          className="absolute inset-0 bg-black/45"
          onClick={HandleClickCloseCreateUniversity}
        />

        {/* Modal frame: full height on mobile, centered on larger screens */}
        <div
          className="relative w-full h-full sm:h-auto sm:my-6 sm:mx-4 max-w-2xl"
          style={{ maxHeight: "calc(100vh - 48px)" }}
        >
          {/* Card wrapper */}
          <div
            className="flex flex-col h-full"
            style={{
              background: "var(--surface)",
              boxShadow: "var(--soft-shadow)",
              borderRadius: "var(--card-radius)",
              overflow: "hidden", // important so header/footer sticky works visually
            }}
          >
            {/* Sticky Header */}
            <div
              className="sticky top-0 z-20"
              style={{
                background: "var(--surface)",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <div className="p-4 sm:p-6 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1
                    id="create-university-title"
                    className="text-lg font-semibold"
                    style={{ color: "var(--brand-ink)" }}
                  >
                    Create University
                  </h1>
                  <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                    Add a university profile — clean, responsive data entry
                    form.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={HandleClickCloseCreateUniversity}
                  disabled={isSubmitting || uploadingImage}
                  aria-label="Close"
                  className="inline-flex items-center justify-center rounded-full p-2 text-sm font-medium"
                  style={{
                    color:
                      isSubmitting || uploadingImage
                        ? "rgba(239,68,68,0.4)"
                        : "#ef4444",
                    background: "rgba(239,68,68,0.06)",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable form body - only this area scrolls */}
            <div
              className="px-4 sm:px-6 pb-4"
              style={{
                overflowY: "auto",
                // Reserve space for header + footer by subtracting their approximate heights from viewport.
                maxHeight: "calc(100vh - 260px)",
              }}
            >
              <form
                id="createUniversityForm"
                onSubmit={HandleSubmitUniversityForm}
                className="space-y-4 pt-2"
              >
                {/* University Dealing With */}
                <div>
                  <label
                    className="text-xs font-medium mb-2 inline-block"
                    style={{ color: "var(--brand-ink)" }}
                  >
                    University Dealing With{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <InputWrap>
                    <div className="relative flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="flex-shrink-0"
                      >
                        <path
                          d="M12 2v4"
                          stroke="rgba(34,34,34,0.8)"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6 6v12"
                          stroke="rgba(34,34,34,0.6)"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18 6v12"
                          stroke="rgba(34,34,34,0.6)"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <select
                        id="UniversityDealingWith"
                        name="UniversityDealingWith"
                        value={UniversityDataform.UniversityDealingWith}
                        onChange={HandleOnchangeInputItems}
                        required
                        className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                        style={{ color: "var(--brand-ink)" }}
                      >
                        <option value="">Select</option>
                        <option value="outSourced Partner">
                          Outsourced Partner
                        </option>
                        <option value="inHouse Student">
                          In-house Student
                        </option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                  </InputWrap>
                </div>

                {/* Name & ShortName */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-xs font-medium mb-2 inline-block"
                      style={{ color: "var(--brand-ink)" }}
                    >
                      Name <span className="text-red-500">*</span>
                    </label>

                    <div className="relative flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="flex-shrink-0"
                      >
                        <path
                          d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5s-5 2.239-5 5s2.239 5 5 5z"
                          stroke="rgba(34,34,34,0.7)"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 20c0-4 4-6 8-6s8 2 8 6"
                          stroke="rgba(34,34,34,0.6)"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <input
                        type="text"
                        id="Name"
                        name="Name"
                        required
                        onChange={HandleOnchangeInputItems}
                        value={UniversityDataform.Name}
                        className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none placeholder:opacity-70"
                        placeholder="e.g. Global Tech University"
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
                    <label
                      className="text-xs font-medium mb-2 inline-block"
                      style={{ color: "var(--brand-ink)" }}
                    >
                      Short Name <span className="text-red-500">*</span>
                    </label>

                    <div className="relative flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="flex-shrink-0"
                      >
                        <path
                          d="M4 7h16M4 12h10M4 17h7"
                          stroke="rgba(34,34,34,0.7)"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <input
                        type="text"
                        name="ShortName"
                        id="ShortName"
                        required
                        onChange={HandleOnchangeInputItems}
                        value={UniversityDataform.ShortName}
                        className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none placeholder:opacity-70"
                        placeholder="e.g. GTU"
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
                </div>

                {/* Vertical & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-xs font-medium mb-2 inline-block"
                      style={{ color: "var(--brand-ink)" }}
                    >
                      Vertical <span className="text-red-500">*</span>
                    </label>

                    <div className="relative flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="flex-shrink-0"
                      >
                        <path
                          d="M3 7h18M3 12h18M3 17h18"
                          stroke="rgba(34,34,34,0.7)"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <input
                        type="text"
                        id="Vertical"
                        name="Vertical"
                        required
                        onChange={HandleOnchangeInputItems}
                        value={UniversityDataform.Vertical}
                        className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none placeholder:opacity-70"
                        placeholder="e.g. Engineering / Management"
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
                    <label
                      className="text-xs font-medium mb-2 inline-block"
                      style={{ color: "var(--brand-ink)" }}
                    >
                      Address <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      id="Address"
                      rows={2}
                      name="Address"
                      required
                      onChange={HandleOnchangeInputItems}
                      value={UniversityDataform.Address}
                      className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none resize-none placeholder:opacity-70"
                      placeholder="Street, City, Pincode..."
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

                {/* Upload & Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div>
                    <label
                      className="text-xs font-medium mb-2 inline-block"
                      style={{ color: "var(--brand-ink)" }}
                    >
                      Upload Photo <span className="text-red-500">*</span>
                    </label>

                    <label
                      htmlFor="UploadUniversityPhoto"
                      className="block cursor-pointer"
                    >
                      <div
                        className="w-full h-28 rounded-lg flex items-center justify-center text-sm text-center transition-all"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(162,142,249,0.04), rgba(164,245,166,0.06))",
                          border:
                            UniversityDataform.profile_Photo !== ""
                              ? "1px solid rgba(34,197,94,0.6)"
                              : "1px dashed rgba(148,163,184,0.5)",
                          color: "var(--brand-ink)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                        }}
                      >
                        {uploadingImage ? (
                          <div className="text-sm">Uploading...</div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <svg
                              width="30"
                              height="30"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M12 3v12"
                                stroke="rgba(34,34,34,0.7)"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                                stroke="rgba(34,34,34,0.6)"
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
                      type="file"
                      onChange={HandleUploadPhoto}
                      name="profile_Photo"
                      id="UploadUniversityPhoto"
                      accept="image/*"
                      hidden
                    />
                  </div>

                  <div>
                    <label
                      className="text-xs font-medium mb-2 inline-block"
                      style={{ color: "var(--brand-ink)" }}
                    >
                      Preview
                    </label>

                    <div className="min-h-[88px] flex items-center">
                      {UniversityDataform.profile_Photo ? (
                        <div className="flex items-center gap-3">
                          <img
                            className="w-24 h-24 rounded-lg border p-1 object-cover"
                            style={{ borderColor: "rgba(0,0,0,0.06)" }}
                            src={UniversityDataform.profile_Photo}
                            alt="Preview"
                          />
                          <div
                            className="text-xs"
                            style={{ color: "var(--muted)" }}
                          >
                            <div
                              className="font-semibold"
                              style={{ color: "var(--brand-ink)" }}
                            >
                              {UniversityDataform.Name || "University name"}
                            </div>
                            <div className="mt-1">Uploaded image preview</div>
                            <div className="mt-2 text-[11px] text-[var(--muted)]">
                              Click upload to replace
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          {/* fallback preview (local uploaded reference) */}
                          <img
                            className="w-24 h-24 rounded-lg border p-1 object-cover opacity-60"
                            style={{ borderColor: "rgba(0,0,0,0.06)" }}
                            src={FALLBACK_PREVIEW}
                            alt="Fallback preview"
                          />
                          <div
                            className="text-xs"
                            style={{ color: "var(--muted)" }}
                          >
                            <div
                              className="font-semibold"
                              style={{ color: "var(--brand-ink)" }}
                            >
                              No image yet
                            </div>
                            <div className="mt-1">
                              Use the upload area to add a photo
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Extra bottom spacing so footer doesn't overlap content on very small screens */}
                <div style={{ height: 12 }} />
              </form>
            </div>

            {/* Sticky Footer (only these buttons remain fixed at bottom) */}
            <div
              className="sticky bottom-0 z-20"
              style={{
                background: "var(--surface)",
                borderTop: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={HandleClickCloseCreateUniversity}
                  disabled={isSubmitting || uploadingImage}
                  className="px-5 py-2 text-xs rounded-full border"
                  style={{
                    borderColor: "rgba(0,0,0,0.06)",
                    color: "var(--muted)",
                    background: "transparent",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="createUniversityForm"
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
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
                {/* <button
                  form={undefined}
                  type="submit"
                  onClick={(e) => {
                    // forward submit event to internal form
                    const formEl = e.currentTarget
                      .closest(".flex")
                      ?.querySelector("form");
                    if (formEl) formEl.requestSubmit();
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
                  {isSubmitting ? "Saving..." : "Save"}
                  {!isSaveDisabled && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="flex-shrink-0"
                    >
                      <path
                        d="M5 12h14"
                        stroke="rgba(34,34,34,0.9)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 5l7 7-7 7"
                        stroke="rgba(34,34,34,0.9)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateUniversity;
