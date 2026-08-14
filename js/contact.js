/* =========================================================
   CONTACT.JS
   =========================================================
   Validates the contact form (#contactForm) and shows a
   success message on submit. There's no backend here, so
   "sending" just simulates success and resets the form —
   swap in a real fetch() call to your backend/email service
   when one exists.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");
    if (!form) return;

    const successMessage = document.getElementById("formSuccess");

    const validators = {
        name: {
            pattern: /^[A-Za-z]+(?:['-][A-Za-z]+)*(?:\s[A-Za-z]+(?:['-][A-Za-z]+)*)+$/,
            message: "Please enter your full name (first and last)."
        },
        email: {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Please enter a valid email address."
        },
        subject: {
            pattern: /^.{3,100}$/,
            message: "Subject should be between 3 and 100 characters."
        },
        message: {
            pattern: /^.{10,1000}$/s,
            message: "Message should be at least 10 characters."
        }
    };

    const fields = {
        name: form.elements["name"],
        email: form.elements["email"],
        subject: form.elements["subject"],
        message: form.elements["message"]
    };

    function validateField(key) {
        const input = fields[key];
        const rule = validators[key];
        const errorEl = document.getElementById(`${key}Error`);

        const value = input.value.trim();
        const isValid = rule.pattern.test(value);

        if (isValid) {
            input.classList.remove("invalid");
            if (errorEl) errorEl.textContent = "";
        } else {
            input.classList.add("invalid");
            if (errorEl) errorEl.textContent = rule.message;
        }

        return isValid;
    }

    Object.keys(fields).forEach((key) => {
        const input = fields[key];
        if (!input) return;

        input.addEventListener("blur", () => validateField(key));
        input.addEventListener("input", () => {
            if (input.classList.contains("invalid")) validateField(key);
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (successMessage) successMessage.textContent = "";

        const results = Object.keys(fields).map((key) => validateField(key));
        const allValid = results.every(Boolean);

        if (!allValid) {
            const firstInvalidKey = Object.keys(fields).find(
                (key) => fields[key].classList.contains("invalid")
            );
            if (firstInvalidKey) fields[firstInvalidKey].focus();
            return;
        }

        // No backend to send to yet — simulate success.
        console.log("Contact form submitted:", {
            name: fields.name.value.trim(),
            email: fields.email.value.trim(),
            subject: fields.subject.value.trim(),
            message: fields.message.value.trim()
        });

        if (successMessage) {
            successMessage.textContent = "Thanks — your message has been sent! We'll get back to you soon.";
        }

        form.reset();
        Object.values(fields).forEach((input) => input.classList.remove("invalid"));
    });

});