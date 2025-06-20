import * as bootstrap from 'bootstrap';

/**
 * Show Bootstrap modal programmatically
 * @param {Ref<HTMLElement>} modalRef
 */
export function showBootstrapModal(modalRef) {
  if (!modalRef?.value) return;

  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalRef.value);
  modalInstance.show();
}

/**
 * Hide Bootstrap modal programmatically and cleanup backdrop
 * @param {Ref<HTMLElement>} modalRef
 */
export function hideBootstrapModal(modalRef) {
  if (!modalRef?.value) return;

  const modalEl = modalRef.value;
  const modalInstance = bootstrap.Modal.getInstance(modalEl);

  if (modalInstance) {
    modalInstance.hide();

    // Cleanup after modal is hidden
    modalEl.addEventListener(
      'hidden.bs.modal',
      () => {
        // Fallback to remove any stuck backdrop and reset scroll
        document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
      },
      { once: true }
    );
  }
}
