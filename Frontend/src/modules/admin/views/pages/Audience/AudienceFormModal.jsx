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
export default function AudienceFormModal({
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
          {isEditing ? "Edit audience" : "Add audience"}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        <CForm id="audience-form" onSubmit={onSubmit}>
          <div className="mb-3">
            <CFormLabel className="app-form-label" htmlFor="audience-code">
              Audience code
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormInput
              id="audience-code"
              className="app-form-control"
              size="sm"
              value={form.code}
              onChange={(event) => onChange("code", event.target.value)}
              maxLength={6}
              invalid={Boolean(validationErrors.code)}
              aria-invalid={Boolean(validationErrors.code)}
              aria-describedby={
                validationErrors.code ? "audience-code-error" : undefined
              }
            />
            {validationErrors.code && (
              <div
                id="audience-code-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.code}
              </div>
            )}
          </div>
          <div className="mb-3">
            <CFormLabel className="app-form-label" htmlFor="audience-name">
              Audience name
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormInput
              id="audience-name"
              className="app-form-control"
              size="sm"
              value={form.name}
              onChange={(event) => onChange("name", event.target.value)}
              maxLength={255}
              invalid={Boolean(validationErrors.name)}
              aria-invalid={Boolean(validationErrors.name)}
              aria-describedby={
                validationErrors.name ? "audience-name-error" : undefined
              }
            />
            {validationErrors.name && (
              <div
                id="audience-name-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.name}
              </div>
            )}
          </div>
          <CFormCheck
            id="audience-status"
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
          form="audience-form"
          disabled={saving}
        >
          {saving ? "Saving..." : isEditing ? "Save changes" : "Create"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
