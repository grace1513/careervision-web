/* =========================================================
   STAGE 3 — STEP A (multi-page version)
   Form regex validation & DOM event listeners
   =========================================================
   Scope: validates the #registration-form fields in real time
   and on submit. On a fully valid submission it stores the
   student's profile in sessionStorage and navigates to quiz.html.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registration-form");
    if (!form) return; // safety check in case this script loads on a page without the form

    /* ---------------------------------------------------
       1. VALIDATION RULES
    --------------------------------------------------- */

    const validators = {

        fullName: {
            pattern: /^[A-Za-z]+(?:['-][A-Za-z]+)*(?:\s[A-Za-z]+(?:['-][A-Za-z]+)*)+$/,
            message: "Enter your full name (first and last, letters only)."
        },

        institutionalEmail: {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu(\.[a-z]{2,3})?|ac\.[a-z]{2,3})$/i,
            message: "Use your institutional email (must end in .edu, .edu.xx, or .ac.xx)."
        },

        studentId: {
            pattern: /^[A-Za-z]{2,5}\d{4,8}$/,
            message: "Enter a valid Student ID (e.g. letters followed by digits, like BSE20240013)."
        },

        phoneNumber: {
            pattern: /^\+?\d{7,15}$/,
            message: "Enter a valid phone number (7–15 digits, optional +country code)."
        }

    };

    /* ---------------------------------------------------
       2. FIELD LOOKUP
    --------------------------------------------------- */

    const fields = {
        fullName: form.elements["fullName"],
        institutionalEmail: form.elements["institutionalEmail"],
        studentId: form.elements["studentId"],
        phoneNumber: form.elements["phoneNumber"]
    };

    /* ---------------------------------------------------
       3. VALIDATE A SINGLE FIELD
    --------------------------------------------------- */

    function validateField(key) {

        const input = fields[key];
        const rule = validators[key];

        const rawValue = input.value.trim();
        const testValue = key === "phoneNumber" ? rawValue.replace(/[\s-]/g, "") : rawValue;

        const isValid = rule.pattern.test(testValue);
        const errorEl = input.closest(".form-group")?.querySelector(".error-message");

        if (isValid) {
            // Positive confirmation state — green border, no error text
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
            input.setAttribute("aria-invalid", "false");
            if (errorEl) errorEl.style.display = "none";
        } else {
            // Error state — red border + visible message
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
            input.setAttribute("aria-invalid", "true");
            if (errorEl) {
                errorEl.textContent = rule.message;
                errorEl.style.display = "block";
            }
        }

        return isValid;
    }

    /* ---------------------------------------------------
       4. LIVE VALIDATION (DOM event listeners)
    --------------------------------------------------- */

    Object.keys(fields).forEach((key) => {

        const input = fields[key];
        if (!input) return;

        input.addEventListener("blur", () => validateField(key));

        input.addEventListener("input", () => {
            if (input.classList.contains("is-invalid")) {
                validateField(key);
            }
        });

    });

    /* ---------------------------------------------------
       5. FORM SUBMIT
       On success: save the profile, then navigate to quiz.html.
       (No more hidden-section toggling — that was the single-page
       version. This is a real page, so we do a real redirect.)
    --------------------------------------------------- */

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const results = Object.keys(fields).map((key) => validateField(key));
        const allValid = results.every(Boolean);

        if (!allValid) {
            const firstInvalidKey = Object.keys(fields).find(
                (key) => fields[key].classList.contains("is-invalid")
            );
            if (firstInvalidKey) fields[firstInvalidKey].focus();
            return;
        }

        const studentProfile = {
            fullName: fields.fullName.value.trim(),
            institutionalEmail: fields.institutionalEmail.value.trim(),
            studentId: fields.studentId.value.trim(),
            phoneNumber: fields.phoneNumber.value.trim()
        };

        sessionStorage.setItem("careervision_student", JSON.stringify(studentProfile));

        // Real navigation to the quiz page
        window.location.href = "quiz.html";
    });

});