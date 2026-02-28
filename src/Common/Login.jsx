import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../public/logo.png";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/LoginMain`,
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        nav("/otp-verification", {
          state: res.data.user || data.email,
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "var(--bg)",
      }}
    >
      <div
        className="w-full max-w-md p-8 rounded-2xl shadow-lg border backdrop-blur-md"
        style={{
          background: "rgba(255,255,255,0.7)",
          borderColor: "rgba(0,0,0,0.07)",
        }}
      >
        {/* Company Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={Logo}
            alt="logo"
            className="w-60 h-auto py-2 object-contain opacity-90"
          />
        </div>

        <h2
          className="text-center text-xl font-semibold mb-8"
          style={{ color: "var(--brand-ink)" }}
        >
          Sign in to your account
        </h2>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium mb-1"
              style={{ color: "var(--brand-ink)" }}
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              required
              placeholder="you@company.com"
              className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none"
              style={{
                background: "var(--surface)",
                border: "1px solid rgba(0,0,0,0.1)",
                color: "var(--brand-ink)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium mb-1"
              style={{ color: "var(--brand-ink)" }}
            >
              Password
            </label>

            <div
              className="flex items-center rounded-lg"
              style={{
                background: "var(--surface)",
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                value={data.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 text-sm rounded-lg bg-transparent focus:outline-none"
                style={{ color: "var(--brand-ink)" }}
              />

              <button
                type="button"
                className="px-3 text-gray-500 hover:text-black transition"
                onClick={() => setShowPass((p) => !p)}
              >
                {showPass ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            <div className="mt-2 flex justify-end">
              <NavLink
                to="/Forgot-Password"
                className="text-xs font-medium hover:underline"
                style={{ color: "var(--color-purple)" }}
              >
                Forgot Password?
              </NavLink>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-semibold transition shadow-sm"
            style={{
              background: loading
                ? "rgba(162,142,249,0.6)"
                : "var(--color-purple)",
              color: "white",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <p
          className="text-center text-xs mt-6"
          style={{ color: "var(--muted)" }}
        >
          Need help? Contact{" "}
          <span style={{ color: "var(--color-purple)" }}>Support</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
