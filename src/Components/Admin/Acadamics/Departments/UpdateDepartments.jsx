import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useGetUniversity from "../../../../CustomHooks/UseGetUniversities";

/**
 * UpdateDepartments (refreshed)
 * - Sticky header & footer
 * - Only the form body scrolls
 * - Responsive
 * - Uses CSS vars from your theme (e.g., --surface, --brand-ink, --muted, --bg)
 *
 * NOTE: fallback preview path (local uploaded asset) — tooling will transform this into a usable URL:
 * "/mnt/data/2f284af6-deb0-4c5f-91d6-997cb24eaf68.png"
 */
const FALLBACK_PREVIEW = "/mnt/data/2f284af6-deb0-4c5f-91d6-997cb24eaf68.png";

const UpdateDepartments = ({
  CloseUpdateButton,
  FetchDepartmentByPagination,
  EditUpdateData,
}) => {
  const { GetUniversity, loading, error, universities } = useGetUniversity();

  useEffect(() => {
    GetUniversity();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [DepartmentData, setDepartmentData] = useState({
    University: EditUpdateData?.university?._id || "",
    Universityname: EditUpdateData?.university?.name || "",
    DepartmentName: EditUpdateData?.name || "",
  });

  useEffect(() => {
    setDepartmentData({
      University: EditUpdateData?.university?._id || "",
      Universityname: EditUpdateData?.university?.name || "",
      DepartmentName: EditUpdateData?.name || "",
    });
  }, [EditUpdateData]);

  // close safe wrapper
  const handleClose = useCallback(() => {
    if (!isSubmitting && typeof CloseUpdateButton === "function")
      CloseUpdateButton();
  }, [isSubmitting, CloseUpdateButton]);

  // Escape to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  const HandleInputData = (e) => {
    const { name, value } = e.target;
    setDepartmentData((prev) => ({ ...prev, [name]: value }));
  };

  const HandleDepartmentUpdate = async (e) => {
    e.preventDefault();
    if (!DepartmentData?.DepartmentName) {
      toast.error("Department name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdateDepartment`,
        {
          id: EditUpdateData?._id,
          name: DepartmentData?.DepartmentName,
        },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        CloseUpdateButton && CloseUpdateButton();
        FetchDepartmentByPagination && FetchDepartmentByPagination();
      } else {
        toast.error(Response?.data?.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // simple required indicators (keeps original semantics but simplified)
  const [showRequiredUniversity, setShowRequiredUniversity] = useState(false);
  const [showRequiredDept, setShowRequiredDept] = useState(false);

  useEffect(() => {
    setShowRequiredUniversity(!DepartmentData?.University);
    setShowRequiredDept(!DepartmentData?.DepartmentName);
  }, [DepartmentData?.University, DepartmentData?.DepartmentName]);

  const isSaveDisabled = isSubmitting || !DepartmentData?.DepartmentName;

  /* small input wrapper for consistent visuals */
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
        className="w-full max-w-lg mx-auto rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--soft-shadow)",
          maxHeight: "calc(100vh - 48px)",
        }}
      >
        {/* Header - sticky */}
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
                Update Department
              </h2>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Edit department name for the selected university
              </p>
            </div>

            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-full p-2 text-sm"
              style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444" }}
              aria-label="Close update department"
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
            id="updateDepartmentForm"
            onSubmit={HandleDepartmentUpdate}
            className="space-y-4"
          >
            {/* University select */}
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
                  onChange={HandleInputData}
                  value={DepartmentData?.University || ""}
                  required
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  style={{
                    color: "var(--brand-ink)",
                    outline: showRequiredUniversity
                      ? "2px solid rgba(239,68,68,0.25)"
                      : "none",
                  }}
                >
                  <option value="">Select</option>

                  {/* show full list — mark selected */}
                  {loading ? (
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
            </div>

            {/* Department name */}
            <div>
              <label
                className="block mb-1 text-xs font-medium"
                style={{ color: "var(--brand-ink)" }}
              >
                Faculty Name <span className="text-red-500">*</span>
              </label>

              <input
                id="DepartmentName"
                name="DepartmentName"
                type="text"
                value={DepartmentData?.DepartmentName || ""}
                onChange={HandleInputData}
                required
                placeholder="Ex: Information Technology"
                className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                style={{
                  color: "var(--brand-ink)",
                  outline: showRequiredDept
                    ? "2px solid rgba(239,68,68,0.25)"
                    : "none",

                  background: "var(--bg)",
                  borderRadius: 12,
                  padding: "8px",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              />
            </div>

            {/* small spacer */}
            <div style={{ height: 12 }} />
          </form>
        </div>

        {/* Footer - sticky */}
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
            form="updateDepartmentForm"
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

export default UpdateDepartments;
