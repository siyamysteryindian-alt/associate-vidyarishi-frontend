import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

/**
 * ForgetPassword (refactored UI)
 *
 * - Keeps original API calls and logic.
 * - Visual / accessibility improvements.
 * - Uses your CSS variables (var(--accent-purple), var(--accent-mint), var(--surface), var(--brand-ink), etc.)
 */

const ForgetPassword = () => {
  const NavigateTo = useNavigate();

  const [inputEmailDisabled, setInputEmailDisabled] = useState(false);
  const [sendOtpButtonDisabled, setSendOtpButtonDisabled] = useState(false);
  const [inputOtpDisabled, setInputOtpDisabled] = useState(false);

  const [newPasswordOpen, setNewPasswordOpen] = useState(false);

  const [email, setEmail] = useState("");

  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [otp, setOtp] = useState("");

  const [newPasswordState, setNewPasswordState] = useState({
    NewPassword: "",
    ConfirmPassword: "",
  });

  // --- Handlers (kept logic same, only cleaned up)
  const handleInputPassword = (e) => {
    const { name, value } = e.target;
    setNewPasswordState((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    const { NewPassword, ConfirmPassword } = newPasswordState;
    if (!NewPassword || !ConfirmPassword) {
      toast.error("Password is Required");
      return;
    }
    if (NewPassword !== ConfirmPassword) {
      toast.error("Password Not Match 🤐");
      return;
    }

    try {
      const Response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/enter-new-password-forgetpassword-otp`,
        {
          newpassword: NewPassword,
          conformpassword: ConfirmPassword,
        },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        Swal.fire({
          icon: "success",
          title: `${Response?.data?.message} Now You Can Log Using NEW Password`,
        });
        NavigateTo("/");
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter email first");
      return;
    }
    try {
      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/forget-sendotp-resendpassword`,
        { email },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        setSendOtpButtonDisabled(true);
        setIsTimerRunning(true);
        setSecondsLeft(60);
        setInputEmailDisabled(true);
      } else {
        toast.error(Response?.data?.message);
        setInputEmailDisabled(false);
        setSendOtpButtonDisabled(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const handleOtpChange = (e) => setOtp(e.target.value);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }
    try {
      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/verify-forgetpassword-otp`,
        { input: otp },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        setInputOtpDisabled(true);
        setNewPasswordOpen(true);
        setIsTimerRunning(false);
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setIsTimerRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isTimerRunning]);

  const handleResendOTP = async () => {
    if (!email) return toast.error("Email missing");
    try {
      setInputEmailDisabled(true);
      setSendOtpButtonDisabled(true);
      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ResendOtp`,
        { email },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        setSecondsLeft(60);
        setIsTimerRunning(true);
        toast.success(Response?.data?.message);
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: "var(--color-bg)" }}
    >
      <div
        className="w-full max-w-3xl"
        style={{
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial",
        }}
      >
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{
            background: "var(--surface)",
            boxShadow: "var(--soft-shadow)",
            borderRadius: "var(--card-radius)",
          }}
        >
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <button
              aria-label="back"
              onClick={() => NavigateTo("/")}
              className="p-2 rounded-full"
              style={{
                background: "rgba(34,34,34,0.04)",
                color: "var(--brand-ink)",
              }}
            >
              <MdOutlineKeyboardBackspace size={22} />
            </button>

            <div className="flex-1">
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--brand-ink)" }}
              >
                Forgot your password?
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                Enter your registered email and we’ll send a one-time code to
                reset your password.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column: Email & OTP */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium mb-2"
                style={{ color: "var(--brand-ink)" }}
              >
                Registered Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={handleEmailChange}
                disabled={inputEmailDisabled}
                className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none transition placeholder:opacity-60`}
                style={{
                  background: "var(--surface)",
                  border:
                    inputEmailDisabled && !email
                      ? "1.6px solid rgba(239,68,68,0.25)"
                      : "1px solid rgba(0,0,0,0.08)",
                  color: "var(--brand-ink)",
                }}
                aria-disabled={inputEmailDisabled}
              />

              {!inputEmailDisabled ? (
                <div className="mt-4">
                  <button
                    onClick={handleSendOtp}
                    disabled={sendOtpButtonDisabled}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow"
                    style={{
                      background: "var(--accent-purple)",
                      color: "#fff",
                      boxShadow: "var(--soft-shadow-2)",
                      opacity: sendOtpButtonDisabled ? 0.6 : 1,
                      cursor: sendOtpButtonDisabled ? "not-allowed" : "pointer",
                    }}
                  >
                    Send OTP
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-3">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: "rgba(162,142,249,0.12)",
                      color: "var(--brand-ink)",
                    }}
                  >
                    OTP Sent
                  </div>

                  {isTimerRunning ? (
                    <div
                      className="text-xs text-muted"
                      style={{ color: "var(--muted)" }}
                    >
                      Resend in{" "}
                      <span className="font-medium">
                        {formatTime(secondsLeft)}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      className="text-xs font-medium underline"
                      style={{ color: "var(--accent-purple)" }}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}

              {/* OTP input & verify */}
              {inputEmailDisabled && (
                <div className="mt-6">
                  <label
                    htmlFor="otp"
                    className="text-xs font-medium mb-2 block"
                    style={{ color: "var(--brand-ink)" }}
                  >
                    Enter OTP
                  </label>

                  <div className="flex gap-2 items-center">
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="One time code"
                      value={otp}
                      onChange={handleOtpChange}
                      disabled={inputOtpDisabled}
                      className="flex-1 px-3 py-2 rounded-lg text-sm border"
                      style={{
                        border: "1px solid rgba(0,0,0,0.08)",
                        background: "var(--surface)",
                      }}
                    />
                    <button
                      onClick={handleVerifyOtp}
                      disabled={inputOtpDisabled}
                      className="px-4 py-2 rounded-lg text-sm font-semibold"
                      style={{
                        background: "var(--accent-mint)",
                        color: "var(--brand-ink)",
                        boxShadow: inputOtpDisabled
                          ? "none"
                          : "var(--soft-shadow-2)",
                        opacity: inputOtpDisabled ? 0.6 : 1,
                      }}
                    >
                      Verify
                    </button>
                  </div>

                  {inputOtpDisabled && (
                    <p
                      className="mt-3 text-sm font-medium"
                      style={{ color: "var(--brand-ink)" }}
                    >
                      OTP verified — you can now set a new password.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right column: Preview / help & change password */}
            <div>
              <div
                className="rounded-lg p-4 h-full flex flex-col justify-between"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(162,142,249,0.04), rgba(164,245,166,0.02))",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <div>
                  <h3
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--brand-ink)" }}
                  >
                    Why OTP verification?
                  </h3>
                  <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
                    The OTP ensures it’s really you — it prevents unauthorized
                    password resets.
                  </p>

                  <ul
                    className="text-xs list-disc pl-4 space-y-2"
                    style={{ color: "var(--muted)" }}
                  >
                    <li>Secure: single-use code</li>
                    <li>Fast: delivered to email</li>
                    <li>Valid for a short time only</li>
                  </ul>
                </div>

                {/* Change password block (visible when verified) */}
                {newPasswordOpen ? (
                  <form onSubmit={handleNewPasswordSubmit} className="mt-4">
                    <label
                      className="text-xs font-medium"
                      style={{ color: "var(--brand-ink)" }}
                    >
                      New password
                    </label>
                    <input
                      name="NewPassword"
                      value={newPasswordState.NewPassword}
                      onChange={handleInputPassword}
                      type="password"
                      className="w-full px-3 py-2 rounded-lg mt-2 mb-3 text-sm border"
                      style={{
                        border:
                          !newPasswordState.NewPassword &&
                          newPasswordState.NewPassword !== ""
                            ? "1.4px solid rgba(239,68,68,0.25)"
                            : "1px solid rgba(0,0,0,0.08)",
                      }}
                      required
                    />

                    <label
                      className="text-xs font-medium"
                      style={{ color: "var(--brand-ink)" }}
                    >
                      Confirm password
                    </label>
                    <input
                      name="ConfirmPassword"
                      value={newPasswordState.ConfirmPassword}
                      onChange={handleInputPassword}
                      type="password"
                      className="w-full px-3 py-2 rounded-lg mt-2 mb-3 text-sm border"
                      style={{
                        border:
                          !newPasswordState.ConfirmPassword &&
                          newPasswordState.ConfirmPassword !== ""
                            ? "1.4px solid rgba(239,68,68,0.25)"
                            : "1px solid rgba(0,0,0,0.08)",
                      }}
                      required
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-full text-sm font-semibold"
                        style={{
                          background: "var(--accent-mint)",
                          color: "var(--brand-ink)",
                          boxShadow: "var(--soft-shadow-2)",
                        }}
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-4">
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      After verifying the OTP you will be able to set a new
                      password.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
