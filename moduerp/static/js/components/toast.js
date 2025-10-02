function formatErrorMessage(message) {
    if (typeof message === "string") {
        return message;
    }
    if (typeof message === "object") {
        return Object.entries(message)
            .map(([field, msgs]) => {
                if (Array.isArray(msgs)) {
                    return `<div><strong>${field}:</strong> ${msgs.join(", ")}</div>`;
                }
                return `<div><strong>${field}:</strong> ${msgs}</div>`;
            })
            .join("");
    }
    return "";
}

export function showToast({ title = "Announcement", message = "", type = "info", delay = 3000 }) {
    const toastTemp = document.getElementById("toast");
    if (!toastTemp) {
        console.error("Template #toast not found");
        return;
    }

    // Clone template
    const toastFragment = toastTemp.content.cloneNode(true);
    const toastEl = toastFragment.querySelector('.toast');
    if (!toastEl) {
        console.error("No .toast element inside template");
        return;
    }

    toastEl.querySelector('.toast-header strong').textContent = title;
    const formattedMessage = formatErrorMessage(message);
    toastEl.querySelector('.toast-body').innerHTML = formattedMessage;
    toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');
    toastEl.classList.add(`bg-${type}`);
    toastEl.setAttribute('data-bs-delay', delay);

    const toastContainer = document.querySelector('.toast-container');
    toastContainer.appendChild(toastEl);

    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}
