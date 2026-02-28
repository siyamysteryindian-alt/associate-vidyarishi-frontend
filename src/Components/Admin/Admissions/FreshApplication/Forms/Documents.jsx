import { useContext, useEffect } from "react";
import { StepperContext } from "../StepperContext";
import uploadFile from "../../../../../Helper/UploadFile";

const Documents = () => {
  const { AllDocuments, setAllDocuments } = useContext(StepperContext);

  const HandleUploadPhoto = async (e) => {
    try {
      const file = e.target.files[0];
      const name = e.target.name;

      if (!file) {
        console.error("No file selected.");
        return;
      }

      const response = await uploadFile(file);

      if (response && response.url) {
        setAllDocuments((prev) => ({
          ...prev,
          [name]: response.url,
        }));
        console.log("Upload successful:", response);
      } else {
        console.error("File upload failed.");
      }
    } catch (error) {
      console.error("An error occurred during file upload:", error);
    }
  };

  const HandleUploadMoreOtherCertificates = async (e) => {
    try {
      const files = Array.from(e.target.files);
      if (!files.length) {
        console.error("No files selected.");
        return;
      }

      const uploadPromises = files.map(async (file) => {
        const response = await uploadFile(file);
        return response?.url || null;
      });

      const urls = (await Promise.all(uploadPromises)).filter(Boolean);

      if (urls.length > 0) {
        setAllDocuments((prev) => ({
          ...prev,
          MoreOtherCertificates: [
            ...(prev.MoreOtherCertificates || []),
            ...urls,
          ],
        }));
        console.log("More other certificates uploaded:", urls);
      } else {
        console.error("File upload failed.");
      }
    } catch (error) {
      console.error("An error occurred during file upload:", error);
    }
  };

  useEffect(() => {
    console.log("AllDocuments:", AllDocuments);
  }, [AllDocuments]);

  const fileLabelClass =
    "block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1";
  const fileInputClass =
    "block w-full text-xs md:text-sm text-slate-700 dark:text-slate-100 " +
    "border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer " +
    "bg-slate-50/80 dark:bg-slate-900/70 px-3 py-2 focus:outline-none " +
    "focus:ring-2 focus:ring-pink-500/80 focus:border-pink-500 " +
    "transition-all duration-200 shadow-sm focus:shadow-md";
  const previewImgClass =
    "mt-2 w-full h-24 object-contain rounded-lg border border-slate-200 " +
    "dark:border-slate-700 bg-white dark:bg-slate-900 p-1 shadow-sm";

  const renderPreview = (url) =>
    url ? <img src={url} alt="preview" className={previewImgClass} /> : null;

  return (
    <div className="w-full mx-2 flex-1">
      <div className="border border-slate-200 dark:border-slate-700 rounded-2xl bg-white/80 dark:bg-slate-900/70 shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-50">
              Documents
            </h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Upload student KYC & supporting documents
            </p>
          </div>
          <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300">
            Step 4 · Documents
          </span>
        </div>

        {/* Body */}
        <div className="p-4 space-y-5">
          {/* Section 1: Core KYC */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                Primary KYC Documents
              </p>
              <span className="text-[10px] text-slate-400">
                Photo, Aadhaar & Signature
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Photo */}
              <div>
                <label htmlFor="Photo" className={fileLabelClass}>
                  Photo <span className="text-red-500">*</span>
                </label>
                <input
                  id="Photo"
                  name="photo"
                  type="file"
                  onChange={HandleUploadPhoto}
                  className={fileInputClass}
                  required
                />
                {renderPreview(AllDocuments?.photo)}
              </div>

              {/* Aadhaar Front */}
              <div>
                <label htmlFor="Aadhaar" className={fileLabelClass}>
                  Aadhaar Front <span className="text-red-500">*</span>
                </label>
                <input
                  id="Aadhaar"
                  name="aadhaar"
                  type="file"
                  onChange={HandleUploadPhoto}
                  className={fileInputClass}
                  required
                />
                {renderPreview(AllDocuments?.aadhaar)}
              </div>

              {/* Aadhaar Back */}
              <div>
                <label htmlFor="aadharBack" className={fileLabelClass}>
                  Aadhaar Back <span className="text-red-500">*</span>
                </label>
                <input
                  id="aadharBack"
                  name="aadharBack"
                  type="file"
                  onChange={HandleUploadPhoto}
                  className={fileInputClass}
                  required
                />
                {renderPreview(AllDocuments?.aadharBack)}
              </div>

              {/* Student Signature */}
              <div>
                <label htmlFor="StudentSignature" className={fileLabelClass}>
                  Student&apos;s Signature{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="StudentSignature"
                  name="StudentSignature"
                  type="file"
                  onChange={HandleUploadPhoto}
                  className={fileInputClass}
                  required
                />
                {renderPreview(AllDocuments?.StudentSignature)}
              </div>
            </div>
          </div>

          {/* Section 2: ABC / DEB IDs */}
          <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                Academic IDs
              </p>
              <span className="text-[10px] text-slate-400">
                ABC & DEB ID documents
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* ABC ID */}
              <div>
                <label htmlFor="ABCID" className={fileLabelClass}>
                  ABC ID
                </label>
                <input
                  id="ABCID"
                  name="ABCID"
                  type="file"
                  onChange={HandleUploadPhoto}
                  className={fileInputClass}
                />
                {renderPreview(AllDocuments?.ABCID)}
              </div>

              {/* DEB ID */}
              <div>
                <label htmlFor="DEBID" className={fileLabelClass}>
                  DEB ID
                </label>
                <input
                  id="DEBID"
                  name="DEBID"
                  type="file"
                  onChange={HandleUploadPhoto}
                  className={fileInputClass}
                />
                {renderPreview(AllDocuments?.DEBID)}
              </div>
            </div>
          </div>

          {/* Section 3: Other docs */}
          <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                Additional Documents
              </p>
              <span className="text-[10px] text-slate-400">
                Optional but recommended where applicable
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Parent Signature */}
              <div>
                <label htmlFor="ParentSignature" className={fileLabelClass}>
                  Parent&apos;s Signature
                </label>
                <input
                  id="ParentSignature"
                  name="ParentSignature"
                  type="file"
                  onChange={HandleUploadPhoto}
                  className={fileInputClass}
                />
                {renderPreview(AllDocuments?.ParentSignature)}
              </div>

              {/* Migration Certificate */}
              <div>
                <label htmlFor="Migration" className={fileLabelClass}>
                  Migration Certificate
                </label>
                <input
                  id="Migration"
                  name="Migration"
                  type="file"
                  onChange={HandleUploadPhoto}
                  className={fileInputClass}
                />
                {renderPreview(AllDocuments?.Migration)}
              </div>

              {/* Affidavit */}
              <div>
                <label htmlFor="Aafidavit" className={fileLabelClass}>
                  Affidavit
                </label>
                <input
                  id="Aafidavit"
                  name="Aafidavit"
                  type="file"
                  onChange={HandleUploadPhoto}
                  className={fileInputClass}
                />
                {renderPreview(AllDocuments?.Aafidavit)}
              </div>

              {/* Other Certificates (multiple) */}
              <div>
                <label
                  htmlFor="MoreOtherCertificates"
                  className={fileLabelClass}
                >
                  Other Certificates (multiple)
                </label>
                <input
                  id="MoreOtherCertificates"
                  name="MoreOtherCertificates"
                  type="file"
                  multiple
                  onChange={HandleUploadMoreOtherCertificates}
                  className={fileInputClass}
                />

                {AllDocuments?.MoreOtherCertificates?.length > 0 && (
                  <div className="w-full mt-2 grid grid-cols-3 gap-2">
                    {AllDocuments.MoreOtherCertificates.map((photoUrl, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <img
                          src={photoUrl}
                          alt={`Uploaded ${idx + 1}`}
                          className="w-20 h-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          {idx + 1}
                        </p>
                      </div>
                    ))}
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

export default Documents;
