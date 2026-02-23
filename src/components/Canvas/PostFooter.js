"use client";
import React from 'react';

const PostFooter = ({ content, ratio = 1 }) => {
    if (!content?.footer?.show) return null;

    return (
        <div
            className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none"
            style={{ width: '100%', lineHeight: 0 }}
        >
            {/* 1. Static Footer Image */}
            <img
                src="/assets/footer/footer.png"
                alt="Footer"
                style={{ width: '100%', height: 'auto', display: 'block' }}
            />

            {/* 2. The Patching Box (Anchored to the wrapper above) */}
            <div
                style={{
                    position: 'absolute',
                    bottom: `${113 * ratio}px`, // Dibesarkan agar kotaknya NAIK
                    right: `${10 * ratio}px`,  // Dikecilkan agar kotaknya geser ke KANAN
                    backgroundColor: '#4e494a',
                    padding: `${8 * ratio}px ${12 * ratio}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    minWidth: `${300 * ratio}px`
                }}
            >
                <span
                    style={{
                        fontFamily: 'sans-serif',
                        fontWeight: 800,
                        fontSize: `${25 * ratio}px`,
                        color: '#FFFFFF',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        lineHeight: 1
                    }}
                >
                    {content.footer.permitType === 'bwi' ? 'IZIN BWI 3.3.00338' : 'IZIN AMIL 500/2020'}
                </span>
            </div>
        </div>
    );
};

export default PostFooter;
