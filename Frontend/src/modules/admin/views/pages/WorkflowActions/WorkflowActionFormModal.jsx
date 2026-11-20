import {
  CAlert,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";

export default function WorkflowActionFormModal({
  visible,
  mode,
  form,
  selectedAction,
  formError,
  validationErrors,
  saving,
  formatTime,
  onChange,
  onClose,
  onSubmit,
}) {
  const isViewMode = mode === "view";

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
            ? "Create workflow action"
            : mode === "edit"
              ? "Edit workflow action"
              : "Workflow action details"}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {formError && <CAlert color="danger">{formError}</CAlert>}
        <CForm id="workflow-action-form" onSubmit={onSubmit}>
          <div className="mb-3">
            <CFormLabel
              className="app-form-label"
              htmlFor="workflow-action-name"
            >
              Action name
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormInput
              id="workflow-action-name"
              className="app-form-control"
              size="sm"
              value={form.action_name}
              onChange={(event) => onChange("action_name", event.target.value)}
              maxLength={150}
              readOnly={isViewMode}
              invalid={Boolean(validationErrors.action_name)}
              aria-invalid={Boolean(validationErrors.action_name)}
              aria-describedby={
                validationErrors.action_name
                  ? "workflow-action-name-error"
                  : undefined
              }
            />
            {validationErrors.action_name && (
              <div
                id="workflow-action-name-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.action_name}
              </div>
            )}
          </div>
          {mode !== "create" && (
            <>
              <div className="mb-3">
                <CFormLabel
                  className="app-form-label"
                  htmlFor="workflow-action-status"
                >
                  Status
                </CFormLabel>
                <CFormSelect
                  id="workflow-action-status"
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
                    validationErrors.status
                      ? "workflow-action-status-error"
                      : undefined
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </CFormSelect>
                {validationErrors.status && (
                  <div
                    id="workflow-action-status-error"
                    className="text-danger small mt-1"
                    role="alert"
                  >
                    {validationErrors.status}
                  </div>
                )}
              </div>
              <div className="small text-body-secondary">
                Created: {formatTime(selectedAction?.created)}
              </div>
            </>
          )}
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
          {isViewMode ? "Close" : "Cancel"}
        </CButton>
        {mode !== "view" && (
          <CButton
            color="primary"
            size="sm"
            type="submit"
            form="workflow-action-form"
            disabled={saving}
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
