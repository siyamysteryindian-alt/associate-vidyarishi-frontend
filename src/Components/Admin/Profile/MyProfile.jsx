// =================== PROFESSIONAL CORPORATE MY PROFILE ======================
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import uploadFile from "../../../Helper/UploadFile";
import Loader from "../../../Helper/Loader";
import { useSelector } from "react-redux";

// ---------------- Field Component ----------------
const Field = ({ label, name, value, onChange, type = "text", disabled }) => (
  <div className="w-full flex flex-col gap-1">
    <label
      className="text-xs font-semibold tracking-wide"
      style={{ color: "var(--brand-ink)" }}
    >
      {label}
    </label>

    <input
      id={name}
      name={name}
      disabled={disabled}
      type={type}
      value={value ?? ""}
      onChange={onChange}
      className={`border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none ${
        disabled
          ? "opacity-70 bg-gray-100 cursor-not-allowed"
          : "focus:ring-2 focus:ring-green-200"
      }`}
      style={{
        borderColor: "rgba(0,0,0,0.12)",
        boxShadow: "var(--soft-shadow-2)",
      }}
    />
  </div>
);

// ---------------- Skeleton Loader ----------------
const Skeleton = ({ height }) => (
  <div
    className="skeleton mb-3"
    style={{ height, borderRadius: 6, width: "100%" }}
  />
);

