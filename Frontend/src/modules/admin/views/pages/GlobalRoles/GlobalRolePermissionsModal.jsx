import {
  CAlert,
  CButton,
  CFormCheck,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";

export default function GlobalRolePermissionsModal({
  visible,
  selectedRole,
  menuList,
  checkedMenus,
  saveError,
  saveSuccess,
  saving,
  isParentChecked,
  onToggleParent,
  onToggleChild,
  onClose,
  onSave,
}) {
  return (
    <CModal
      visible={visible}
      onClose={onClose}
      backdrop="static"
      alignment="center"
      size="lg"
    >
      <CModalHeader className="py-2">
        <CModalTitle>Role Permissions - {selectedRole?.name}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {saveError && <CAlert color="danger">{saveError}</CAlert>}
        {saveSuccess && <CAlert color="success">{saveSuccess}</CAlert>}

        {menuList.length === 0 ? (
          <div className="text-center text-body-secondary py-4">
            No permissions available.
          </div>
        ) : (
          menuList.map((parent) => (
            <div key={parent.id} className="border rounded p-3 mb-3">
              <CFormCheck
                id={`parent-${parent.id}`}
                className="app-form-check"
                label={parent.module_name}
                checked={isParentChecked(parent)}
                onChange={() => onToggleParent(parent)}
              />

              {(parent.children ?? []).length > 0 && (
                <div className="ms-4 mt-3">
                  {(parent.children ?? []).map((child) => (
                    <CFormCheck
                      key={child.id}
                      id={`child-${child.id}`}
                      className="app-form-check mb-2"
                      label={child.module_name}
                      checked={checkedMenus.includes(String(child.id))}
                      onChange={() => onToggleChild(child, parent)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
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
          onClick={onSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
