import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Loader from "../../../Helper/Loader";

// Reusable badge row
const CriteriaRow = ({ ok, text }) => {
  return (
    <div className="flex items-center gap-2 text-sm transition-all">
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
          ok
            ? "bg-green-100 text-green-700"
            : "border border-gray-300 text-gray-400"
        }`}
      >
        {ok ? <FaCheckCircle size={12} /> : <FaTimesCircle size={12} />}
      </div>
      <p className={`${ok ? "text-green-700" : "text-gray-500"}`}>{text}</p>
    </div>
  );
};

const ChangePassword = () => {
  const [passwordToggle, setPasswordToggle] = useState(true);
  const ReduxUserData = useSelector((state) => state.user);

  const [ChangePassswordData, setChangePassswordData] = useState({
    OldPassword: "",
    NewPassword: "",
    ConfirmPassword: "",
  });

  const [upperCasePassword, setupperCasePassword] = useState(false);
  const [lowerCasePassword, setlowerCasePassword] = useState(false);
  const [countNumberPassword, setcountNumberPassword] = useState(false);
  const [specialCharPassword, setspecialCharPassword] = useState(false);
  const [minLengthPassword, setminLengthPassword] = useState(false);
  const [invalidError, setInvalidError] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  // Password validation
  useEffect(() => {
    const password = ChangePassswordData?.NewPassword || "";
    if (!password) {
      setupperCasePassword(false);
      setlowerCasePassword(false);
      setcountNumberPassword(false);
      setspecialCharPassword(false);
      setminLengthPassword(false);
      setInvalidError(false);
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isMinLength = password.length >= 8;

    setupperCasePassword(hasUpperCase);
    setlowerCasePassword(hasLowerCase);
    setcountNumberPassword(hasNumber);
    setspecialCharPassword(hasSpecialChar);
    setminLengthPassword(isMinLength);

    const isValid =
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      isMinLength;

    setInvalidError(!isValid);
  }, [ChangePassswordData.NewPassword]);

  const HandlePasswordToggle = () => {
    setPasswordToggle((s) => !s);
  };

  const HandleInputPasswordFormData = (e) => {
    const { name, value } = e.target;
    setChangePassswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Check if both passwords match & valid
  const IsValidAndEqual = () => {
    const { NewPassword, ConfirmPassword } = ChangePassswordData;
    if (!NewPassword || !ConfirmPassword) return false;
    if (NewPassword !== ConfirmPassword) return false;

    return (
      upperCasePassword &&
      lowerCasePassword &&
      countNumberPassword &&
      specialCharPassword &&
      minLengthPassword
    );
  };

  const HandleChangePassword = async (e) => {
    e.preventDefault();

    if (
      ChangePassswordData.NewPassword !== ChangePassswordData.ConfirmPassword
    ) {
      return toast.error("New Password and Confirm Password do not match.");
    }

    try {
      setSubmitting(true);
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/ChangePasswordfromprofile`,
        {
          userId: ReduxUserData?.id,
          oldPassword: ChangePassswordData?.OldPassword,
          newPassword: ChangePassswordData?.NewPassword,
          confirmPassword: ChangePassswordData?.ConfirmPassword,
        },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        Swal.fire({
          icon: "success",
          text: `${Response?.data?.message}`,
        });
        setChangePassswordData({
          OldPassword: "",
          NewPassword: "",
          ConfirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="px-4 pb-6 pt-3">
        {/* TOP HEADER */}
        <div
          className="w-full flex items-center justify-between px-6 py-4 rounded-xl mb-6 shadow-sm"
          style={{ background: "var(--surface)" }}
        >
          <h2 className="text-xl md:text-base font-semibold text-gray-800">
            Change Password
          </h2>
        </div>

        {/* Center Wrapper */}
        <div className="flex justify-center items-start overflow-y-auto h-[calc(100vh-130px)] min-h-[120px]">
          <form
            onSubmit={HandleChangePassword}
            className="w-full max-w-xl rounded-2xl p-6 md:p-8 shadow-md"
            style={{ background: "var(--surface)" }}
          >
            {/* OLD PASSWORD */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700">
                Old Password<span className="text-red-500">*</span>
              </label>

              <input
                required
                type="password"
                name="OldPassword"
                value={ChangePassswordData.OldPassword}
                onChange={HandleInputPasswordFormData}
                className="w-full mt-2 border px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* NEW PASSWORD */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700">
                New Password<span className="text-red-500">*</span>
              </label>

              <input
                required
                type="password"
                name="NewPassword"
                value={ChangePassswordData.NewPassword}
                onChange={HandleInputPasswordFormData}
                className={`w-full mt-2 border px-4 py-2 rounded-lg text-sm ${
                  invalidError
                    ? "border-red-400 focus:ring-red-200"
                    : "border-green-400 focus:ring-green-200"
                }`}
              />

              {/* Password Criteria */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CriteriaRow ok={upperCasePassword} text="Uppercase letter" />
                <CriteriaRow ok={lowerCasePassword} text="Lowercase letter" />
                <CriteriaRow
                  ok={countNumberPassword}
                  text="At least one number"
                />
                <CriteriaRow
                  ok={specialCharPassword}
                  text="Special character"
                />
                <CriteriaRow ok={minLengthPassword} text="Min 8 characters" />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password<span className="text-red-500">*</span>
              </label>

              <div className="relative mt-2">
                <input
                  type={passwordToggle ? "password" : "text"}
                  name="ConfirmPassword"
                  value={ChangePassswordData.ConfirmPassword}
                  onChange={HandleInputPasswordFormData}
                  className="w-full border px-4 py-2 rounded-lg text-sm"
                />

                <button
                  type="button"
                  onClick={HandlePasswordToggle}
                  className="absolute right-3 top-2 text-gray-500"
                >
                  {passwordToggle ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={!IsValidAndEqual() || submitting}
              className={`w-full py-2 rounded-lg font-semibold transition-all ${
                IsValidAndEqual() && !submitting
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {submitting ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* LOADING OVERLAY */}
        {submitting && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Loader />
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ChangePassword;
