export const formatDateIndo = () => {
    return new Date().toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
};

// --- DAFTAR ASET ---

export const overlayOptions = [
    // OPSI UTAMA (Index 0): Gradient Configurable
    { name: 'DPF Standard Gradient', type: 'css', styleType: 'dpf-gradient' },

    { name: 'None', type: 'none' },

    // Opsi CSS Lain
    { name: 'CSS: Shadow Bawah', type: 'css', styleType: 'shadow-bottom' },
    { name: 'CSS: Vignette', type: 'css', styleType: 'vignette' },
    { name: 'CSS: Gold Frame', type: 'css', styleType: 'frame-gold' },

    // Opsi Gambar
    { name: 'IMG: Kertas Kusut', type: 'image', src: '/assets/overlays/paper-texture.png' },
    { name: 'IMG: Bingkai Islami', type: 'image', src: '/assets/overlays/islamic-frame.png' },
    { name: 'IMG: Efek Debu', type: 'image', src: '/assets/overlays/dust-particle.png' },
];

export const logoOptions = [
    { name: 'Logo DPF Putih', src: '/assets/logos/logo-dpf-white.png' },
    { name: 'Logo DPF Utama', src: '/assets/logos/logo-dpf-main.png' },
    { name: 'Logo Zakat', src: '/assets/logos/logo-zakat.png' },
];

export const captionStyles = [
    { name: 'Dakwah & Lembut', value: 'dakwah yang lembut, menyentuh hati, dan islami' },
    { name: 'Formal & Profesional', value: 'formal, profesional, dan terpercaya' },
    { name: 'Santai & Akrab', value: 'santai, asik, dan menggunakan emoji' },
];

export const fontOptions = [
    { name: 'Inter', value: 'Inter', category: 'Sans Serif' },
    { name: 'Roboto', value: 'Roboto', category: 'Sans Serif' },
    { name: 'Open Sans', value: 'Open Sans', category: 'Sans Serif' },
    { name: 'Montserrat', value: 'Montserrat', category: 'Sans Serif' },
    { name: 'Lato', value: 'Lato', category: 'Sans Serif' },
    { name: 'Poppins', value: 'Poppins', category: 'Sans Serif' },
    { name: 'Oswald', value: 'Oswald', category: 'Sans Serif' },
    { name: 'Raleway', value: 'Raleway', category: 'Sans Serif' },

    { name: 'Playfair Display', value: 'Playfair Display', category: 'Serif' },
    { name: 'Merriweather', value: 'Merriweather', category: 'Serif' },
    { name: 'Lora', value: 'Lora', category: 'Serif' },
    { name: 'PT Serif', value: 'PT Serif', category: 'Serif' },
    { name: 'Bitter', value: 'Bitter', category: 'Serif' },

    { name: 'Dancing Script', value: 'Dancing Script', category: 'Handwriting' },
    { name: 'Pacifico', value: 'Pacifico', category: 'Handwriting' },
    { name: 'Great Vibes', value: 'Great Vibes', category: 'Handwriting' },
    { name: 'Indie Flower', value: 'Indie Flower', category: 'Handwriting' },

    { name: 'Roboto Mono', value: 'Roboto Mono', category: 'Monospace' },
    { name: 'Inconsolata', value: 'Inconsolata', category: 'Monospace' },
];