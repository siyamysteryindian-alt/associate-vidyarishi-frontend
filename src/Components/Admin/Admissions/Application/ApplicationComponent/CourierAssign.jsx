import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import Loader from "../../../../../Helper/Loader";
import UseGetCenterSubCenter from "../../../../../CustomHooks/UseGetCenterSubCenter";
import uploadFile from "../../../../../Helper/UploadFile";

const CourierAssign = ({
  setRefreshApplications,
  HandleCourierClose,
  StudentDetails,
}) => {
  const [CourierData, setCourierData] = useState({});
  const [CourieerCompaniesLoading, setCourieerCompaniesLoading] =
    useState(false);
  const [CourieerCompaniesListData, setCourieerCompaniesListData] = useState(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { GetCenter, CenterError, CenterLoading, Center } =
    UseGetCenterSubCenter();

  const HandleOnChangeInput = (e) => {
    const { name, value } = e.target;
    setCourierData((prev) => ({ ...prev, [name]: value }));
  };

  const FetchCourieerCompanies = async () => {
    try {
      setCourieerCompaniesLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetCourierCompanies`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setCourieerCompaniesListData(response.data.data || []);
      } else {
        setCourieerCompaniesListData([]);
        toast.error(
          response?.data?.message || "Failed to fetch courier companies."
        );
      }
    } catch (error) {
      setCourieerCompaniesListData([]);
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while fetching companies."
      );
      console.error("FetchCourieerCompanies error:", error);
    } finally {
      setCourieerCompaniesLoading(false);
    }
  };

  const HandleUploadPhoto = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const MAX_DOCUMENT_SIZE = 2 * 1024 * 1024; // optional safety, 2MB allowed — change as needed
      if (file.size > MAX_DOCUMENT_SIZE) {
        toast.error("File size exceeds the 2 MB limit.");
        return;
      }
      const response = await uploadFile(file);
      if (response?.url) {
        setCourierData((prev) => ({ ...prev, CourierLrSlip: response.url }));
        toast.success("LR slip uploaded");
      } else {
        toast.error("Upload failed, try again.");
      }
    } catch (err) {
      console.error("HandleUploadPhoto error:", err);
      toast.error("Failed to upload file. Try again.");
    }
  };

  useEffect(() => {
    // refresh data when modal opens for a particular student
    FetchCourieerCompanies();
    GetCenter?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [StudentDetails?._id]);

  const validateForm = () => {
    // minimal required validations
    const required = [
      "CourierCompanyName",
      "CourierDate",
      "CourierCharges",
      "CourierPickupLocation",
      "CourierDropLocation",
      "DocketNo",
      "CourierSentTo",
    ];
    for (const k of required) {
      if (!CourierData?.[k]) {
        toast.error("Please fill all required fields.");
        return false;
      }
    }
    // LR slip optional - if required in your backend uncomment below
    // if (!CourierData?.CourierLrSlip) { toast.error("Please upload LR slip."); return false; }
    return true;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/CreateCourier`,
        {
          CourierName: CourierData?.CourierCompanyName,
          Student: StudentDetails?._id,
          SentTo: CourierData?.CourierSentTo,
          DropLocation: CourierData?.CourierDropLocation,
          PickupLocation: CourierData?.CourierPickupLocation,
          CourierCharges: CourierData?.CourierCharges,
          DateTime: CourierData?.CourierDate,
          DocketNo: CourierData?.DocketNo,
          LrSlip: CourierData?.CourierLrSlip,
        },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        toast.success(Response.data.message || "Courier created");
        setRefreshApplications && setRefreshApplications(true);
        HandleCourierClose && HandleCourierClose();
      } else {
        toast.error(Response?.data?.message || "Failed to create courier");
      }
    } catch (error) {
      console.error("CreateCourier error:", error);
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card: max height so inner body can scroll */}
      <div
        className="relative w-[94vw] max-w-xl rounded-2xl shadow-2xl border"
        style={{
          background: "var(--surface)",
          borderColor: "rgba(16,24,40,0.04)",
          boxShadow: "var(--soft-shadow)",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
      >
        {/* Header (sticky) */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{
            position: "sticky",
            top: 0,
            background: "var(--surface)",
            zIndex: 30,
            borderColor: "rgba(16,24,40,0.03)",
          }}
        >
          <div>
            <div className="text-sm font-semibold tracking-wide text-slate-800">
              Assign Courier
            </div>
            {StudentDetails?.applicationNumber && (
              <div className="text-[11px] text-slate-500 mt-0.5">
                {StudentDetails?.fullName} •{" "}
                <span className="font-mono">
                  {StudentDetails?.applicationNumber}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => HandleCourierClose && HandleCourierClose()}
              disabled={isSubmitting}
              aria-label="Close"
              className="rounded-full p-1 hover:bg-red-50 transition"
              style={{ color: "#ef4444" }}
            >
              <IoClose size={22} />
            </button>
          </div>
        </div>

        {/* Body (scrollable) */}
        <div
          className="px-5 py-4 overflow-y-auto"
          style={{
            maxHeight:
              "calc(90vh - 128px)" /* adjust to leave room for header/footer */,
          }}
        >
          <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
            {/* Courier Company */}
            <div>
              <label className="block mb-1 text-[11px] font-semibold text-slate-700">
                Select Courier Company
              </label>

              <select
                name="CourierCompanyName"
                onChange={HandleOnChangeInput}
                className="w-full rounded-lg px-2.5 py-2 text-xs border"
                value={CourierData?.CourierCompanyName || ""}
                required
              >
                <option value="">Select</option>
                {CourieerCompaniesLoading ? (
                  <option disabled>Loading companies...</option>
                ) : CourieerCompaniesListData?.filter((c) => !c?.isDeleted)
                    ?.length ? (
                  CourieerCompaniesListData.filter((c) => !c?.isDeleted).map(
                    (data) => (
                      <option key={data._id} value={data._id}>
                        {data.CourierName}
                      </option>
                    )
                  )
                ) : (
                  <option disabled>Not Found</option>
                )}
              </select>
            </div>

            {/* Date & Charges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-[11px] font-semibold text-slate-700">
                  Courier Date
                </label>
                <input
                  type="date"
                  name="CourierDate"
                  onChange={HandleOnChangeInput}
                  value={CourierData?.CourierDate || ""}
                  className="w-full rounded-lg px-2.5 py-2 text-xs border"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-[11px] font-semibold text-slate-700">
                  Courier Charges
                </label>
                <input
                  type="number"
                  name="CourierCharges"
                  onChange={HandleOnChangeInput}
                  value={CourierData?.CourierCharges || ""}
                  placeholder="Courier Charges"
                  className="w-full rounded-lg px-2.5 py-2 text-xs border"
                  required
                />
              </div>
            </div>

            {/* Pickup / Drop */}
            <div>
              <label className="block mb-1 text-[11px] font-semibold text-slate-700">
                Courier Pickup Location
              </label>
              <input
                type="text"
                name="CourierPickupLocation"
                onChange={HandleOnChangeInput}
                value={CourierData?.CourierPickupLocation || ""}
                placeholder="Pickup Location"
                className="w-full rounded-lg px-2.5 py-2 text-xs border"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-[11px] font-semibold text-slate-700">
                Courier Drop Location
              </label>
              <input
                type="text"
                name="CourierDropLocation"
                onChange={HandleOnChangeInput}
                value={CourierData?.CourierDropLocation || ""}
                placeholder="Drop Location"
                className="w-full rounded-lg px-2.5 py-2 text-xs border"
                required
              />
            </div>

            {/* Docket & Sent To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-[11px] font-semibold text-slate-700">
                  Docket No
                </label>
                <input
                  type="text"
                  name="DocketNo"
                  onChange={HandleOnChangeInput}
                  value={CourierData?.DocketNo || ""}
                  placeholder="Docket No"
                  className="w-full rounded-lg px-2.5 py-2 text-xs border"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-[11px] font-semibold text-slate-700">
                  Courier Sent To
                </label>
                <select
                  name="CourierSentTo"
                  onChange={HandleOnChangeInput}
                  value={CourierData?.CourierSentTo || ""}
                  className="w-full rounded-lg px-2.5 py-2 text-xs border"
                  required
                >
                  <option value="">Select</option>
                  {CenterLoading ? (
                    <option disabled>Loading centers...</option>
                  ) : Center?.filter(
                      (c) =>
                        !c?.isDeleted && c._id === StudentDetails?.center?._id
                    )?.length ? (
                    Center.filter(
                      (c) =>
                        !c?.isDeleted && c._id === StudentDetails?.center?._id
                    ).map((data) => (
                      <option key={data._id} value={data._id}>
                        {data.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Not Found</option>
                  )}
                </select>
              </div>
            </div>

            {/* LR Slip */}
            <div>
              <label className="block mb-1 text-[11px] font-semibold text-slate-700">
                LR Slip (optional)
              </label>
              <input
                type="file"
                name="CourierLrSlip"
                onChange={HandleUploadPhoto}
                className="w-full rounded-lg px-2.5 py-2 text-xs border"
                accept="image/*,application/pdf"
              />
              {CourierData?.CourierLrSlip && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="text-slate-600 truncate break-all">
                    {CourierData.CourierLrSlip}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCourierData((p) => ({
                        ...p,
                        CourierLrSlip: undefined,
                      }))
                    }
                    className="p-1 rounded hover:bg-slate-100"
                    aria-label="remove"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer (sticky) */}
        <div
          className="flex items-center justify-end gap-3 px-5 py-3 border-t"
          style={{
            position: "sticky",
            bottom: 0,
            background: "var(--surface)",
            zIndex: 30,
            borderColor: "rgba(16,24,40,0.03)",
          }}
        >
          <button
            type="button"
            onClick={() => HandleCourierClose && HandleCourierClose()}
            disabled={isSubmitting}
            className="px-4 py-1.5 rounded-lg border text-[11px] font-semibold"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--muted)" }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmitForm}
            disabled={isSubmitting}
            className="px-6 py-1.5 rounded-lg text-[11px] font-bold"
            style={{
              background: isSubmitting
                ? "rgba(164,245,166,0.35)"
                : "var(--accent-mint)",
              color: "var(--brand-ink)",
              boxShadow: isSubmitting ? "none" : "var(--soft-shadow)",
            }}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourierAssign;
