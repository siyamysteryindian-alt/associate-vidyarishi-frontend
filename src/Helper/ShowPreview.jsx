import React, { useRef, useState } from "react";
import Loader from "../../src/Helper/Loader";
import Zoom from "react-medium-image-zoom";

const ShowPreview = ({
  HandlePreviewImageToggle,
  setHandlePreviewImageToggle,
  HandlePreviewImageDataParams,
  HandlePreviewImageLoader,
}) => {
  const imgRef = useRef(null);
  const [zoomScale, setZoomScale] = useState(1);

  const HandleCloseImagePreview = () => {
    setHandlePreviewImageToggle(false);
  };

  const handleWheelZoom = (event) => {
    event.preventDefault();
    const scaleChange = event.deltaY > 0 ? -0.1 : 0.1; // Zoom in or out
    setZoomScale((prevScale) =>
      Math.min(Math.max(prevScale + scaleChange, 1), 3)
    ); // Limit scale between 1 and 3
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-[80vh] h-[60vh] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Close Button */}
        <button
          onClick={HandleCloseImagePreview}
          className="absolute top-2 right-2 z-20 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
        >
          &times;
        </button>

        {/* Content */}
        <div className="p-4">
          {HandlePreviewImageLoader ? (
            <div className="flex items-center justify-center w-full h-[60vh]">
              <Loader />
            </div>
          ) : (
            <div
              className="relative flex items-center justify-center overflow-hidden"
              onWheel={handleWheelZoom}
              style={{
                width: "100%",
                height: "300px",
                cursor: "grab",
                backgroundColor: "#f9f9f9",
              }}
            >
              <img
                ref={imgRef}
                src={HandlePreviewImageDataParams}
                alt="Preview"
                className="rounded-md transition-transform duration-300"
                style={{
                  transform: `scale(${zoomScale})`,
                  transformOrigin: "center center",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowPreview;
