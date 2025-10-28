// Custom Tailwind Configuration
// This config object is read by the Tailwind CDN script
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                heading: ['Poppins', 'sans-serif'],
                body: ['Nunito', 'sans-serif'],
            },
            colors: {
                // Palette 1: The Trustworthy Professional
                bgLight: '#F8F9FA',       // Off-White BG
                bgWhite: '#FFFFFF',       // White Card BG
                textNavy: '#1A3A6D',      // Deep Navy Headings
                textDark: '#343A40',      // Dark Gray Body
                textMedium: '#6C757D',    // Medium Gray Sub-text
                borderLight: '#E0E0E0',    // Light Gray Borders
                accentGreen: '#28A745',   // Trustworthy Green
                accentBlue: '#4A90E2',    // Softer Professional Blue (for links)
                ctaOrange: '#FFA500',     // Bright Orange CTA
                ctaOrangeHover: '#E69500', // Darker orange for hover
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            }
        }
    }
}

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Logic ---
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    
    // Check if all menu elements exist
    if (menuBtn && mobileMenu && menuIcon && closeIcon) {
        const navLinks = mobileMenu.querySelectorAll('.nav-link');

        const toggleMenu = () => {
            mobileMenu.classList.toggle('hidden');
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
            const isExpanded = mobileMenu.classList.contains('hidden') ? 'false' : 'true';
            menuBtn.setAttribute('aria-expanded', isExpanded);
        };

        menuBtn.addEventListener('click', toggleMenu);

        // Close menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (!mobileMenu.classList.contains('hidden')) {
                    toggleMenu();
                }
            });
        });
    }

    // --- File Upload UI Logic ---
    const fileUploadInput = document.getElementById('file-upload');
    if (fileUploadInput) {
        const fileDropZone = document.getElementById('file-drop-zone');
        const fileText = document.getElementById('file-text');
        const fileSubtext = document.getElementById('file-subtext');
        const fileIcon = document.getElementById('file-icon');

        if (fileDropZone && fileText && fileSubtext && fileIcon) {
            fileUploadInput.addEventListener('change', () => {
                if (fileUploadInput.files.length > 0) {
                    fileIcon.classList.remove('fa-upload');
                    fileIcon.classList.add('fa-file-alt');
                    fileText.textContent = fileUploadInput.files[0].name;
                    fileSubtext.textContent = 'File selected. Click to change.';
                    fileDropZone.classList.remove('border-accentBlue', 'bg-blue-50');
                    fileDropZone.classList.add('border-accentGreen');
                }
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                fileDropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fileDropZone.classList.add('border-accentBlue', 'bg-blue-50');
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                fileDropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fileDropZone.classList.remove('border-accentBlue', 'bg-blue-50');
                }, false);
            });

            fileDropZone.addEventListener('drop', (e) => {
                fileUploadInput.files = e.dataTransfer.files;
                // Manually trigger the 'change' event
                fileUploadInput.dispatchEvent(new Event('change'));
            });
        }
    }
});
