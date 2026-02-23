"use client";
import React, { useState } from 'react';
import DraggableItem from './DraggableItem';
import PostFooter from './PostFooter';
import { Instagram, Globe, Facebook } from 'lucide-react';

const PosterPreview = ({ content, controls, setControls, isReal = false }) => {
  const REAL_W = 1080;
  const REAL_H = 1350;
  const PREVIEW_SCALE = 0.333;

  const width = isReal ? REAL_W : REAL_W * PREVIEW_SCALE;
  const height = isReal ? REAL_H : REAL_H * PREVIEW_SCALE;
  const ratio = isReal ? 1 : PREVIEW_SCALE;

  const [snapLines, setSnapLines] = useState({ x: false, y: false });

  const handleSnapDrag = (key, data) => {
    if (isReal) return;
    const threshold = 15;
    let { x, y } = data;
    let showX = false, showY = false;
    if (Math.abs(x) < threshold) { x = 0; showX = true; }
    if (Math.abs(y) < threshold) { y = 0; showY = true; }
    setSnapLines({ x: showX, y: showY });
    setControls(prev => ({ ...prev, [key]: { x: (x / width) * 100, y: (y / height) * 100 } }));
  };

  const handleStop = () => setSnapLines({ x: false, y: false });

  const getPixelPos = (percentPos) => {
    const pxX = (percentPos?.x || 0) / 100 * width;
    const pxY = (percentPos?.y || 0) / 100 * height;
    return { x: isNaN(pxX) ? 0 : pxX, y: isNaN(pxY) ? 0 : pxY };
  };

  const logoPx = getPixelPos(controls.logoPos || { x: 0, y: -40 });
  const textPx = getPixelPos(controls.textPos || { x: 0, y: -5 });

  const getImageProps = (url) => {
    if (!url) return {};
    const isData = url.startsWith('data:') || url.startsWith('/assets');
    if (isData) return { src: url };
    const src = isReal ? `/api/proxy-image?url=${encodeURIComponent(url)}` : url;
    return { src, crossOrigin: "anonymous" };
  };

  const renderFooter = () => {
    if (!content.footer?.show) return null;

    const fontMain = 27 * ratio;
    const fontSub = 20 * ratio;
    const fontSocial = 25 * ratio;

    const SocialItem = ({ Icon, text }) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: `${14 * ratio}px`,
          whiteSpace: "nowrap",
        }}
      >
        <Icon
          size={fontSocial}
          strokeWidth={2}
          color="white"
          style={{
            display: "block",
            flexShrink: 0,
            transform: "translateY(1px)", // optical perfect alignment
          }}
        />

        <span
          style={{
            fontSize: `${fontSocial}px`,
            fontWeight: 600,
            lineHeight: 1,
            margin: 0,
            padding: 0,
            letterSpacing: "0.01em",
          }}
        >
          {text}
        </span>
      </div>
    );

    return (
      <div
        className="absolute left-0 right-0 z-30"
        style={{
          bottom: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.96), rgba(0,0,0,0.85))",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.15)",
          padding: `${45 * ratio}px ${60 * ratio}px`,
          color: "white",
          display: "flex",
          flexDirection: "column",
          gap: `${30 * ratio}px`,
        }}
      >
        {/* TOP ROW */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: `${30 * ratio}px`,
          }}
        >
          {/* BANK INFO */}
          <div
            style={{
              display: "flex",
              gap: `${60 * ratio}px`,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: `${fontMain}px`,
                  lineHeight: 1.1,
                  letterSpacing: "0.02em",
                }}
              >
                CIMB: 860013501200
              </div>
              <div
                style={{
                  opacity: 0.75,
                  fontSize: `${fontSub}px`,
                  marginTop: `${6 * ratio}px`,
                }}
              >
                [Luar Negeri]
              </div>
            </div>

            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: `${fontMain}px`,
                  lineHeight: 1.1,
                  letterSpacing: "0.02em",
                }}
              >
                BSI: 7775559297
              </div>
              <div
                style={{
                  opacity: 0.75,
                  fontSize: `${fontSub}px`,
                  marginTop: `${6 * ratio}px`,
                }}
              >
                [Dalam Negeri]
              </div>
            </div>
          </div>

          {/* PERMIT */}
          <div
            style={{
              fontWeight: 800,
              fontSize: `${fontMain}px`,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textAlign: "right",
            }}
          >
            {content.footer.permitType === "bwi"
              ? "IZIN BWI 3.3.00338"
              : "IZIN AMIL 500/2020"}
          </div>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.15)",
            width: "100%",
          }}
        />

        {/* SOCIAL ROW */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: `${90 * ratio}px`,
            flexWrap: "wrap",
          }}
        >
          <SocialItem Icon={Instagram} text={content.footer.ig} />
          <SocialItem Icon={Globe} text={content.footer.web} />
          <SocialItem Icon={Facebook} text={content.footer.fb} />
        </div>
      </div>
    );
  };

  const renderOverlay = () => {
    if (!content.overlayAsset || content.overlayAsset.type === 'none') return null;
    const opacity = controls.assetOverlayOpacity;
    if (content.overlayAsset.styleType === 'dpf-gradient') {
      const { from, via } = controls.gradientColors;
      const hasImage = !!content.image || !!content.bgImage;
      if (hasImage) {
        return <div className="absolute inset-0 pointer-events-none z-10" style={{ opacity, background: `linear-gradient(to bottom, ${from} 0%, ${via} 25%, transparent 60%)` }}></div>;
      } else {
        const { to } = controls.gradientColors;
        return <div className="absolute inset-0 pointer-events-none z-10" style={{ background: `linear-gradient(to bottom, ${from}, ${via}, ${to})`, opacity }}></div>;
      }
    }
    if (content.overlayAsset.type === 'css') {
      const styleType = content.overlayAsset.styleType;
      const c = controls.singleOverlayColor || '#000000';
      // Convert hex to rgba for gradient compatibility
      const r = parseInt(c.slice(1, 3), 16), g = parseInt(c.slice(3, 5), 16), b = parseInt(c.slice(5, 7), 16);
      const rgba = `rgba(${r},${g},${b},${opacity})`;
      let ds = {};
      if (styleType === 'shadow-bottom') ds = { background: `linear-gradient(to top, ${rgba} 0%, transparent 100%)` };
      else if (styleType === 'vignette') ds = { background: `radial-gradient(circle, transparent 40%, ${rgba} 100%)` };
      else if (styleType === 'frame-gold') ds = { border: `${20 * ratio}px solid ${c}`, boxShadow: `inset 0 0 40px ${rgba}` };
      return <div className="absolute inset-0 pointer-events-none z-10" style={ds}></div>;
    }
    if (content.overlayAsset.type === 'image') {
      return <div className="absolute inset-0 pointer-events-none z-10" style={{ opacity, mixBlendMode: 'overlay' }}><img src={content.overlayAsset.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="overlay" /></div>;
    }
    return null;
  };

  return (
    <div id={isReal ? "poster-canvas-real" : "poster-canvas-preview"} style={{ width: `${width}px`, height: `${height}px`, position: 'relative', backgroundColor: '#ffffff', overflow: 'hidden', fontFamily: 'sans-serif', userSelect: 'none' }}>
      {!isReal && snapLines.x && <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-pink-500 z-50 -translate-x-1/2"></div>}
      {!isReal && snapLines.y && <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-pink-500 z-50 -translate-y-1/2"></div>}

      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden" style={{ backgroundColor: controls.gradientColors.to }}>
        {content.bgImage && !content.image && (<img {...getImageProps(content.bgImage)} className="w-full h-full object-cover" alt="bg" />)}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: controls.overlayColor, opacity: controls.overlayOpacity }} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-0" style={{ height: '100%' }}>
        {content.image && (<img {...getImageProps(content.image)} alt="main" className="absolute w-full h-full object-cover" />)}
      </div>

      {renderOverlay()}

      <div className="absolute top-1/2 left-1/2 w-0 h-0 z-20">
        <DraggableItem x={logoPx.x} y={logoPx.y} onDrag={(pos) => handleSnapDrag('logoPos', pos)} onStop={handleStop} disabled={isReal}>
          {content.logo ? (
            <img key={content.logo} {...getImageProps(content.logo)} style={{ height: `${90 * ratio}px`, display: 'block', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }} alt="logo" />
          ) : (
            <div style={{ fontSize: `${80 * ratio}px`, fontWeight: 900, color: 'white', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.05em', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}>dpf</div>
          )}
        </DraggableItem>

        <DraggableItem x={textPx.x} y={textPx.y} onDrag={(pos) => handleSnapDrag('textPos', pos)} onStop={handleStop} disabled={isReal}>
          <div className="flex flex-col items-center text-center p-2" style={{ width: `${REAL_W * 0.85 * ratio}px`, fontFamily: controls.fontFamily }}>
            <h1 className="font-black leading-[1.1] uppercase whitespace-pre-wrap" style={{ fontSize: `${controls.titleSize * ratio}px`, color: controls.titleColor, textShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>{content.title}</h1>
            <p className="font-bold opacity-95 mt-4 leading-snug whitespace-pre-wrap" style={{ fontSize: `${controls.subtitleSize * ratio}px`, color: controls.subtitleColor, textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>{content.subtitle}</p>
            {content.date && (
              <div style={{ marginTop: `${30 * ratio}px`, display: 'flex', justifyContent: 'center', width: '100%' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: controls.dateBgColor, color: controls.dateColor, fontSize: `${controls.dateSize * ratio}px`, padding: `${12 * ratio}px ${24 * ratio}px`, borderRadius: '999px', fontWeight: 'bold', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}>
                  <span style={{ position: 'relative', top: `${-9 * ratio}px` }}>{content.date}</span>
                </span>
              </div>
            )}
          </div>
        </DraggableItem>
      </div>

      <PostFooter content={content} ratio={ratio} />
    </div>
  );
};

export default PosterPreview;