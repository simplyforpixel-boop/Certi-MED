// Wait for the DOM to be fully loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", () => {

    // --- Mobile Menu Toggle ---
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");
    const closeIcon = document.getElementById("close-icon");

    if (menuBtn && mobileMenu && menuIcon && closeIcon) {
        menuBtn.addEventListener("click", () => {
            const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
            menuBtn.setAttribute("aria-expanded", !isExpanded);
            mobileMenu.classList.toggle("hidden");
            menuIcon.classList.toggle("hidden");
            closeIcon.classList.toggle("hidden");
        });
    }

    // --- Close Mobile Menu on Link Click ---
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (!mobileMenu.classList.contains("hidden")) {
                menuBtn.setAttribute("aria-expanded", "false");
                mobileMenu.classList.add("hidden");
                menuIcon.classList.remove("hidden");
                closeIcon.classList.add("hidden");
            }
        });
    });


    // --- Schedule Call Modal Logic ---
    const scheduleModal = document.getElementById("schedule-modal");
    const scheduleOverlay = document.getElementById("schedule-overlay");
    const closeScheduleModalBtn = document.getElementById("close-schedule-modal-btn");
    const scheduleCallBtns = document.querySelectorAll(".schedule-call-btn");
    const scheduleForm = document.getElementById("schedule-form");
    const scheduleFormContent = document.getElementById("schedule-form-content");
    const scheduleThankYou = document.getElementById("schedule-thank-you");
    const scheduleEmailInput = document.getElementById("schedule-email");
    const scheduleErrorMessage = document.getElementById("schedule-error-message");

    const openScheduleModal = () => scheduleModal.classList.remove("hidden");
    const closeScheduleModal = () => {
        scheduleModal.classList.add("hidden");
        // Reset form on close
        scheduleFormContent.classList.remove("hidden");
        scheduleThankYou.classList.add("hidden");
        if (scheduleEmailInput) scheduleEmailInput.value = "";
        if (scheduleErrorMessage) scheduleErrorMessage.classList.add("hidden");
    };

    scheduleCallBtns.forEach(btn => btn.addEventListener("click", (e) => {
        e.preventDefault();
        openScheduleModal();
    }));
    
    if (closeScheduleModalBtn) closeScheduleModalBtn.addEventListener("click", closeScheduleModal);
    if (scheduleOverlay) scheduleOverlay.addEventListener("click", closeScheduleModal);

    // --- Schedule Form AJAX Submission ---
    if (scheduleForm) {
        scheduleForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const button = form.querySelector("button[type='submit']");
            const spinner = button.querySelector("i");
            const buttonText = button.querySelector(".button-text");

            // Show loading state
            button.disabled = true;
            spinner.classList.remove("hidden");
            buttonText.textContent = "Scheduling...";
            if (scheduleErrorMessage) scheduleErrorMessage.classList.add("hidden");

            try {
                const response = await fetch(form.action, {
                    method: "POST",
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Show thank you message
                    scheduleFormContent.classList.add("hidden");
                    scheduleThankYou.classList.remove("hidden");
                } else {
                    // Show error
                    if (scheduleErrorMessage) {
                        scheduleErrorMessage.textContent = "An error occurred. Please try again.";
                        scheduleErrorMessage.classList.remove("hidden");
                    }
                }
            } catch (error) {
                // Show network error
                if (scheduleErrorMessage) {
                    scheduleErrorMessage.textContent = "A network error occurred. Please try again.";
                    scheduleErrorMessage.classList.remove("hidden");
                }
            } finally {
                // Reset button
                button.disabled = false;
                spinner.classList.add("hidden");
                buttonText.textContent = "Schedule Now";
            }
        });
    }


    // --- File Upload Form Logic ---
    const form = document.getElementById("certiscribe-form");
    const fileUpload = document.getElementById("file-upload");
    const fileDropZone = document.getElementById("file-drop-zone");
    const fileIcon = document.getElementById("file-icon");
    const fileText = document.getElementById("file-text");
    const fileSubtext = document.getElementById("file-subtext");
    const errorMessage = document.getElementById("form-error-message");
    const thankYouModal = document.getElementById("thank-you-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const thankYouOverlay = document.getElementById("thank-you-overlay");

    const showThankYouModal = () => thankYouModal.classList.remove("hidden");
    const closeThankYouModal = () => thankYouModal.classList.add("hidden");

    if (closeModalBtn) closeModalBtn.addEventListener("click", closeThankYouModal);
    if (thankYouOverlay) thankYouOverlay.addEventListener("click", closeThankYouModal);

    // --- File Drop Zone UI ---
    if (fileDropZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileDropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            fileDropZone.addEventListener(eventName, () => {
                fileDropZone.classList.add("border-accentBlue", "bg-blue-50");
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            fileDropZone.addEventListener(eventName, () => {
                fileDropZone.classList.remove("border-accentBlue", "bg-blue-50");
            }, false);
        });

        fileDropZone.addEventListener("drop", (e) => {
            if (e.dataTransfer.files.length > 0) {
                fileUpload.files = e.dataTransfer.files;
                updateFileDisplay(e.dataTransfer.files[0]);
            }
        }, false);

        fileUpload.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                updateFileDisplay(e.target.files[0]);
            }
        });

        function updateFileDisplay(file) {
            if (file) {
                fileIcon.classList.remove("fa-upload");
                fileIcon.classList.add("fa-file-check", "text-accentGreen");
                fileText.textContent = file.name;
                fileSubtext.textContent = `(${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            }
        }
    }

    // --- File Upload AJAX Submission ---
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const button = form.querySelector("button[type='submit']");
            const spinner = button.querySelector("i");
            const buttonText = button.querySelector(".button-text");

            // Reset error
            if (errorMessage) errorMessage.classList.add("hidden");

            // Validate file
            const file = formData.get("attachment");
            if (!file || file.size === 0) {
                if (errorMessage) {
                    errorMessage.textContent = "Please select a file to upload.";
                    errorMessage.classList.remove("hidden");
                }
                return;
            }

            // Show loading state
            button.disabled = true;
            spinner.classList.remove("hidden");
            buttonText.textContent = "Generating Summary...";

            try {
                const response = await fetch(form.action, {
                    method: "POST",
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showThankYouModal();
                    form.reset();
                    // Reset file display
                    fileIcon.classList.add("fa-upload");
                    fileIcon.classList.remove("fa-file-check", "text-accentGreen");
                    fileText.textContent = "Drag & drop your file here";
                    fileSubtext.textContent = "or click to browse";
                } else {
                    if (errorMessage) {
                        errorMessage.textContent = "An error occurred while submitting. Please try again.";
                        errorMessage.classList.remove("hidden");
                    }
                }
            } catch (error) {
                if (errorMessage) {
                    errorMessage.textContent = "A network error occurred. Please check your connection and try again.";
                    errorMessage.classList.remove("hidden");
                }
            } finally {
                // Reset button
                button.disabled = false;
                spinner.classList.add("hidden");
                buttonText.textContent = "Generate My Free Summary";
            }
        });
    }

    // --- Intersection Observer for Fade-in Animations ---
    const animatedElements = document.querySelectorAll(".animate-fade-in-up");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove("opacity-0");
                    entry.target.classList.add("animate-fade-in-up");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        animatedElements.forEach(el => {
            // Set initial state to opacity-0 so it can fade in
            el.classList.add("opacity-0");
            observer.observe(el);
        });
    } else {
        // Fallback for older browsers
        animatedElements.forEach(el => {
            el.classList.remove("opacity-0");
            el.classList.add("animate-fade-in-up");
        });
    }

});
