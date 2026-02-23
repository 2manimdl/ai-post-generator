import { useEffect } from 'react';

const useFontLoader = (fontFamily) => {
    useEffect(() => {
        if (!fontFamily) return;

        // Check if font is already loaded or is a system font
        const linkId = `font-link-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
        if (document.getElementById(linkId)) return;

        // Create link element
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;700;900&display=swap`;

        document.head.appendChild(link);

        return () => {
            // Optional: cleanup if needed, but usually we keep fonts loaded
        };
    }, [fontFamily]);
};

export default useFontLoader;
