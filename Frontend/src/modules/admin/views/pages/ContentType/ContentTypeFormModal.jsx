import {
  CAlert,
  CButton,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
export default function ContentTypeFormModal({
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
      size="lg"
    >
      <CModalHeader className="py-2">
        <CModalTitle>
          {isEditing ? "Edit Content Type" : "Add Content Type"}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        <CForm id="content-type-form" onSubmit={onSubmit}>
          <div className="mb-3">
            <CFormLabel className="app-form-label" htmlFor="content-type-kind">
              Content Type
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormSelect
              id="content-type-kind"
              className="app-form-select"
              size="sm"
              value={form.contentType}
              onChange={(event) =>
                onChange("contentType", event.target.value)
              }
              invalid={Boolean(validationErrors.contentType)}
              aria-invalid={Boolean(validationErrors.contentType)}
              aria-describedby={
                validationErrors.contentType
                  ? "content-type-kind-error"
                  : undefined
              }
            >
              <option value="">Select Content Type</option>
              <option value="Folderish">Folder</option>
              <option value="NonFile">Non File</option>
              <option value="File">File</option>
            </CFormSelect>
            {validationErrors.contentType && (
              <div
                id="content-type-kind-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.contentType}
              </div>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel className="app-form-label" htmlFor="content-type-code">
              Content Code
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormInput
              id="content-type-code"
              className="app-form-control"
              size="sm"
              value={form.code}
              onChange={(event) => onChange("code", event.target.value)}
              maxLength={100}
              invalid={Boolean(validationErrors.code)}
              aria-invalid={Boolean(validationErrors.code)}
              aria-describedby={
                validationErrors.code ? "content-type-code-error" : undefined
              }
            />
            {validationErrors.code && (
              <div
                id="content-type-code-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.code}
              </div>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel className="app-form-label" htmlFor="content-type-name">
              Content Name
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormInput
              id="content-type-name"
              className="app-form-control"
              size="sm"
              value={form.name}
              onChange={(event) => onChange("name", event.target.value)}
              maxLength={255}
              invalid={Boolean(validationErrors.name)}
              aria-invalid={Boolean(validationErrors.name)}
              aria-describedby={
                validationErrors.name ? "content-type-name-error" : undefined
              }
            />
            {validationErrors.name && (
              <div
                id="content-type-name-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.name}
              </div>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel className="app-form-label" htmlFor="content-type-name-hindi">
              Content Name (Hindi)
            </CFormLabel>
            <CFormInput
              id="content-type-name-hindi"
              className="app-form-control"
              size="sm"
              value={form.nameHindi}
              onChange={(event) => onChange("nameHindi", event.target.value)}
              maxLength={255}
              invalid={Boolean(validationErrors.nameHindi)}
              aria-invalid={Boolean(validationErrors.nameHindi)}
              aria-describedby={
                validationErrors.nameHindi
                  ? "content-type-name-hindi-error"
                  : undefined
              }
            />
            {validationErrors.nameHindi && (
              <div
                id="content-type-name-hindi-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.nameHindi}
              </div>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel className="app-form-label" htmlFor="content-type-description">
              Content Description
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormTextarea
              id="content-type-description"
              className="form-control-sm app-form-control"
              value={form.description}
              onChange={(event) =>
                onChange("description", event.target.value)
              }
              maxLength={500}
              rows={3}
              invalid={Boolean(validationErrors.description)}
              aria-invalid={Boolean(validationErrors.description)}
              aria-describedby={
                validationErrors.description
                  ? "content-type-description-error"
                  : undefined
              }
            />
            {validationErrors.description && (
              <div
                id="content-type-description-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.description}
              </div>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel className="app-form-label" htmlFor="content-type-workflow">
              Map WorkFlow
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormSelect
              id="content-type-workflow"
              className="app-form-select"
              size="sm"
              value={form.workflowId}
              onChange={(event) => onChange("workflowId", event.target.value)}
              invalid={Boolean(validationErrors.workflowId)}
              aria-invalid={Boolean(validationErrors.workflowId)}
              aria-describedby={
                validationErrors.workflowId
                  ? "content-type-workflow-error"
                  : undefined
              }
            >
              <option value="">Select Workflow</option>
              <option value="1">kms_workflow</option>
              <option value="2">Folder Workflow</option>
            </CFormSelect>
            {validationErrors.workflowId && (
              <div
                id="content-type-workflow-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.workflowId}
              </div>
            )}
          </div>

          <CFormCheck
            id="content-type-status"
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
          form="content-type-form"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : isEditing
              ? "Save changes"
              : "Create"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
