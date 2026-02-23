"use client";
import React, { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";

const DraggableItem = ({ children, x, y, onDrag, onStop, disabled = false }) => {
  const nodeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Tunggu mount untuk hindari hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- SAFEGUARD: Pastikan X dan Y valid (Bukan NaN) ---
  // Jika error, paksa ke 0 (tengah)
  const safeX = isNaN(x) ? 0 : x;
  const safeY = isNaN(y) ? 0 : y;

  const centerStyle = {
    position: "absolute",
    left: 0,
    top: 0,
    // Gunakan safeX/safeY
    transform: `translate(${safeX}px, ${safeY}px)`, 
    zIndex: disabled ? 10 : (isDragging ? 50 : 20),
    cursor: disabled ? 'default' : 'move',
    touchAction: 'none'
  };

  const innerStyle = {
    transform: "translate(-50%, -50%)", 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'max-content' // Pastikan lebar menyesuaikan konten
  };

  if (!mounted) return null;

  // --- MODE STATIS (DOWNLOAD/PREVIEW REAL) ---
  if (disabled) {
    return (
      <div style={centerStyle}>
        <div style={innerStyle}>{children}</div>
      </div>
    );
  }

  // --- MODE INTERAKTIF (DRAGGABLE) ---
  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: safeX, y: safeY }}
      onStart={() => setIsDragging(true)}
      onDrag={(e, data) => onDrag(data)}
      onStop={(e, data) => { setIsDragging(false); onStop({ x: data.x, y: data.y }); }}
    >
      <div ref={nodeRef} className="absolute z-20 select-none">
        <div style={innerStyle}>
            {/* Outline saat ditarik */}
            <div className={`transition-all duration-200 p-1 rounded-lg border-2 ${isDragging ? "border-orange-500 bg-orange-500/10" : "border-transparent hover:border-slate-300 hover:border-dashed"}`}>
                {children}
            </div>
        </div>
      </div>
    </Draggable>
  );
};

export default DraggableItem;