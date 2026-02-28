import React, { useEffect, useCallback, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const FALLBACK_PREVIEW = "/mnt/data/2f284af6-deb0-4c5f-91d6-997cb24eaf68.png";

const PaymentDetails = ({
  EditUniversityData,
  HandleCloseUpdatePaymentButton,
  FetchUniversitiesByPagination,
}) => {
  // safe close wrapper
  const HandleCloseUpdateButton = useCallback(() => {
    if (typeof HandleCloseUpdatePaymentButton === "function") {
      HandleCloseUpdatePaymentButton();
    }
  }, [HandleCloseUpdatePaymentButton]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [UniversityDataform, setUniversityDataform] = useState({
    id: EditUniversityData?._id,
    AccountNumber: EditUniversityData?.PaymentDetailsModel?.AccountNumber || "",
    Name: EditUniversityData?.PaymentDetailsModel?.Name || "",
    BankName: EditUniversityData?.PaymentDetailsModel?.BankName || "",
    IFSC: EditUniversityData?.PaymentDetailsModel?.IFSC || "",
    Branch: EditUniversityData?.PaymentDetailsModel?.Branch || "",
  });

  // keep form synced when EditUniversityData changes
  useEffect(() => {
    setUniversityDataform({
      id: EditUniversityData?._id,
      AccountNumber:
        EditUniversityData?.PaymentDetailsModel?.AccountNumber || "",
      Name: EditUniversityData?.PaymentDetailsModel?.Name || "",
      BankName: EditUniversityData?.PaymentDetailsModel?.BankName || "",
      IFSC: EditUniversityData?.PaymentDetailsModel?.IFSC || "",
      Branch: EditUniversityData?.PaymentDetailsModel?.Branch || "",
    });
  }, [EditUniversityData]);

  // Esc to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") HandleCloseUpdateButton();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [HandleCloseUpdateButton]);

  const HandleOnchangeInputItems = (e) => {
    const { name, value } = e.target;
    setUniversityDataform((prev) => ({ ...prev, [name]: value }));
  };

  const HandleUpdateUniversityForm = async (e) => {
    e.preventDefault();

    const { AccountNumber, BankName, IFSC, Branch, Name, id } =
      UniversityDataform;
    if (!Name || !BankName || !AccountNumber || !IFSC || !Branch) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/register-payment-details`,
        {
          AccountNumber,
          BankName,
          IFSC,
          Branch,
          Name,
          UniversityId: id,
        },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message || "Payment details updated.");
        HandleCloseUpdateButton();
        if (typeof FetchUniversitiesByPagination === "function")
          FetchUniversitiesByPagination();
      } else {
        toast.error(
          Response?.data?.message || "Failed to update payment details."
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSaveDisabled =
    isSubmitting ||
    !UniversityDataform.Name ||
    !UniversityDataform.BankName ||
    !UniversityDataform.AccountNumber ||
    !UniversityDataform.IFSC ||
    !UniversityDataform.Branch;

  /* Small consistent input wrapper to match portal UI */
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
      aria-labelledby="payment-details-title"
      className="fixed inset-0 z-40 flex items-center justify-center px-3 sm:px-0"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div
        className="w-full max-w-xl mx-2 sm:mx-auto rounded-[var(--card-radius)] overflow-hidden"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--soft-shadow)",
          maxHeight: "calc(100vh - 48px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Sticky Header */}
        <header
          id="payment-details-title"
          className="sticky top-0 z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.98))",
            borderBottom: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <div className="px-4 py-3 sm:px-5 sm:py-4 flex items-start justify-between gap-4">
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--brand-ink)" }}
              >
                Add / Update Payment Details
              </h2>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Configure bank details for{" "}
                {EditUniversityData?.name || "the university"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={HandleCloseUpdateButton}
                disabled={isSubmitting}
                aria-label="Close payment modal"
                className="inline-flex items-center justify-center rounded-full p-2"
                style={{
                  background: "rgba(239,68,68,0.06)",
                  color: "var(--brand-ink)",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable form body only */}
        <div
          className="overflow-y-auto px-4 sm:px-5"
          style={{
            maxHeight: "calc(100vh - 200px)", // leaves room for header + footer
          }}
        >
          <form onSubmit={HandleUpdateUniversityForm} className="p-2 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  Account Holder <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="Name"
                  name="Name"
                  required
                  value={UniversityDataform?.Name}
                  onChange={HandleOnchangeInputItems}
                  className="w-full text-sm bg-transparent px-2 py-2 focus:outline-none"
                  placeholder="Account holder name"
                  s
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
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="BankName"
                  name="BankName"
                  required
                  value={UniversityDataform?.BankName}
                  onChange={HandleOnchangeInputItems}
                  className="w-full text-sm bg-transparent px-2 py-2 focus:outline-none"
                  placeholder="Bank name"
                  style={{
                    background: "var(--bg)",
                    borderRadius: 12,
                    padding: "8px",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="AccountNumber"
                  name="AccountNumber"
                  required
                  value={UniversityDataform?.AccountNumber}
                  onChange={HandleOnchangeInputItems}
                  className="w-full text-sm bg-transparent px-2 py-2 focus:outline-none"
                  placeholder="Enter account number"
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
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  IFSC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="IFSC"
                  name="IFSC"
                  required
                  value={UniversityDataform?.IFSC}
                  onChange={HandleOnchangeInputItems}
                  className="w-full text-sm bg-transparent px-2 py-2 focus:outline-none"
                  placeholder="IFSC code"
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
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  Branch <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="Branch"
                  name="Branch"
                  required
                  value={UniversityDataform?.Branch}
                  onChange={HandleOnchangeInputItems}
                  className="w-full text-sm bg-transparent px-2 py-2 focus:outline-none"
                  placeholder="Branch name / city"
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

            {/* Extra spacer so last input isn't hidden under footer on small screens */}
            <div style={{ height: 16 }} />
          </form>
        </div>

        {/* Sticky Footer */}
        <footer
          className="sticky bottom-0 z-10"
          style={{
            borderTop: "1px solid rgba(0,0,0,0.04)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.98))",
          }}
        >
          <div className="px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={HandleCloseUpdateButton}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs rounded-full border"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--muted)" }}
            >
              Cancel
            </button>

            <button
              type="button"
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
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default PaymentDetails;
