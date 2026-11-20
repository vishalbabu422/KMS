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
  CSpinner,
} from "@coreui/react";

export default function WorkflowRoleFormModal({
  visible,
  mode,
  form,
  selectedRole,
  formError,
  validationErrors,
  detailLoading,
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
            ? "Create workflow role"
            : mode === "edit"
              ? "Edit workflow role"
              : "Workflow role details"}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {detailLoading && (
          <div className="d-flex justify-content-center py-3">
            <CSpinner size="sm" aria-label="Loading workflow role details" />
          </div>
        )}
        {formError && <CAlert color="danger">{formError}</CAlert>}
        <CForm id="workflow-role-form" onSubmit={onSubmit}>
          <div className="mb-3">
            <CFormLabel
              customClassName="app-form-label"
              htmlFor="workflow-role-name"
            >
              Role name
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormInput
              id="workflow-role-name"
              className="app-form-control"
              size="sm"
              value={form.role_name}
              onChange={(event) => onChange("role_name", event.target.value)}
              maxLength={150}
              readOnly={isViewMode}
              disabled={detailLoading || saving}
              invalid={Boolean(validationErrors.role_name)}
              aria-invalid={Boolean(validationErrors.role_name)}
              aria-describedby={
                validationErrors.role_name
                  ? "workflow-role-name-error"
                  : undefined
              }
            />
            {validationErrors.role_name && (
              <div
                id="workflow-role-name-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.role_name}
              </div>
            )}
          </div>
          {mode !== "create" && (
            <>
              <div className="mb-3">
                <CFormLabel
                  customClassName="app-form-label"
                  htmlFor="workflow-role-status"
                >
                  Status
                </CFormLabel>
                <CFormSelect
                  id="workflow-role-status"
                  className="app-form-select"
                  size="sm"
                  value={String(form.status)}
                  onChange={(event) =>
                    onChange("status", event.target.value === "true")
                  }
                  disabled={isViewMode || detailLoading || saving}
                  invalid={Boolean(validationErrors.status)}
                  aria-invalid={Boolean(validationErrors.status)}
                  aria-describedby={
                    validationErrors.status
                      ? "workflow-role-status-error"
                      : undefined
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </CFormSelect>
                {validationErrors.status && (
                  <div
                    id="workflow-role-status-error"
                    className="text-danger small mt-1"
                    role="alert"
                  >
                    {validationErrors.status}
                  </div>
                )}
              </div>
              <div className="small text-body-secondary">
                Created: {formatTime(selectedRole?.created)}
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
          disabled={saving || detailLoading}
        >
          {isViewMode ? "Close" : "Cancel"}
        </CButton>
        {mode !== "view" && (
          <CButton
            color="primary"
            size="sm"
            type="submit"
            form="workflow-role-form"
            disabled={saving || detailLoading}
          >
            {saving ? "Saving..." : mode === "edit" ? "Save changes" : "Create"}
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  );
}
