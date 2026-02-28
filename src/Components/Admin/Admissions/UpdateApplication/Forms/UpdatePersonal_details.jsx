import React, { useContext, useEffect, useState } from "react";
import { UpdateStepperContext } from "../UpdateStepperContext";
import PincodeDecode from "../../../../../Helper/PincodeDecode";

const UpdatePersonal_details = () => {
  const { UpdatePersonalData, setUpdatePersonalData } =
    useContext(UpdateStepperContext);

  const [PincodeData, setPincodeData] = useState({});

  const HandleChange = (e) => {
    const { name, value } = e.target;

    const formattedValue =
      name === "Phone" || (name === "AlternatePhone" && value !== "")
        ? `+91${value}`
        : value;

    setUpdatePersonalData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
    console.log(UpdatePersonalData);
  };

  // Pincode change + auto fill
  const HandlePincodeChange = async (e) => {
    const { value } = e.target;
    const pincode = value || UpdatePersonalData?.Pincode;

    setUpdatePersonalData((prev) => ({
      ...prev,
      Pincode: pincode,
    }));

    if (!pincode || pincode.length !== 6) return;

    try {
      const response = await PincodeDecode(pincode);
      setPincodeData(response);

      if (response[0]?.Status === "Success") {
        const district = response[0]?.PostOffice?.[0]?.District || "";
        const state = response[0]?.PostOffice?.[0]?.State || "";

        setUpdatePersonalData((prev) => ({
          ...prev,
          Pincode: pincode,
          District: district,
          State: state,
        }));
      }
    } catch (err) {
      console.error("Pincode decode error:", err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (UpdatePersonalData?.Pincode) {
        HandlePincodeChange({ target: { value: UpdatePersonalData.Pincode } });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [UpdatePersonalData?.Pincode]);

  useEffect(() => {
    console.log("PincodeData:", PincodeData[0]);
  }, [PincodeData]);

  useEffect(() => {
    console.log("UpdatePersonalData:", UpdatePersonalData);
  }, [UpdatePersonalData]);

  // ---- Validation helpers (keep same logic) ----
  const isPhoneValid = (phone) => {
    return /^\+91\s?\d{5}\s?\d{5}$/.test(phone);
  };

  const isAlternatePhoneValid = (phone) => {
    return /^\+91\s?\d{5}\s?\d{5}$/.test(phone);
  };

  const isEmailValid = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const isAlternateEmailValid = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const isPincodeValid = (pincode) => /^[1-9][0-9]{5}$/.test(pincode);

  // ---- Shared UI classes (same vibe as Personal_details) ----
  const fieldWrapperClass = "flex flex-col gap-1.5";
  const labelClass =
    "block text-[11px] font-medium text-slate-600 dark:text-slate-300";
  const inputBaseClass =
    "block w-full rounded-lg border border-slate-200 dark:border-slate-700 " +
    "bg-slate-50/70 dark:bg-slate-900/60 px-3 py-2.5 text-xs md:text-sm " +
    "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 " +
    "dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 " +
    "focus:ring-pink-500/80 focus:border-pink-500 transition-all duration-200 " +
    "shadow-sm focus:shadow-md";
  const textAreaClass =
    "block w-full rounded-lg border border-slate-200 dark:border-slate-700 " +
    "bg-slate-50/70 dark:bg-slate-900/60 px-3 py-2.5 text-xs md:text-sm " +
    "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 " +
    "dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 " +
    "focus:ring-pink-500/80 focus:border-pink-500 transition-all duration-200 " +
    "shadow-sm focus:shadow-md resize-none";
  const selectBaseClass =
    "block w-full rounded-lg border border-slate-200 dark:border-slate-700 " +
    "bg-slate-50/70 dark:bg-slate-900/60 px-3 py-2.5 text-xs md:text-sm " +
    "text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 " +
    "focus:ring-pink-500/80 focus:border-pink-500 transition-all duration-200 " +
    "shadow-sm focus:shadow-md";
  const errorTextClass = "mt-1 text-[11px] text-red-500 leading-snug";

  return (
    <div className="w-full mx-2 flex-1">
      <div className="border border-slate-200 dark:border-slate-700 rounded-2xl bg-white/80 dark:bg-slate-900/70 shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-50">
              Update Contact Details
            </h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Update student&apos;s primary communication information
            </p>
          </div>
          <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300">
            Step 2 · Contact
          </span>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Row 1: Email / Alt Email / Phone / Alt Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Email */}
            <div className={fieldWrapperClass}>
              <label htmlFor="Email" className={labelClass}>
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                onChange={HandleChange}
                name="Email"
                id="Email"
                value={UpdatePersonalData?.Email || ""}
                className={inputBaseClass}
                placeholder="example@domain.com"
                maxLength={254}
                aria-label="Enter your email address"
                aria-required="true"
                required
              />
              {UpdatePersonalData?.Email?.length > 1 &&
                !isEmailValid(UpdatePersonalData?.Email) && (
                  <span className={errorTextClass}>
                    Please enter a valid email address.
                  </span>
                )}
            </div>

            {/* Alternate Email */}
            <div className={fieldWrapperClass}>
              <label htmlFor="AlternateEmail" className={labelClass}>
                Alternate Email
              </label>
              <input
                type="email"
                onChange={HandleChange}
                name="AlternateEmail"
                id="AlternateEmail"
                value={UpdatePersonalData?.AlternateEmail || ""}
                className={inputBaseClass}
                placeholder="example@domain.com"
                maxLength={254}
                aria-label="Enter alternate email address"
              />
              {UpdatePersonalData?.AlternateEmail?.length > 1 &&
                !isAlternateEmailValid(UpdatePersonalData?.AlternateEmail) && (
                  <span className={errorTextClass}>
                    Please enter a valid alternate email address.
                  </span>
                )}
            </div>

            {/* Phone */}
            <div className={fieldWrapperClass}>
              <label htmlFor="Phone" className={labelClass}>
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm px-2 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                  +91
                </span>
                <input
                  type="tel"
                  value={
                    UpdatePersonalData?.Phone?.replace(/^\+91\s?/, "") || ""
                  }
                  onChange={HandleChange}
                  name="Phone"
                  id="Phone"
                  className={inputBaseClass}
                  placeholder="XXXXXXXXXX"
                  maxLength={10}
                  aria-label="Enter your phone number"
                  aria-required="true"
                  required
                />
              </div>
              {UpdatePersonalData?.Phone &&
                !isPhoneValid(UpdatePersonalData?.Phone) && (
                  <span className={errorTextClass}>
                    Please enter a valid phone number.
                  </span>
                )}
            </div>

            {/* Alternate Phone */}
            <div className={fieldWrapperClass}>
              <label htmlFor="AlternatePhone" className={labelClass}>
                Alternate Phone
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm px-2 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                  +91
                </span>
                <input
                  type="tel"
                  onChange={HandleChange}
                  name="AlternatePhone"
                  value={
                    UpdatePersonalData?.AlternatePhone?.replace(
                      /^\+91\s?/,
                      ""
                    ) || ""
                  }
                  id="AlternatePhone"
                  className={inputBaseClass}
                  placeholder="Optional"
                  maxLength={10}
                  aria-label="Enter alternate phone number"
                />
              </div>
              {UpdatePersonalData?.AlternatePhone &&
                !isAlternatePhoneValid(UpdatePersonalData?.AlternatePhone) && (
                  <span className={errorTextClass}>
                    Please enter a valid phone number.
                  </span>
                )}
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 gap-3">
            <div className={fieldWrapperClass}>
              <label htmlFor="Address" className={labelClass}>
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="Address"
                id="Address"
                onChange={HandleChange}
                rows={3}
                value={UpdatePersonalData?.Address || ""}
                placeholder="Ex: House No 102, Vivina Nadco, Andheri - West"
                className={textAreaClass}
              />
            </div>
          </div>

          {/* Pincode + City + District + State */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Pincode */}
            <div className={fieldWrapperClass}>
              <label htmlFor="Pincode" className={labelClass}>
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                onChange={HandlePincodeChange}
                name="Pincode"
                id="Pincode"
                value={UpdatePersonalData?.Pincode || ""}
                className={inputBaseClass}
                placeholder="6-digit pincode"
                maxLength={6}
                aria-label="Enter your pincode"
                aria-required="true"
                required
              />
              {UpdatePersonalData?.Pincode &&
                !isPincodeValid(UpdatePersonalData?.Pincode) && (
                  <span className={errorTextClass}>
                    Please enter a valid 6-digit pincode.
                  </span>
                )}
            </div>

            {/* City */}
            <div className={fieldWrapperClass}>
              <label htmlFor="City" className={labelClass}>
                City <span className="text-red-500">*</span>
              </label>
              <select
                onChange={HandleChange}
                name="City"
                id="City"
                value={UpdatePersonalData?.City || ""}
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {PincodeData[0]?.Status === "Success" &&
                  PincodeData[0]?.PostOffice?.map((postOffice, index) => (
                    <option key={index} value={postOffice?.Name}>
                      {postOffice?.Name}
                    </option>
                  ))}
              </select>
            </div>

            {/* District */}
            <div className={fieldWrapperClass}>
              <label htmlFor="District" className={labelClass}>
                District <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={UpdatePersonalData?.District || ""}
                onChange={HandleChange}
                name="District"
                id="District"
                className={inputBaseClass}
                placeholder="District"
              />
            </div>

            {/* State (disabled) */}
            <div className={fieldWrapperClass}>
              <label htmlFor="State" className={labelClass}>
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled
                value={UpdatePersonalData?.State || ""}
                onChange={HandleChange}
                name="State"
                id="State"
                className={
                  inputBaseClass +
                  " opacity-80 cursor-not-allowed bg-slate-100/80 dark:bg-slate-800/70"
                }
                placeholder="Auto-filled from pincode"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePersonal_details;
