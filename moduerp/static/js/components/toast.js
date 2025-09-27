function showToast({ title = "Announcement", message = "", type = "info", delay = 3000 }) {
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
    toastEl.querySelector('.toast-body').textContent = message;
    toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');
    toastEl.classList.add(`bg-${type}`);
    toastEl.setAttribute('data-bs-delay', delay);

    const toastContainer = document.querySelector('.toast-container');
    toastContainer.appendChild(toastEl);

    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}
