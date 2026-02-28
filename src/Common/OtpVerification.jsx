// OtpVerification.jsx
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import UseGetLoggedUser from "../CustomHooks/UseGetLoggedUser";

/**
 * Improved OTP verification UI:
 * - Auto-focus & keyboard navigation (Backspace moves back)
 * - Paste support (paste full 6-digit code)
 * - Clear visual focus + accessible labels
 * - Uses CSS variables from your globals (var(--color-purple), var(--accent-mint), var(--brand-ink), etc.)
 * - Resend button disabled while timer running
 * - Friendly messages via toast
 */

const OTP_FIELDS = 6;
const INITIAL_TIMER = 60;

const OtpVerification = () => {
  const { GetLoginUserDetails } = UseGetLoggedUser();
  const location = useLocation();
  const nav = useNavigate();

  const userData = location.state || {};
  const inputRefs = useRef([]);
  const [values, setValues] = useState(Array(OTP_FIELDS).fill(""));
  const [timer, setTimer] = useState(INITIAL_TIMER);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  // Warn user when refreshing or closing the page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // Required for Chrome
    };

    // attach
    window.addEventListener("beforeunload", handleBeforeUnload);

    // cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (!isTimerActive) return;
    if (timer <= 0) {
      setIsTimerActive(false);
      return;
    }
    const t = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer, isTimerActive]);

  const handleChange = (e, idx) => {
    const raw = e.target.value;
    // accept only digits, but allow paste of longer string handled separately
    const digit = raw.replace(/\D/g, "").slice(0, 1);
    setValues((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });
    if (digit && idx < OTP_FIELDS - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (!values[idx] && idx > 0) {
        inputRefs.current[idx - 1]?.focus();
        setValues((prev) => {
          const next = [...prev];
          next[idx - 1] = "";
          return next;
        });
      } else {
        setValues((prev) => {
          const next = [...prev];
          next[idx] = "";
          return next;
        });
      }
    }

    if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowRight" && idx < OTP_FIELDS - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData("text");
    const digits = pasted.replace(/\D/g, "").slice(0, OTP_FIELDS).split("");
    if (!digits.length) return;
    setValues((prev) => {
      const next = [...prev];
      for (let i = 0; i < OTP_FIELDS; i++) {
        next[i] = digits[i] ?? "";
      }
      return next;
    });
    // focus after last pasted character
    const focusIdx = Math.min(digits.length, OTP_FIELDS - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = values.join("");
    if (otpString.length !== OTP_FIELDS) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/VerifyOtp`,
        { input: otpString },
        { withCredentials: true }
      );

      const { success, message, userRole } = response?.data || {};

      if (success) {
        toast.success(message || "Verified");
        await GetLoginUserDetails();
        // route by role (keeps your original mapping)
        const roleToRoute = {
          Admin: "/admin/dashboard",
          center: "/center/dashboard",
          "operation-manager": "/operational/dashboard",
          Accountant: "/accountant/dashboard",
          Counsellor: "/counsellor/dashboard",
          subCenter: "/sub-center/dashboard",
          subCounsellor: "/sub-counsellor/dashboard",
          "university-manager": "/university-manager/dashboard",
        };
        const route = roleToRoute[userRole] || "/";
        // small delay so toast is visible
        setTimeout(() => nav(route), 600);
      } else {
        toast.error(message || "Verification failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isTimerActive) return;
    try {
      setResending(true);
      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ResendOtp`,
        {
          email: userData?.email,
          code: userData?.code,
        },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        toast.success(Response.data.message || "OTP resent");
        setTimer(INITIAL_TIMER);
        setIsTimerActive(true);
        setValues(Array(OTP_FIELDS).fill(""));
        inputRefs.current[0]?.focus();
      } else {
        toast.error(Response?.data?.message || "Failed to resend");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="w-full max-w-lg p-6 rounded-2xl shadow-lg"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--soft-shadow)",
          borderRadius: "var(--card-radius)",
        }}
      >
        <div className="text-center mb-4">
          <h1
            className="text-xl font-semibold"
            style={{ color: "var(--brand-ink)" }}
          >
            OTP Verification
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Enter the 6-digit code sent to <strong>{userData?.email}</strong>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          onPaste={handlePaste}
          className="space-y-5"
        >
          <div className="flex items-center justify-center gap-3">
            {values.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                inputMode="numeric"
                pattern="[0-9]*"
                name={`OtpNumber${idx + 1}`}
                value={val}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                maxLength={1}
                className="w-12 h-12 sm:w-14 sm:h-14 text-lg sm:text-xl font-semibold text-center rounded-xl transition-shadow
                  focus:outline-none"
                style={{
                  background: "var(--surface)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  color: "var(--brand-ink)",
                  boxShadow: "0 2px 6px rgba(16,24,40,0.03)",
                }}
                aria-label={`OTP digit ${idx + 1}`}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-2 rounded-full text-sm font-semibold transition"
              style={{
                background: submitting
                  ? "rgba(162,142,249,0.6)"
                  : "var(--color-purple)",
                color: "white",
                boxShadow: submitting ? "none" : "var(--soft-shadow)",
              }}
            >
              {submitting ? "Verifying..." : "Verify & Login"}
            </button>

            <div
              className="text-xs text-center"
              style={{ color: "var(--muted)" }}
            >
              {isTimerActive ? (
                <span>
                  Resend in{" "}
                  <strong style={{ color: "var(--brand-ink)" }}>
                    {timer}s
                  </strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-sm font-semibold rounded-full px-3 py-1"
                  style={{
                    color: "var(--brand-ink)",
                    background: "transparent",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  {resending ? "Resending..." : "Resend OTP"}
                </button>
              )}
            </div>
          </div>

          {/* <p className="text-center text-xs" style={{ color: "var(--muted)" }}>
            Tip: You can paste the full code (Ctrl/Cmd+V) or allow autofill from
            your device.
          </p> */}
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
