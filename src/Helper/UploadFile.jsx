import toast from "react-hot-toast";

const url = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
}/auto/upload`;

const uploadFile = async (file) => {
  // Check file size (800 KB = 800 * 1024 bytes)
  if (file.size > 800 * 1024) {
    toast.error("Image size exceeds 800 KB. Please upload a smaller file.", {
      position: "top-center",
    });
    return null; // Early return if file size is too large
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "vidyarishi");

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const response = await res.json();

    if (response?.url) {
      toast.success("Photo Uploaded Successfully", {
        position: "top-center",
      });
    } else {
      throw new Error("Upload failed");
    }

    return response;
  } catch (error) {
    toast.error("An error occurred while uploading the file.", {
      position: "top-center",
    });
    return null;
  }
};

export default uploadFile;