// ---------------- My Profile Page ----------------
const MyProfile = () => {
  const user = useSelector((s) => s?.user);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    photo: "",
    alternatephone: "",
    alternateemail: "",
  });

  const [center, setCenter] = useState({
    centerName: "",
    contactName: "",
    email: "",
    mobile: "",
    altMobile: "",
    photo: "",
    address: "",
    userType: "",
    code: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetLoggeduser`,
        { withCredentials: true }
      );

      if (res?.data?.success) {
        const d = res.data.LoginData;

        setProfile({
          name: d?.name,
          role: d?.userType,
          phone: d?.contact,
          email: d?.email,
          photo: d?.photo,
          alternatephone: d?.alternateContact,
          alternateemail: d?.alternateemail,
        });

        setCenter({
          centerName: d?.name,
          contactName: d?.contactPersonName,
          email: d?.email,
          mobile: d?.contact,
          altMobile: d?.alternateContact,
          photo: d?.photo,
          userType: d?.userType,
          code: d?.code,
          address: `${d?.address?.address || ""}, ${d?.address?.city || ""}, ${
            d?.address?.state || ""
          } - ${d?.address?.pincode || ""}`,
        });
      }
    } catch (e) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const upload = await uploadFile(file);
      if (upload?.url) {
        setProfile((p) => ({ ...p, photo: upload.url }));
        setCenter((c) => ({ ...c, photo: upload.url }));
      }
    } catch {
      toast.error("Image upload failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdateCenterProfileData`,
        {
          CenterName: center.centerName,
          ContactName: center.contactName,
          EmailId: center.email,
          Mobile: center.mobile,
          alternateMobile: center.altMobile,
          centerPhoto: center.photo,
          userType: center.userType,
          id: user.id,
        },
        { withCredentials: true }
      );

      toast.success("Profile updated");
      fetchProfile();
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  // ======================= UI START ========================

  return (
    <section className="p-4 ">
      {/* HEADER */}
      <div
        className="w-full h-16 px-6 flex items-center justify-between rounded-xl"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--soft-shadow)",
        }}
      >
        <h2
          className="text-lg font-bold tracking-wide"
          style={{ color: "var(--brand-ink)" }}
        >
          My Profile
        </h2>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-12 gap-6 mt-5 h-[calc(100vh-120px)] min-h-[120px] overflow-y-auto">
        {/* LEFT CARD – Profile */}
        <div className="col-span-12 lg:col-span-4">
          <div
            className="rounded-xl p-6 flex flex-col items-center gap-4"
            style={{
              background: "var(--surface)",
              boxShadow: "var(--soft-shadow)",
            }}
          >
            {/* IMAGE */}
            <div className="w-36 h-36 rounded-xl overflow-hidden shadow border bg-gray-100">
              {loading ? (
                <Skeleton height={140} />
              ) : profile.photo ? (
                <img
                  src={profile.photo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Photo
                </div>
              )}
            </div>

            {/* CHANGE PHOTO */}
            {user.role === "Admin" && (
              <label
                htmlFor="photo"
                className="text-xs px-4 py-2 rounded-lg cursor-pointer"
                style={{
                  background: "var(--accent-mint)",
                  color: "var(--brand-ink)",
                }}
              >
                Change Photo
              </label>
            )}
            <input
              id="photo"
              type="file"
              className="hidden"
              onChange={handleUpload}
            />

            {/* Basic Info */}
            <div className="text-center">
              <h3 className="text-lg font-semibold">{profile.name}</h3>
              <p className="text-sm opacity-70">{profile.role}</p>
            </div>

            <div className="w-full h-[1px] bg-gray-200 mt-2" />

            {/* Contact Info */}
            <div className="w-full space-y-1 text-sm">
              <p>
                <b>Email:</b> {profile.email}
              </p>
              <p>
                <b>Mobile:</b> {profile.phone}
              </p>
              <p>
                <b>Alternate:</b> {profile.alternatephone || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT CARD – Editable / Read-only */}
        <div className="col-span-12 lg:col-span-8">
          <div
            className="rounded-xl p-6"
            style={{
              background: "var(--surface)",
              boxShadow: "var(--soft-shadow)",
            }}
          >
            {/* Title */}
            <h3
              className="text-base font-bold mb-4"
              style={{ color: "var(--brand-ink)" }}
            >
              {user.role === "Admin" ? "Edit Profile" : "Profile Information"}
            </h3>

            {/* LOADING SKELETON */}
            {loading ? (
              <div>
                <Skeleton height={20} />
                <Skeleton height={20} />
                <Skeleton height={20} />
                <Skeleton height={20} />
              </div>
            ) : user.role === "Admin" ? (
              // --------- EDITABLE FORM ----------
              <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
                <Field
                  label="Name"
                  name="centerName"
                  value={center.centerName}
                  onChange={(e) =>
                    setCenter({ ...center, centerName: e.target.value })
                  }
                />

                <Field
                  label="Contact Person"
                  name="contactName"
                  value={center.contactName}
                  onChange={(e) =>
                    setCenter({ ...center, contactName: e.target.value })
                  }
                />

                <Field
                  label="Email"
                  type="email"
                  name="email"
                  value={center.email}
                  onChange={(e) =>
                    setCenter({ ...center, email: e.target.value })
                  }
                />

                <Field
                  label="Mobile"
                  name="mobile"
                  value={center.mobile}
                  onChange={(e) =>
                    setCenter({ ...center, mobile: e.target.value })
                  }
                />

                <Field
                  label="Alternate Mobile"
                  name="altMobile"
                  value={center.altMobile}
                  onChange={(e) =>
                    setCenter({ ...center, altMobile: e.target.value })
                  }
                />

                {/* SAVE BUTTON */}
                <div className="col-span-2 flex justify-end mt-2">
                  {/* <button
                    type="submit"
                    className="px-6 py-2 rounded-lg font-semibold"
                    disabled={saving}
                    style={{
                      background: "var(--accent-mint)",
                      color: "var(--brand-ink)",
                      boxShadow: "var(--soft-shadow-2)",
                    }}
                  >
                    {saving ? "Saving..." : "Update Profile"}
                  </button> */}
                </div>
              </form>
            ) : (
              // --------- READ ONLY ----------
              <div className="space-y-3 text-sm">
                <p>
                  <b>Name:</b> {center.centerName}
                </p>
                <p>
                  <b>Email:</b> {center.email}
                </p>
                <p>
                  <b>Contact:</b> {center.mobile}
                </p>
                <p>
                  <b>Your Code:</b> {center.code}
                </p>
                <p>
                  <b>Address:</b> {center.address}
                </p>
                <p>
                  <b>User Type:</b> {center.userType}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Loader Overlay */}
      {saving && (
        <div className="fixed inset-0 bg-[#00000033] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <Loader />
          </div>
        </div>
      )}
    </section>
  );
};

export default MyProfile;
