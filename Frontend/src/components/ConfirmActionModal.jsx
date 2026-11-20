import {
  CAlert,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import "./ConfirmActionModal.css";

export default function ConfirmActionModal({
  visible,
  title,
  message,
  confirmLabel,
  loadingLabel = "Processing...",
  confirmColor = "danger",
  loading = false,
  error = "",
  onClose,
  onConfirm,
}) {
  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <CModal
      visible={visible}
      onClose={handleClose}
      alignment="center"
      backdrop="static"
      className="confirm-action-modal"
    >
      <CModalHeader className="py-2 confirm-action-modal-header">
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        {message}
      </CModalBody>
      <CModalFooter className="py-2">
        <CButton
          color="secondary"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={handleClose}
        >
          Cancel
        </CButton>
        <CButton
          color={confirmColor}
          size="sm"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? loadingLabel : confirmLabel}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
