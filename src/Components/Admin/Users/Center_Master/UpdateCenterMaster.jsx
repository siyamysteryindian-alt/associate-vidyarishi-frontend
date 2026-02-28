import React, { useEffect, useState, useRef } from "react";
import PincodeDecode from "../../../../Helper/PincodeDecode";
import uploadFile from "../../../../Helper/UploadFile";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateCenterMaster = ({
  HandleUpdateCenterMasterCloseButton,
  FetchCenterByPagination,
  EditCenterMasterUpdate,
}) => {
  const [CenterMasterData, setCenterMasterData] = useState({
    UserType: "",
    Name: "",
    ShortName: "",
    Email: "",
    ContactPersonName: "",
    Contact: "",
    AlternateContact: "",
    Address: "",
    State: "",
    Pincode: "",
    District: "",
    City: "",
    Photo: "",
  });

  // Keep pincode API results
  const [pincodeResult, setPincodeResult] = useState([]);
  const [loadingPincode, setLoadingPincode] = useState(false);
  const pincodeDebounceRef = useRef(null);

  // initialize state when prop changes
  useEffect(() => {
    if (!EditCenterMasterUpdate) return;
    setCenterMasterData({
      UserType: EditCenterMasterUpdate?.userType || "",
      Name: EditCenterMasterUpdate?.name || "",
      ShortName: EditCenterMasterUpdate?.shortName || "",
      Email: EditCenterMasterUpdate?.email || "",
      ContactPersonName: EditCenterMasterUpdate?.contactPersonName || "",
      Contact: EditCenterMasterUpdate?.contact || "",
      AlternateContact: EditCenterMasterUpdate?.alternateContact || "",
      Address: EditCenterMasterUpdate?.address?.address || "",
      State: EditCenterMasterUpdate?.address?.state || "",
      Pincode: EditCenterMasterUpdate?.address?.pincode || "",
      District: EditCenterMasterUpdate?.address?.district || "",
      City: EditCenterMasterUpdate?.address?.city || "",
      Photo: EditCenterMasterUpdate?.photo || "",
    });
    // Also attempt to prefill pincodeResult (optional)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EditCenterMasterUpdate]);

  const HandleInputData = (e) => {
    e.preventDefault();
    const { name, value, type } = e.target;
    setCenterMasterData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  // Upload photo using your helper
  const HandleUploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadFile(file);
      if (res?.url) {
        setCenterMasterData((prev) => ({ ...prev, Photo: res.url }));
      } else {
        toast.error("Photo upload failed");
      }
    } catch (err) {
      toast.error("Photo upload failed");
    }
  };

  // Debounced pincode lookup
  const fetchPincode = async (pin) => {
    if (!pin || pin.toString().length < 3) {
      setPincodeResult([]);
      return;
    }
    setLoadingPincode(true);
    try {
      const res = await PincodeDecode(pin);
      setPincodeResult(res || []);
      if (res?.[0]?.Status === "Success") {
        const post = res[0]?.PostOffice?.[0];
        if (post?.District) {
          setCenterMasterData((prev) => ({ ...prev, District: post.District }));
        }
        if (post?.State) {
          setCenterMasterData((prev) => ({ ...prev, State: post.State }));
        }
      }
    } catch (err) {
      setPincodeResult([]);
    } finally {
      setLoadingPincode(false);
    }
  };

  const HandlePincodeChange = (e) => {
    // keep numeric only, max 6 digits
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const value = raw.slice(0, 6);
    setCenterMasterData((prev) => ({ ...prev, Pincode: value }));

    // debounce
    if (pincodeDebounceRef.current) clearTimeout(pincodeDebounceRef.current);
    pincodeDebounceRef.current = setTimeout(() => {
      if (value.length >= 3) {
        fetchPincode(value);
      } else {
        setPincodeResult([]);
      }
    }, 450);
  };

  const HandleCenterMasterUpdate = async (e) => {
    e.preventDefault();
    try {
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdateCenterMaster`,
        {
          name: CenterMasterData?.Name,
          email: CenterMasterData?.Email,
          contact: CenterMasterData?.Contact,
          photo: CenterMasterData?.Photo,
          userType: CenterMasterData?.UserType,
          shortName: CenterMasterData?.ShortName,
          contactPersonName: CenterMasterData?.ContactPersonName,
          alternateContact: CenterMasterData?.AlternateContact,
          pincode: CenterMasterData?.Pincode,
          city: CenterMasterData?.City,
          district: CenterMasterData?.District,
          address: CenterMasterData?.Address,
          state: CenterMasterData?.State,
          Centerid: EditCenterMasterUpdate?._id,
          Addressid: EditCenterMasterUpdate?.address?._id,
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        HandleUpdateCenterMasterCloseButton();
        FetchCenterByPagination();
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Simple validation flags (kept same idea)
  const [errors, setErrors] = useState({});
  useEffect(() => {
    setErrors({
      UserType: !CenterMasterData?.UserType,
      Name: !CenterMasterData?.Name,
      ShortName: !CenterMasterData?.ShortName,
      Email: !CenterMasterData?.Email,
      ContactPersonName: !CenterMasterData?.ContactPersonName,
      Contact: !CenterMasterData?.Contact,
      AlternateContact: !CenterMasterData?.AlternateContact,
      Address: !CenterMasterData?.Address,
      State: !CenterMasterData?.State,
      Pincode: !CenterMasterData?.Pincode,
      District: !CenterMasterData?.District,
      City: !CenterMasterData?.City,
      Photo: !CenterMasterData?.Photo,
    });
  }, [CenterMasterData]);

  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white dark:bg-slate-900 dark:text-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto shadow-lg">
        {/* header */}
        <div className="flex items-start justify-between p-4 border-b dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold">Update Center Master</h2>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              Edit details for center — changes will reflect across the system
            </p>
          </div>
          <div>
            <button
              onClick={HandleUpdateCenterMasterCloseButton}
              aria-label="Close update modal"
              className="text-xl font-bold text-red-600 px-2"
            >
              ×
            </button>
          </div>
        </div>

        {/* form */}
        <form onSubmit={HandleCenterMasterUpdate} className="p-4 space-y-4">
          {/* User Type */}
          <div>
            <label className="block text-xs font-medium mb-1">
              User Type <span className="text-red-500">*</span>
            </label>
            <select
              name="UserType"
              value={CenterMasterData.UserType}
              onChange={HandleInputData}
              className={`w-full text-sm rounded border px-3 py-2 focus:outline-none ${
                errors.UserType
                  ? "outline-2 outline-red-500"
                  : "outline-2 outline-green-500"
              }`}
            >
              <option value="">Select</option>
              <option value="Outsourced">Outsourced</option>
              <option value="Inhouse">Inhouse</option>
              <option value="Both">Both</option>
            </select>
          </div>

          {/* responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Name *</label>
              <input
                name="Name"
                value={CenterMasterData.Name}
                onChange={HandleInputData}
                className={`w-full text-sm rounded border px-3 py-2 ${
                  errors.Name
                    ? "outline-2 outline-red-500"
                    : "outline-2 outline-green-500"
                }`}
                placeholder="Ex: Sam Bun"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Short Name *
              </label>
              <input
                name="ShortName"
                value={CenterMasterData.ShortName}
                onChange={HandleInputData}
                className={`w-full text-sm rounded border px-3 py-2 ${
                  errors.ShortName
                    ? "outline-2 outline-red-500"
                    : "outline-2 outline-green-500"
                }`}
                placeholder="Ex: SB"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Contact Person Name *
              </label>
              <input
                name="ContactPersonName"
                value={CenterMasterData.ContactPersonName}
                onChange={HandleInputData}
                className={`w-full text-sm rounded border px-3 py-2 ${
                  errors.ContactPersonName
                    ? "outline-2 outline-red-500"
                    : "outline-2 outline-green-500"
                }`}
                placeholder="Ex: Sam"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Email *</label>
              <input
                name="Email"
                value={CenterMasterData.Email}
                onChange={HandleInputData}
                type="email"
                className={`w-full text-sm rounded border px-3 py-2 ${
                  errors.Email
                    ? "outline-2 outline-red-500"
                    : "outline-2 outline-green-500"
                }`}
                placeholder="Ex: sam@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Contact *
              </label>
              <input
                name="Contact"
                value={CenterMasterData.Contact}
                onChange={HandleInputData}
                type="tel"
                className={`w-full text-sm rounded border px-3 py-2 ${
                  errors.Contact
                    ? "outline-2 outline-red-500"
                    : "outline-2 outline-green-500"
                }`}
                placeholder="Ex: +91 12345 12345"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Alternate Contact *
              </label>
              <input
                name="AlternateContact"
                value={CenterMasterData.AlternateContact}
                onChange={HandleInputData}
                type="tel"
                className={`w-full text-sm rounded border px-3 py-2 ${
                  errors.AlternateContact
                    ? "outline-2 outline-red-500"
                    : "outline-2 outline-green-500"
                }`}
                placeholder="Ex: +91 12345 12345"
                required
              />
            </div>

            {/* Address full width */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1">
                Address *
              </label>
              <textarea
                name="Address"
                value={CenterMasterData.Address}
                onChange={HandleInputData}
                rows={2}
                className={`w-full text-sm rounded border px-3 py-2 ${
                  errors.Address
                    ? "outline-2 outline-red-500"
                    : "outline-2 outline-green-500"
                }`}
                placeholder="Ex: H NO 105, B/8 ANDHERI MUMBAI"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Pincode *
              </label>
              <input
                name="Pincode"
                value={CenterMasterData.Pincode}
                onChange={HandlePincodeChange}
                inputMode="numeric"
                className={`w-full text-sm rounded border px-3 py-2 ${
                  errors.Pincode
                    ? "outline-2 outline-red-500"
                    : "outline-2 outline-green-500"
                }`}
                placeholder="Ex: 400058"
                required
              />
              {loadingPincode && (
                <p className="text-xs text-slate-500 mt-1">
                  Looking up pincode...
                </p>
              )}
              {!loadingPincode && pincodeResult?.[0]?.Status === "Error" && (
                <p className="text-xs text-red-500 mt-1">Pincode not found</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">City *</label>
              <select
                name="City"
                value={CenterMasterData.City || ""}
                onChange={HandleInputData}
                className={`w-full text-sm rounded border px-3 py-2 ${
                  errors.City
                    ? "outline-2 outline-red-500"
                    : "outline-2 outline-green-500"
                }`}
                required
              >
                <option value="">Select city</option>
                {/* Prefer showing current City first */}
                {CenterMasterData.City && (
                  <option value={CenterMasterData.City}>
                    {CenterMasterData.City}
                  </option>
                )}
                {pincodeResult?.[0]?.Status === "Success" &&
                  pincodeResult[0]?.PostOffice?.map((po, idx) => (
                    <option key={idx} value={po?.Name}>
                      {po?.Name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                District *
              </label>
              <input
                name="District"
                value={CenterMasterData.District}
                onChange={HandleInputData}
                className={`w-full text-sm rounded border px-3 py-2 ${
                  errors.District
                    ? "outline-2 outline-red-500"
                    : "outline-2 outline-green-500"
                }`}
                placeholder="District"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">State *</label>
              <input
                name="State"
                value={CenterMasterData.State}
                onChange={HandleInputData}
                disabled
                className={`w-full text-sm rounded border px-3 py-2 bg-gray-50 dark:bg-slate-800 ${
                  errors.State
                    ? "outline-2 outline-red-500"
                    : "outline-2 outline-green-500"
                }`}
                placeholder="State (auto)"
                required
              />
            </div>
          </div>

          {/* Photo upload + preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <label className="block text-xs font-medium mb-1">Photo *</label>
              <input
                type="file"
                accept="image/*"
                onChange={HandleUploadPhoto}
                className={`w-full text-sm rounded border px-3 py-2 ${
                  errors.Photo
                    ? "outline-2 outline-red-500"
                    : "outline-2 outline-green-500"
                }`}
              />
            </div>

            <div className="flex items-center space-x-4">
              {CenterMasterData.Photo ? (
                <div className="w-28 h-28 rounded overflow-hidden border">
                  <img
                    src={CenterMasterData.Photo}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 rounded bg-gray-100 flex items-center justify-center text-xs text-slate-500 border">
                  No photo
                </div>
              )}

              <div>
                <div className="text-xs text-slate-500">
                  Current photo preview
                </div>
                <div className="text-xs text-slate-400">Upload to replace</div>
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={HandleUpdateCenterMasterCloseButton}
              className="px-4 py-2 rounded bg-gray-100 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded bg-green-600 text-white text-sm font-semibold"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UpdateCenterMaster;
