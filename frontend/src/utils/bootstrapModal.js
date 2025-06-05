import * as bootstrap from 'bootstrap'

export function hideBootstrapModal(modalRef) {
  if (!modalRef?.value) return

  const modalEl = modalRef.value
  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl)

  modalInstance.hide()

  modalEl.addEventListener(
    'hidden.bs.modal',
    () => {
      document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove())
      document.body.classList.remove('modal-open')
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    },
    { once: true },
  )
}
