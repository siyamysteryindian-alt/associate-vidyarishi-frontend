import React, { useEffect, useRef, useState } from "react";
import Loader from "../../src/Helper/Loader";

/**
 * PreviewImage - improved, responsive, zoom + pan + keyboard support
 *
 * Props:
 * - HandlePreviewImageToggle (boolean)
 * - setHandlePreviewImageToggle (fn)
 * - HandlePreviewImageDataParams (object) -> expected keys: ProofPhoto | WalletProofPhoto
 * - HandlePreviewImageLoader (boolean)
 *
 * Replaces previous implementation in-place.
 */

const PreviewImage = ({
  HandlePreviewImageToggle,
  setHandlePreviewImageToggle,
  HandlePreviewImageDataParams,
  HandlePreviewImageLoader,
}) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const [zoom, setZoom] = useState(1); // 1..4
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  // Limit helpers
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;

  // Resolve image src
  const src =
    HandlePreviewImageDataParams?.ProofPhoto ||
    HandlePreviewImageDataParams?.WalletProofPhoto ||
    "";

  useEffect(() => {
    // reset when opened/closed or data changes
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  }, [HandlePreviewImageToggle, src]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setHandlePreviewImageToggle(false);
      if (e.key === "+" || e.key === "=")
        setZoom((z) => Math.min(z + 0.25, MAX_ZOOM));
      if (e.key === "-" || e.key === "_")
        setZoom((z) => Math.max(z - 0.25, MIN_ZOOM));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setHandlePreviewImageToggle]);

  // Wheel zoom
  const handleWheel = (e) => {
    if (!e.ctrlKey && !e.metaKey) {
      // only zoom when ctrl/meta is pressed? -> keep as previous: zoom on wheel (consistent)
    }
    e.preventDefault();
    const delta = -e.deltaY; // positive = zoom in
    const step = 0.08;
    if (delta > 0) {
      setZoom((z) => Math.min(Number((z + step).toFixed(3)), MAX_ZOOM));
    } else {
      setZoom((z) => Math.max(Number((z - step).toFixed(3)), MIN_ZOOM));
      // when zoom reaches 1, reset translate
      setTranslate((t) => (zoom - step <= 1 ? { x: 0, y: 0 } : t));
    }
  };

  // Pointer/pan handlers (works with mouse and touch)
  const onPointerDown = (e) => {
    if (zoom <= 1) return;
    setIsPanning(true);
    const point = getPointFromEvent(e);
    setStartPan({ x: point.x - translate.x, y: point.y - translate.y });
    // capture pointer to continue receiving events outside element
    e.target.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isPanning) return;
    const point = getPointFromEvent(e);
    const newX = point.x - startPan.x;
    const newY = point.y - startPan.y;
    // Optional: clamp translate so image cannot be dragged infinitely — calculate bounds
    const bounded = clampTranslate(newX, newY);
    setTranslate(bounded);
  };

  const onPointerUp = (e) => {
    setIsPanning(false);
    try {
      e.target.releasePointerCapture?.(e.pointerId);
    } catch (err) {}
  };

  // Touch pinch-to-zoom (basic)
  const touchState = useRef({ prevDist: null, initialZoom: 1 });
  const onTouchStart = (e) => {
    if (e.touches && e.touches.length === 2) {
      const d = distanceBetweenTouches(e.touches);
      touchState.current.prevDist = d;
      touchState.current.initialZoom = zoom;
    }
  };
  const onTouchMove = (e) => {
    if (e.touches && e.touches.length === 2) {
      e.preventDefault();
      const d = distanceBetweenTouches(e.touches);
      const delta = d - touchState.current.prevDist;
      const step = 0.005;
      const newZoom = Math.min(
        Math.max(touchState.current.initialZoom + delta * step, MIN_ZOOM),
        MAX_ZOOM
      );
      setZoom(newZoom);
    }
  };
  const onTouchEnd = (e) => {
    touchState.current.prevDist = null;
  };

  // Helpers
  function getPointFromEvent(e) {
    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  function distanceBetweenTouches(touches) {
    const a = touches[0];
    const b = touches[1];
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function clampTranslate(x, y) {
    // compute bounds based on image & container sizes
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return { x, y };

    const cw = container.clientWidth;
    const ch = container.clientHeight;

    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;

    // scale the image display size
    // image displayed size (fit inside container) - we assume image is scaled to fit
    // we use img.getBoundingClientRect to get rendered size
    const rect = img.getBoundingClientRect();
    const displayW = rect.width;
    const displayH = rect.height;

    const zoomedW = displayW * zoom;
    const zoomedH = displayH * zoom;

    // maximum allowed translate so image covers container edges
    const maxX = Math.max(0, (zoomedW - displayW) / 2 + (zoomedW - cw) / 2);
    const maxY = Math.max(0, (zoomedH - displayH) / 2 + (zoomedH - ch) / 2);

    // If container larger than image, relax bounds
    const clampX = Math.max(-maxX, Math.min(maxX, x));
    const clampY = Math.max(-maxY, Math.min(maxY, y));
    return { x: clampX, y: clampY };
  }

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, MAX_ZOOM));
  const zoomOut = () => {
    setZoom((z) => {
      const next = Math.max(z - 0.25, MIN_ZOOM);
      if (next === 1) setTranslate({ x: 0, y: 0 });
      return next;
    });
  };
  const reset = () => {
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  };

  if (!HandlePreviewImageToggle) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        ref={containerRef}
        className="relative bg-white rounded-lg shadow-lg max-w-[95vw] max-h-[92vh] w-[min(90vw,90vh)]"
        style={{ overflow: "hidden" }}
      >
        {/* Close button */}
        <button
          aria-label="Close preview"
          className="absolute top-3 right-3 z-30 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700"
          onClick={() => setHandlePreviewImageToggle(false)}
        >
          &times;
        </button>

        {/* Controls (zoom) */}
        <div className="absolute left-3 top-3 z-30 flex gap-2 items-center">
          <button
            onClick={zoomOut}
            aria-label="Zoom out"
            className="bg-white/90 px-2 py-1 rounded shadow text-sm"
          >
            −
          </button>
          <div className="bg-white/90 px-2 py-1 rounded text-sm font-medium shadow">
            {zoom.toFixed(2)}x
          </div>
          <button
            onClick={zoomIn}
            aria-label="Zoom in"
            className="bg-white/90 px-2 py-1 rounded shadow text-sm"
          >
            +
          </button>
          <button
            onClick={reset}
            aria-label="Reset zoom"
            className="bg-white/90 px-2 py-1 rounded shadow text-sm"
          >
            Reset
          </button>
        </div>

        {/* Content */}
        <div
          className="w-full h-[78vh] md:h-[80vh] flex items-center justify-center bg-slate-50"
          onWheel={handleWheel}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {HandlePreviewImageLoader ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader />
            </div>
          ) : src ? (
            <div
              className="relative touch-pan-y"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                cursor: zoom > 1 ? (isPanning ? "grabbing" : "grab") : "auto",
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <img
                ref={imgRef}
                src={src}
                alt="Preview"
                draggable={false}
                className="select-none transition-transform duration-150"
                style={{
                  transform: `scale(${zoom}) translate(${
                    translate.x / zoom
                  }px, ${translate.y / zoom}px)`,
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  userSelect: "none",
                  pointerEvents: "auto",
                }}
                // disable pointer events on image itself to let container capture pointer for panning
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No image found
            </div>
          )}
        </div>

        {/* Footer info / small hint */}
        <div className="px-4 py-2 bg-white/90 flex items-center justify-between text-xs text-gray-600">
          <div>Use mouse wheel or pinch to zoom. Drag to pan when zoomed.</div>
          <div>Esc to close</div>
        </div>
      </div>
    </div>
  );
};

export default PreviewImage;
