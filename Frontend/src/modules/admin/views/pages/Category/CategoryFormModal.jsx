import { useMemo } from "react";
import {
  CAlert,
  CButton,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";

const getParentPath = (parentId, rows) => {
  const rowsById = new Map(rows.map((row) => [String(row.id), row]));
  const path = [];
  const visited = new Set();
  let current = rowsById.get(String(parentId));

  while (current && !visited.has(String(current.id))) {
    visited.add(String(current.id));
    path.push(current);
    current = rowsById.get(String(current.parentId));
  }

  return path.reverse();
};

export default function CategoryFormModal({
  mode,
  form,
  rows,
  selectedId,
  saving,
  error,
  validationErrors,
  onChange,
  onClose,
  onSubmit,
}) {
  const isEditing = mode === "edit";

  const parentOptions = useMemo(() => {
    const excludedIds = new Set(
      selectedId == null ? [] : [String(selectedId)],
    );
    let foundDescendant = true;

    while (foundDescendant) {
      foundDescendant = false;
      rows.forEach((row) => {
        if (
          !excludedIds.has(String(row.id)) &&
          excludedIds.has(String(row.parentId))
        ) {
          excludedIds.add(String(row.id));
          foundDescendant = true;
        }
      });
    }

    return rows
      .filter((row) => !excludedIds.has(String(row.id)))
      .sort((first, second) =>
        String(first.name ?? "").localeCompare(String(second.name ?? ""), undefined, {
          sensitivity: "base",
        }),
      );
  }, [rows, selectedId]);

  const selectedPath = useMemo(
    () => getParentPath(form.parentId, parentOptions),
    [form.parentId, parentOptions],
  );
  const rootOptions = parentOptions.filter(
    (row) => Number(row.parentId) === 0,
  );

  return (
    <CModal
      visible={Boolean(mode)}
      onClose={onClose}
      alignment="center"
      backdrop="static"
    >
      <CModalHeader className="py-2">
        <CModalTitle>
          {isEditing ? "Edit category" : "Add category"}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        <CForm id="category-form" onSubmit={onSubmit}>
          <div className="mb-3">
            <CFormLabel className="app-form-label" htmlFor="category-code">
              Category code
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormInput
              id="category-code"
              className="app-form-control"
              size="sm"
              value={form.code}
              onChange={(event) => onChange("code", event.target.value)}
              maxLength={10}
              invalid={Boolean(validationErrors.code)}
              aria-invalid={Boolean(validationErrors.code)}
              aria-describedby={
                validationErrors.code ? "category-code-error" : undefined
              }
            />
            {validationErrors.code && (
              <div
                id="category-code-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.code}
              </div>
            )}
          </div>
          <div className="mb-3">
            <CFormLabel className="app-form-label" htmlFor="category-name">
              Category name
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormInput
              id="category-name"
              className="app-form-control"
              size="sm"
              value={form.name}
              onChange={(event) => onChange("name", event.target.value)}
              maxLength={255}
              invalid={Boolean(validationErrors.name)}
              aria-invalid={Boolean(validationErrors.name)}
              aria-describedby={
                validationErrors.name ? "category-name-error" : undefined
              }
            />
            {validationErrors.name && (
              <div
                id="category-name-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.name}
              </div>
            )}
          </div>
          <div className="mb-3">
            <CFormLabel
              className="app-form-label"
              htmlFor="category-parent-0"
            >
              Root Category
            </CFormLabel>
            <CFormSelect
              id="category-parent-0"
              className="app-form-select"
              size="sm"
              value={selectedPath[0] ? String(selectedPath[0].id) : ""}
              onChange={(event) =>
                onChange("parentId", event.target.value || "0")
              }
              aria-label="Select root category"
            >
              <option value="">Select Parent</option>
              {rootOptions.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                </option>
              ))}
            </CFormSelect>
          </div>
          {selectedPath.map((parent, index) => {
            const childOptions = parentOptions.filter(
              (row) => String(row.parentId) === String(parent.id),
            );
            if (!childOptions.length) return null;

            const selectedChild = selectedPath[index + 1];
            const selectId = `category-parent-${index + 1}`;

            return (
              <div className="mb-3" key={parent.id}>
                <CFormLabel className="app-form-label" htmlFor={selectId}>
                  {parent.name}
                </CFormLabel>
                <CFormSelect
                  id={selectId}
                  className="app-form-select"
                  size="sm"
                  value={selectedChild ? String(selectedChild.id) : ""}
                  onChange={(event) =>
                    onChange(
                      "parentId",
                      event.target.value || String(parent.id),
                    )
                  }
                  aria-label={`Select category under ${parent.name}`}
                >
                  <option value="">Select</option>
                  {childOptions.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.name}
                    </option>
                  ))}
                </CFormSelect>
              </div>
            );
          })}
          <CFormCheck
            id="category-status"
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
          form="category-form"
          disabled={saving}
        >
          {saving ? "Saving..." : isEditing ? "Save changes" : "Create"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
