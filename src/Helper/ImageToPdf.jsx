import React, { useEffect } from "react";
import jsPDF from "jspdf";

const ImageToPdf = ({ images, HandleDownloadApplicationForm }) => {
  const generatePdf = async (action) => {
    HandleDownloadApplicationForm();

    const pdf = new jsPDF();

    for (let i = 0; i < images.length; i++) {
      const imgData = images[i];
      try {
        const img = await loadImage(imgData);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);

        const imgDataUrl = canvas.toDataURL("image/jpeg");
        if (i > 0) pdf.addPage();
        pdf.addImage(imgDataUrl, "JPEG", 10, 10, 190, 0);
      } catch (error) {
        console.error("Failed to load image:", error);
      }
    }

    if (action === "save") {
      pdf.save("images.pdf");
    } else if (action === "print") {
      pdf.autoPrint();
      window.open(pdf.output("bloburl"), "_blank");
    }
  };

  useEffect(() => {
    HandleDownloadApplicationForm();
  }, []);

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      if (!src) {
        reject(new Error("Invalid image source"));
        return;
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  return (
    <div className="mt-1">
      <button
        onClick={() => generatePdf("save")}
        className="px-2 py-1.5 bg-green-500 text-white rounded-md "
        style={{ margin: "10px" }}
      >
        Download PDF
      </button>
      <button
        onClick={() => generatePdf("print")}
        className="px-2 py-1.5 bg-green-500 text-white rounded-md "
        style={{ margin: "10px" }}
      >
        Print PDF
      </button>
    </div>
  );
};

export default ImageToPdf;
