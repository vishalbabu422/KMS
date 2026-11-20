import {
  CAlert,
  CButton,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
export default function LanguageFormModal({
  mode,
  form,
  saving,
  error,
  validationErrors,
  onChange,
  onClose,
  onSubmit,
}) {
  const isEditing = mode === "edit";

  return (
    <CModal
      visible={Boolean(mode)}
      onClose={onClose}
      alignment="center"
      backdrop="static"
    >
      <CModalHeader className="py-2">
        <CModalTitle>
          {isEditing ? "Edit language" : "Add language"}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        <CForm id="language-form" onSubmit={onSubmit}>
          <div className="mb-3">
            <CFormLabel className="app-form-label" htmlFor="language-code">
              Language code
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormInput
              id="language-code"
              className="app-form-control"
              size="sm"
              value={form.code}
              onChange={(event) => onChange("code", event.target.value)}
              maxLength={7}
              invalid={Boolean(validationErrors.code)}
              aria-invalid={Boolean(validationErrors.code)}
              aria-describedby={
                validationErrors.code ? "language-code-error" : undefined
              }
            />
            {validationErrors.code && (
              <div
                id="language-code-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.code}
              </div>
            )}
          </div>
          <div className="mb-3">
            <CFormLabel className="app-form-label" htmlFor="language-name">
              Language name
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormInput
              id="language-name"
              className="app-form-control"
              size="sm"
              value={form.name}
              onChange={(event) => onChange("name", event.target.value)}
              maxLength={255}
              invalid={Boolean(validationErrors.name)}
              aria-invalid={Boolean(validationErrors.name)}
              aria-describedby={
                validationErrors.name ? "language-name-error" : undefined
              }
            />
            {validationErrors.name && (
              <div
                id="language-name-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.name}
              </div>
            )}
          </div>
          <CFormCheck
            id="language-status"
            className="app-form-check"
            label="Activate"
            checked={form.status}
            onChange={(event) => onChange("status", event.target.checked)}
          />
        </CForm>
      </CModalBody>
      <CModalFooter className="py-2">
        <CButton
          color="secondary"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </CButton>
        <CButton
          color="primary"
          size="sm"
          type="submit"
          form="language-form"
          disabled={saving}
        >
          {saving ? "Saving..." : isEditing ? "Save changes" : "Create"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
