import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useGetUniversity from "../../../../CustomHooks/UseGetUniversities";
import useGetProgramType from "../../../../CustomHooks/UseGetProgramType";

/**
 * UpdatePrograms (refreshed)
 * - Sticky header & footer; only the form body scrolls
 * - Responsive, accessible, preserves existing behavior
 *
 * NOTE: fallback preview path (local uploaded asset) — tooling will transform to a usable URL:
 * "/mnt/data/2f284af6-deb0-4c5f-91d6-997cb24eaf68.png"
 */
const FALLBACK_PREVIEW = "/mnt/data/2f284af6-deb0-4c5f-91d6-997cb24eaf68.png";

const UpdatePrograms = ({
  CloseCreateProgram,
  FetchProgramByPagination,
  EditUpdateProgram,
}) => {
  const {
    GetUniversity,
    loading: loadingUnis,
    universities,
    GetDepartment,
    AllDepartmentLoading,
    AllDepartment,
  } = useGetUniversity();

  const { GetProgramType, LoadingProgramTypes, ProgramTypes } =
    useGetProgramType();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [ProgramData, setProgramData] = useState({
    University: EditUpdateProgram?.university?._id || "",
    Department: EditUpdateProgram?.Department?._id || "",
    ProgramType: EditUpdateProgram?.programType?._id || "",
    ProgramName: EditUpdateProgram?.name || "",
    ShortName: EditUpdateProgram?.shortName || "",
  });

  // Fetch supporting lists on mount
  useEffect(() => {
    GetDepartment();
    GetProgramType();
    GetUniversity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep ProgramData synced if EditUpdateProgram changes
  useEffect(() => {
    setProgramData({
      University: EditUpdateProgram?.university?._id || "",
      Department: EditUpdateProgram?.Department?._id || "",
      ProgramType: EditUpdateProgram?.programType?._id || "",
      ProgramName: EditUpdateProgram?.name || "",
      ShortName: EditUpdateProgram?.shortName || "",
    });
  }, [EditUpdateProgram]);

  // Safe close wrapper
  const handleClose = useCallback(() => {
    if (!isSubmitting && typeof CloseCreateProgram === "function")
      CloseCreateProgram();
  }, [isSubmitting, CloseCreateProgram]);

  // Escape-to-close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  // generic input handler
  const HandleInputChange = (e) => {
    const { name, value } = e.target;
    setProgramData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for the field as user types
    setValidationErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  // simple dynamic validation
  const validateFields = () => {
    const errors = {};
    if (!ProgramData.University) errors.University = "University is required";
    if (!ProgramData.Department) errors.Department = "Department is required";
    if (!ProgramData.ProgramType)
      errors.ProgramType = "Program type is required";
    if (!ProgramData.ProgramName)
      errors.ProgramName = "Program name is required";
    if (!ProgramData.ShortName) errors.ShortName = "Short name is required";
    return errors;
  };

  const HandleUpdateProgram = async (e) => {
    e.preventDefault();
    setFormTouched(true);

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdateProgram`,
        {
          id: EditUpdateProgram?._id,
          name: ProgramData?.ProgramName,
          Department: ProgramData?.Department,
          programType: ProgramData?.ProgramType,
          shortName: ProgramData?.ShortName,
        },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message || "Program updated");
        CloseCreateProgram && CloseCreateProgram();
        FetchProgramByPagination && FetchProgramByPagination();
      } else {
        toast.error(Response?.data?.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSaveDisabled =
    isSubmitting ||
    !ProgramData.University ||
    !ProgramData.Department ||
    !ProgramData.ProgramType ||
    !ProgramData.ProgramName ||
    !ProgramData.ShortName;

  // Small consistent input wrapper
  const InputWrap = ({ children }) => (
    <div
      style={{
        background: "var(--bg)",
        borderRadius: 12,
        padding: 8,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {children}
    </div>
  );

  return (
    <section
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-center justify-center px-3"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div
        className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--soft-shadow)",
          maxHeight: "calc(100vh - 48px)",
        }}
      >
        {/* Sticky Header */}
        <header
          className="sticky top-0 z-20 px-5 py-4 border-b"
          style={{
            background: "linear-gradient(180deg,#fff,#fafafa)",
            borderColor: "rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--brand-ink)" }}
              >
                Update Program
              </h2>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Edit program details. Changes will reflect across listings.
              </p>
            </div>

            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-full p-2 text-sm"
              style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444" }}
              aria-label="Close update program"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Scrollable form body only */}
        <div
          className="overflow-y-auto px-5 py-4"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <form
            id="updateProgramForm"
            onSubmit={HandleUpdateProgram}
            className="space-y-4"
          >
            {/* University */}
            <div>
              <label
                className="block mb-1 text-xs font-medium"
                style={{ color: "var(--brand-ink)" }}
              >
                University <span className="text-red-500">*</span>
              </label>

              <InputWrap>
                <select
                  id="University"
                  name="University"
                  value={ProgramData.University}
                  onChange={HandleInputChange}
                  required
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  style={{
                    color: "var(--brand-ink)",
                  }}
                >
                  <option value="">Select</option>
                  {loadingUnis ? (
                    <option>Loading...</option>
                  ) : (
                    universities?.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u?.name}
                      </option>
                    ))
                  )}
                </select>
              </InputWrap>

              {formTouched && validationErrors.University && (
                <div className="mt-1 text-xs text-red-600">
                  {validationErrors.University}
                </div>
              )}
            </div>

            {/* Department */}
            <div>
              <label
                className="block mb-1 text-xs font-medium"
                style={{ color: "var(--brand-ink)" }}
              >
                Department <span className="text-red-500">*</span>
              </label>

              <InputWrap>
                <select
                  id="Department"
                  name="Department"
                  value={ProgramData.Department}
                  onChange={HandleInputChange}
                  required
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  style={{ color: "var(--brand-ink)" }}
                >
                  <option value="">Select</option>
                  {AllDepartmentLoading ? (
                    <option>Loading...</option>
                  ) : AllDepartment && AllDepartment.length > 0 ? (
                    AllDepartment.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No departments</option>
                  )}
                </select>
              </InputWrap>

              {formTouched && validationErrors.Department && (
                <div className="mt-1 text-xs text-red-600">
                  {validationErrors.Department}
                </div>
              )}
            </div>

            {/* Program Type */}
            <div>
              <label
                className="block mb-1 text-xs font-medium"
                style={{ color: "var(--brand-ink)" }}
              >
                Program Type <span className="text-red-500">*</span>
              </label>

              <InputWrap>
                <select
                  id="ProgramType"
                  name="ProgramType"
                  value={ProgramData.ProgramType}
                  onChange={HandleInputChange}
                  required
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  style={{ color: "var(--brand-ink)" }}
                >
                  <option value="">Select</option>
                  {LoadingProgramTypes ? (
                    <option>Loading...</option>
                  ) : (
                    ProgramTypes?.filter((p) => !p?.isDeleted).map((pt) => (
                      <option key={pt._id} value={pt._id}>
                        {pt.name}
                      </option>
                    ))
                  )}
                </select>
              </InputWrap>

              {formTouched && validationErrors.ProgramType && (
                <div className="mt-1 text-xs text-red-600">
                  {validationErrors.ProgramType}
                </div>
              )}
            </div>

            {/* Program Name */}
            <div>
              <label
                className="block mb-1 text-xs font-medium"
                style={{ color: "var(--brand-ink)" }}
              >
                Name <span className="text-red-500">*</span>
              </label>

              <input
                id="ProgramName"
                name="ProgramName"
                type="text"
                value={ProgramData.ProgramName}
                onChange={HandleInputChange}
                placeholder="Program full name"
                required
                className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                style={{
                  background: "var(--bg)",
                  borderRadius: 12,
                  padding: "8px",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              />

              {formTouched && validationErrors.ProgramName && (
                <div className="mt-1 text-xs text-red-600">
                  {validationErrors.ProgramName}
                </div>
              )}
            </div>

            {/* Short Name */}
            <div>
              <label
                className="block mb-1 text-xs font-medium"
                style={{ color: "var(--brand-ink)" }}
              >
                Short Name <span className="text-red-500">*</span>
              </label>

              <input
                id="ShortName"
                name="ShortName"
                type="text"
                value={ProgramData.ShortName}
                onChange={HandleInputChange}
                placeholder="Ex: BSC IT"
                required
                className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                style={{
                  background: "var(--bg)",
                  borderRadius: 12,
                  padding: "8px",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              />

              {formTouched && validationErrors.ShortName && (
                <div className="mt-1 text-xs text-red-600">
                  {validationErrors.ShortName}
                </div>
              )}
            </div>

            <div style={{ height: 12 }} />
          </form>
        </div>

        {/* Sticky Footer */}
        <footer
          className="sticky bottom-0 z-20 px-5 py-4 flex justify-end gap-3"
          style={{
            background: "var(--surface)",
            borderTop: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs rounded-full border"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--muted)" }}
          >
            Cancel
          </button>

          <button
            type="submit"
            form="updateProgramForm"
            disabled={isSaveDisabled}
            className="px-6 py-2 text-xs font-semibold rounded-full"
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
        </footer>
      </div>
    </section>
  );
};

export default UpdatePrograms;
