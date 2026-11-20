import {
  CAlert,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from "@coreui/react";

export default function WorkflowFormModal({
  visible,
  mode,
  form,
  formError,
  validationErrors,
  detailLoading,
  saving,
  onChange,
  onClose,
  onSubmit,
}) {
  const isViewMode = mode === "view";
  const isFormMode = mode === "create" || mode === "edit";

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      alignment="center"
      backdrop="static"
    >
      <CModalHeader className="py-2">
        <CModalTitle>
          {mode === "create"
            ? "Create workflow"
            : mode === "edit"
              ? "Edit workflow"
              : "Workflow details"}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {formError && <CAlert color="danger">{formError}</CAlert>}
        {detailLoading ? (
          <div className="d-flex justify-content-center py-4">
            <CSpinner color="primary" aria-label="Loading workflow details" />
          </div>
        ) : (
          <CForm id="workflow-form" onSubmit={onSubmit}>
            <div className="mb-3">
              <CFormLabel
                className="app-form-label"
                htmlFor="workflow-name"
              >
                Workflow name
                <span className="text-danger ms-1" aria-hidden="true">
                  *
                </span>
              </CFormLabel>
              <CFormInput
                id="workflow-name"
                className="app-form-control"
                size="sm"
                value={form.workflow_name}
                onChange={(event) =>
                  onChange("workflow_name", event.target.value)
                }
                maxLength={150}
                readOnly={isViewMode}
                invalid={Boolean(validationErrors.workflow_name)}
                aria-invalid={Boolean(validationErrors.workflow_name)}
                aria-describedby={
                  validationErrors.workflow_name
                    ? "workflow-name-error"
                    : undefined
                }
              />
              {validationErrors.workflow_name && (
                <div
                  id="workflow-name-error"
                  className="text-danger small mt-1"
                  role="alert"
                >
                  {validationErrors.workflow_name}
                </div>
              )}
            </div>
            <div className="mb-3">
              <CFormLabel
                className="app-form-label"
                htmlFor="workflow-description"
              >
                Description
              </CFormLabel>
              <CFormTextarea
                id="workflow-description"
                className="form-control-sm app-form-control"
                rows={4}
                value={form.workflow_description}
                onChange={(event) =>
                  onChange("workflow_description", event.target.value)
                }
                readOnly={isViewMode}
                invalid={Boolean(validationErrors.workflow_description)}
                aria-invalid={Boolean(validationErrors.workflow_description)}
                aria-describedby={
                  validationErrors.workflow_description
                    ? "workflow-description-error"
                    : undefined
                }
              />
              {validationErrors.workflow_description && (
                <div
                  id="workflow-description-error"
                  className="text-danger small mt-1"
                  role="alert"
                >
                  {validationErrors.workflow_description}
                </div>
              )}
            </div>
            <div className="mb-2">
              <CFormLabel
                className="app-form-label"
                htmlFor="workflow-status"
              >
                Status
              </CFormLabel>
              <CFormSelect
                id="workflow-status"
                className="app-form-select"
                size="sm"
                value={String(form.status)}
                onChange={(event) =>
                  onChange("status", event.target.value === "true")
                }
                disabled={isViewMode}
                invalid={Boolean(validationErrors.status)}
                aria-invalid={Boolean(validationErrors.status)}
                aria-describedby={
                  validationErrors.status ? "workflow-status-error" : undefined
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </CFormSelect>
              {validationErrors.status && (
                <div
                  id="workflow-status-error"
                  className="text-danger small mt-1"
                  role="alert"
                >
                  {validationErrors.status}
                </div>
              )}
            </div>
          </CForm>
        )}
      </CModalBody>
      <CModalFooter className="py-2">
        <CButton
          color="secondary"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={saving || detailLoading}
        >
          {isViewMode ? "Close" : "Cancel"}
        </CButton>
        {isFormMode && (
          <CButton
            color="primary"
            size="sm"
            type="submit"
            form="workflow-form"
            disabled={saving || detailLoading}
          >
            {saving
              ? "Saving..."
              : mode === "edit"
                ? "Save changes"
                : "Create"}
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  );
}
