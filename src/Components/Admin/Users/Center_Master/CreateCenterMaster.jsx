import React, { useEffect, useState } from "react";
import uploadFile from "../../../../Helper/UploadFile";
import PincodeDecode from "../../../../Helper/PincodeDecode";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";

const CreateCenterMaster = ({
  HandleCloseCreateCenterMaster,
  FetchCenterByPagination,
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
    Center_Photo: "",
    WalletAmount: 0,
  });

  const HandleInputData = (e) => {
    e.preventDefault();
    const { name, value, type } = e.target;
    // keep numbers as numbers for WalletAmount, Contact etc if needed
    setCenterMasterData((preve) => ({
      ...preve,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const HandleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const response = await uploadFile(file);
    setCenterMasterData((Preve) => ({
      ...Preve,
      Center_Photo: response?.url,
    }));
  };

  const [PincodeData, setPincodeData] = useState([]);

  const HandlePincodeChange = async (e) => {
    const { value } = e.target;
    setCenterMasterData((Preve) => ({ ...Preve, Pincode: value }));
    if (!value || String(value).length < 3) {
      setPincodeData([]);
      return;
    }
    try {
      const response = await PincodeDecode(value);
      setPincodeData(response || []);
      if (response?.[0]?.Status === "Success") {
        const po = response[0]?.PostOffice?.[0];
        if (po?.District) {
          setCenterMasterData((Preve) => ({ ...Preve, District: po.District }));
        }
        if (po?.State) {
          setCenterMasterData((Preve) => ({ ...Preve, State: po.State }));
        }
      }
    } catch (err) {
      setPincodeData([]);
    }
  };

  const UniversitySelectedRedux = useSelector((state) => state.university);

  const HandleCenterMasterCreate = async (e) => {
    e.preventDefault();
    try {
      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register-center`,
        {
          University: UniversitySelectedRedux?.id,
          userType: CenterMasterData?.UserType,
          name: CenterMasterData?.Name,
          shortName: CenterMasterData?.ShortName,
          email: CenterMasterData?.Email,
          contact: CenterMasterData?.Contact,
          contactPersonName: CenterMasterData?.ContactPersonName,
          alternateContact: CenterMasterData?.AlternateContact,
          photo: CenterMasterData?.Center_Photo,
          pincode: CenterMasterData?.Pincode,
          city: CenterMasterData?.City,
          district: CenterMasterData?.District,
          address: CenterMasterData?.Address,
          state: CenterMasterData?.State,
          WalletAmount: CenterMasterData?.WalletAmount,
          role: "center",
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        FetchCenterByPagination();
        HandleCloseCreateCenterMaster();
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Validation flags (kept your original logic but you can refactor later)
  const [RequiredMsg, setRequiredMsg] = useState({
    UserType: true,
    Name: true,
    ShortName: true,
    Email: true,
    ContactPersonName: true,
    Contact: true,
    AlternateContact: true,
    Address: true,
    State: true,
    Pincode: true,
    District: true,
    City: true,
    Photo: true,
  });

  useEffect(() => {
    setRequiredMsg({
      UserType: CenterMasterData?.UserType === "",
      Name: CenterMasterData?.Name === "",
      ShortName: CenterMasterData?.ShortName === "",
      Email: CenterMasterData?.Email === "",
      ContactPersonName: CenterMasterData?.ContactPersonName === "",
      Contact: CenterMasterData?.Contact === "",
      AlternateContact: CenterMasterData?.AlternateContact === "",
      Address: CenterMasterData?.Address === "",
      State: CenterMasterData?.State === "",
      Pincode: CenterMasterData?.Pincode === "",
      District: CenterMasterData?.District === "",
      City: CenterMasterData?.City === "",
      Photo: !CenterMasterData?.Center_Photo,
    });
  }, [CenterMasterData]);

  return (
    <>
      <section
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        aria-modal="true"
        role="dialog"
      >
        <div className="bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-400 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-lg font-bold">Center Masters</h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Create Center Master
              </p>
            </div>

            <button
              aria-label="Close Create CenterMaster Modal"
              onClick={HandleCloseCreateCenterMaster}
              className="text-xl font-bold text-red-600"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={HandleCenterMasterCreate} className="space-y-4">
            {/* User Type */}
            <div>
              <label className="block text-xs font-medium mb-1">
                User Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                name="UserType"
                value={CenterMasterData.UserType}
                onChange={HandleInputData}
                className={`w-full text-xs rounded border px-3 py-2 focus:outline-none ${
                  RequiredMsg.UserType
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

            {/* Grid layout: responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium mb-1">
                  Center Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="Name"
                  id="Name"
                  value={CenterMasterData.Name}
                  onChange={HandleInputData}
                  placeholder="Ex: Sam Bun"
                  required
                  className={`w-full text-xs rounded border px-3 py-2 focus:outline-none ${
                    RequiredMsg.Name
                      ? "outline-2 outline-red-500"
                      : "outline-2 outline-green-500"
                  }`}
                />
              </div>

              {/* Short Name */}
              <div>
                <label className="block text-xs font-medium mb-1">
                  Short Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="ShortName"
                  id="ShortName"
                  value={CenterMasterData.ShortName}
                  onChange={HandleInputData}
                  placeholder="Ex: SB"
                  required
                  className={`w-full text-xs rounded border px-3 py-2 focus:outline-none ${
                    RequiredMsg.ShortName
                      ? "outline-2 outline-red-500"
                      : "outline-2 outline-green-500"
                  }`}
                />
              </div>

              {/* Contact Person Name */}
              <div>
                <label className="block text-xs font-medium mb-1">
                  Contact Person Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="ContactPersonName"
                  id="ContactPersonName"
                  value={CenterMasterData.ContactPersonName}
                  onChange={HandleInputData}
                  placeholder="Ex: Sam"
                  required
                  className={`w-full text-xs rounded border px-3 py-2 focus:outline-none ${
                    RequiredMsg.ContactPersonName
                      ? "outline-2 outline-red-500"
                      : "outline-2 outline-green-500"
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="Email"
                  id="Email"
                  value={CenterMasterData.Email}
                  onChange={HandleInputData}
                  placeholder="Ex: sam@gmail.com"
                  type="email"
                  required
                  className={`w-full text-xs rounded border px-3 py-2 focus:outline-none ${
                    RequiredMsg.Email
                      ? "outline-2 outline-red-500"
                      : "outline-2 outline-green-500"
                  }`}
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-xs font-medium mb-1">
                  Contact <span className="text-red-500">*</span>
                </label>
                <input
                  name="Contact"
                  id="Contact"
                  value={CenterMasterData.Contact}
                  onChange={HandleInputData}
                  placeholder="Ex: +91 12345 12345"
                  type="tel"
                  required
                  className={`w-full text-xs rounded border px-3 py-2 focus:outline-none ${
                    RequiredMsg.Contact
                      ? "outline-2 outline-red-500"
                      : "outline-2 outline-green-500"
                  }`}
                />
              </div>

              {/* Alternate Contact */}
              <div>
                <label className="block text-xs font-medium mb-1">
                  Alternate Contact <span className="text-red-500">*</span>
                </label>
                <input
                  name="AlternateContact"
                  id="AlternateContact"
                  value={CenterMasterData.AlternateContact}
                  onChange={HandleInputData}
                  placeholder="Ex: +91 12345 12345"
                  type="tel"
                  required
                  className={`w-full text-xs rounded border px-3 py-2 focus:outline-none ${
                    RequiredMsg.AlternateContact
                      ? "outline-2 outline-red-500"
                      : "outline-2 outline-green-500"
                  }`}
                />
              </div>

              {/* Address (span full width on small; here kept one column but it will wrap) */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="Address"
                  id="Address"
                  rows={2}
                  value={CenterMasterData.Address}
                  onChange={HandleInputData}
                  placeholder="Ex: H NO 105, B/8 ANDHERI MUMBAI"
                  required
                  className={`w-full text-xs rounded border px-3 py-2 focus:outline-none ${
                    RequiredMsg.Address
                      ? "outline-2 outline-red-500"
                      : "outline-2 outline-green-500"
                  }`}
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-medium mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  name="Pincode"
                  id="Pincode"
                  value={CenterMasterData.Pincode}
                  onChange={HandlePincodeChange}
                  placeholder="Ex: 400058"
                  type="text"
                  inputMode="numeric"
                  required
                  className={`w-full text-xs rounded border px-3 py-2 focus:outline-none ${
                    RequiredMsg.Pincode
                      ? "outline-2 outline-red-500"
                      : "outline-2 outline-green-500"
                  }`}
                />
              </div>

              {/* City (driven by pincode) */}
              <div>
                <label className="block text-xs font-medium mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  name="City"
                  id="City"
                  value={CenterMasterData.City}
                  onChange={HandleInputData}
                  required
                  className={`w-full text-xs rounded border px-3 py-2 focus:outline-none ${
                    RequiredMsg.City
                      ? "outline-2 outline-red-500"
                      : "outline-2 outline-green-500"
                  }`}
                >
                  <option value="">Select city</option>
                  {PincodeData?.[0]?.Status === "Success" &&
                    PincodeData[0]?.PostOffice?.map((postOffice, index) => (
                      <option key={index} value={postOffice?.Name}>
                        {postOffice?.Name}
                      </option>
                    ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-medium mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  name="District"
                  id="District"
                  value={CenterMasterData.District}
                  onChange={HandleInputData}
                  required
                  className={`w-full text-xs rounded border px-3 py-2 focus:outline-none ${
                    RequiredMsg.District
                      ? "outline-2 outline-red-500"
                      : "outline-2 outline-green-500"
                  }`}
                />
              </div>

              {/* State (disabled, set via Pincode) */}
              <div>
                <label className="block text-xs font-medium mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  name="State"
                  id="State"
                  value={CenterMasterData.State}
                  onChange={HandleInputData}
                  disabled
                  className={`w-full text-xs rounded border px-3 py-2 bg-gray-50 dark:bg-slate-800 focus:outline-none ${
                    RequiredMsg.State
                      ? "outline-2 outline-red-500"
                      : "outline-2 outline-green-500"
                  }`}
                />
              </div>
            </div>

            {/* Wallet + Photo (responsive) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Recharge Amount
                </label>
                <input
                  name="WalletAmount"
                  id="WalletAmount"
                  value={CenterMasterData.WalletAmount}
                  onChange={HandleInputData}
                  type="number"
                  className="w-full text-xs rounded border px-3 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Photo <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="file"
                  id="Photo"
                  name="Center_Photo"
                  onChange={HandleUploadPhoto}
                  accept="image/*"
                  className={`w-full text-xs rounded border px-3 py-2 focus:outline-none ${
                    RequiredMsg.Photo
                      ? "outline-2 outline-red-500"
                      : "outline-2 outline-green-500"
                  }`}
                />

                {/* Preview */}
                {CenterMasterData.Center_Photo && (
                  <div className="mt-3">
                    <div className="w-28 h-28 rounded-md overflow-hidden border">
                      <img
                        src={CenterMasterData.Center_Photo}
                        alt="center preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={HandleCloseCreateCenterMaster}
                className="px-4 py-2 rounded bg-gray-200 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded bg-green-600 text-white text-sm font-semibold"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default CreateCenterMaster;
