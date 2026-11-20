import { useState } from "react";
import {
  CAlert,
  CButton,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTooltip,
} from "@coreui/react";
import "./ContentMetadata.css";

const TEXT_FIELD_TYPES = ["textbox", "text_area"];
const MODULE_SELECT_TYPES = ["dropdown", "checkbox"];
const MODULE_SELECT_OPTIONS = [
  { value: "AudienceMasters", label: "Audience" },
  { value: "CategoryMasters", label: "Category" },
  { value: "custom", label: "Custom Values" },
  { value: "LanguageMasters", label: "Language" },
  { value: "OrganisationMasters", label: "Organisation" },
  { value: "TypeMasters", label: "Type" },
];
const MULTIPLE_DROPDOWN_TYPE = "multiple_dropdown";
const MULTIPLE_DROPDOWN_OPTIONS = MODULE_SELECT_OPTIONS.filter((option) =>
  ["CategoryMasters", "OrganisationMasters"].includes(option.value),
);
const FIELD_TYPE_OPTIONS = [
  { value: "textbox", label: "Textbox" },
  { value: "text_area", label: "Text Area" },
  { value: "dropdown", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
  { value: "multiple_dropdown", label: "Multiple Dropdown" },
  { value: "date", label: "Date" },
].sort((first, second) => first.label.localeCompare(second.label));

export default function ContentMetadataFormModal({
  mode,
  form,
  contentTypes,
  saving,
  error,
  validationErrors,
  onChange,
  onClose,
  onSubmit,
}) {
  const isEditing = mode === "edit";
  const [optionSearch, setOptionSearch] = useState("");

  const selectedModule = form.typeData ?? "";
  const sortedContentTypes = [...contentTypes].sort((first, second) =>
    String(first.name ?? "").localeCompare(String(second.name ?? ""), undefined, {
      sensitivity: "base",
    }),
  );
  const availableOptions = (
    form.type === MULTIPLE_DROPDOWN_TYPE
      ? MULTIPLE_DROPDOWN_OPTIONS
      : MODULE_SELECT_OPTIONS
  )
    .sort((first, second) =>
      first.label.localeCompare(second.label, undefined, {
        sensitivity: "base",
      }),
    );
  const selectedModuleLabel =
    availableOptions.find((option) => option.value === selectedModule)?.label;
  const optionQuery = optionSearch.trim().toLowerCase();
  const filteredOptions = availableOptions.filter((option) =>
    option.label.toLowerCase().includes(optionQuery),
  );
  const dropdownFieldId =
    form.type === MULTIPLE_DROPDOWN_TYPE
      ? "content-metadata-static-values"
      : "content-metadata-module-values";

  return (
    <CModal
      visible={Boolean(mode)}
      onClose={onClose}
      alignment="center"
      backdrop="static"
      size="lg"
      className="content-metadata-modal"
    >
      <CModalHeader className="py-2 bg-body-tertiary border-bottom">
        <CModalTitle className="fw-semibold">
          {isEditing ? "Edit Content Metadata" : "Add Content Metadata"}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        <CForm  noValidate  id="content-metadata-form" onSubmit={onSubmit}>
          <div className="mb-2">
            <CFormLabel className="app-form-label small" htmlFor="content-metadata-content-type">
              Content Type
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormSelect
              id="content-metadata-content-type"
              className="app-form-select"
              size="sm"
              value={form.contentTypeId}
              onChange={(event) =>
                onChange("contentTypeId", event.target.value)
              }
              invalid={Boolean(validationErrors.contentTypeId)}
              aria-invalid={Boolean(validationErrors.contentTypeId)}
              aria-describedby={
                validationErrors.contentTypeId
                  ? "content-metadata-content-type-error"
                  : undefined
              }
            >
              <option value="">Select Content Type</option>
              {sortedContentTypes.map((contentType) => (
                <option key={contentType.id} value={contentType.id}>
                  {contentType.name}
                </option>
              ))}
            </CFormSelect>
            {validationErrors.contentTypeId && (
              <div
                id="content-metadata-content-type-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.contentTypeId}
              </div>
            )}
          </div>

          <div className="mb-2">
            <CFormLabel className="app-form-label small" htmlFor="content-metadata-title">
              Field Title
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormInput
              id="content-metadata-title"
              className="app-form-control"
              size="sm"
              value={form.title}
              onChange={(event) => onChange("title", event.target.value)}
              maxLength={255}
              invalid={Boolean(validationErrors.title)}
              aria-invalid={Boolean(validationErrors.title)}
              aria-describedby={
                validationErrors.title
                  ? "content-metadata-title-error"
                  : undefined
              }
            />
            {validationErrors.title && (
              <div
                id="content-metadata-title-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.title}
              </div>
            )}
          </div>

          <div className="mb-2">
            <CFormLabel
              className="app-form-label small"
              htmlFor="content-metadata-title-hindi"
            >
              Field Title (Hindi)
            </CFormLabel>
            <CFormInput
              id="content-metadata-title-hindi"
              className="app-form-control"
              size="sm"
              value={form.titleHindi}
              onChange={(event) => onChange("titleHindi", event.target.value)}
              maxLength={255}
              invalid={Boolean(validationErrors.titleHindi)}
              aria-invalid={Boolean(validationErrors.titleHindi)}
              aria-describedby={
                validationErrors.titleHindi
                  ? "content-metadata-title-hindi-error"
                  : undefined
              }
            />
            {validationErrors.titleHindi && (
              <div
                id="content-metadata-title-hindi-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.titleHindi}
              </div>
            )}
          </div>

          <div className="mb-2">
            <CFormLabel className="app-form-label small" htmlFor="content-metadata-description">
              Field Description
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormTextarea
              id="content-metadata-description"
              className="form-control-sm app-form-control"
              value={form.description}
              onChange={(event) =>
                onChange("description", event.target.value)
              }
              rows={2}
              invalid={Boolean(validationErrors.description)}
              aria-invalid={Boolean(validationErrors.description)}
              aria-describedby={
                validationErrors.description
                  ? "content-metadata-description-error"
                  : undefined
              }
            />
            {validationErrors.description && (
              <div
                id="content-metadata-description-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.description}
              </div>
            )}
          </div>

          <div className="mb-2">
            <CFormLabel
              className="app-form-label small"
              htmlFor="content-metadata-description-hindi"
            >
              Field Description (Hindi)
            </CFormLabel>
            <CFormTextarea
              id="content-metadata-description-hindi"
              className="form-control-sm app-form-control"
              value={form.descriptionHindi}
              onChange={(event) =>
                onChange("descriptionHindi", event.target.value)
              }
              rows={2}
              invalid={Boolean(validationErrors.descriptionHindi)}
              aria-invalid={Boolean(validationErrors.descriptionHindi)}
              aria-describedby={
                validationErrors.descriptionHindi
                  ? "content-metadata-description-hindi-error"
                  : undefined
              }
            />
            {validationErrors.descriptionHindi && (
              <div
                id="content-metadata-description-hindi-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.descriptionHindi}
              </div>
            )}
          </div>

          <div className="mb-2">
            <CFormLabel className="app-form-label small" htmlFor="content-metadata-type">
              Field Type
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            </CFormLabel>
            <CFormSelect
              id="content-metadata-type"
              className="app-form-select"
              size="sm"
              value={form.type}
              onChange={(event) => onChange("type", event.target.value)}
              invalid={Boolean(validationErrors.type)}
              aria-invalid={Boolean(validationErrors.type)}
              aria-describedby={
                validationErrors.type ? "content-metadata-type-error" : undefined
              }
            >
              <option value="">Select Field Type</option>
              {FIELD_TYPE_OPTIONS.map((fieldType) => (
                <option key={fieldType.value} value={fieldType.value}>
                  {fieldType.label}
                </option>
              ))}
            </CFormSelect>
            {validationErrors.type && (
              <div
                id="content-metadata-type-error"
                className="text-danger small mt-1"
                role="alert"
              >
                {validationErrors.type}
              </div>
            )}
          </div>

          {TEXT_FIELD_TYPES.includes(form.type) && (
            <div className="mb-2">
              <CFormLabel
                className="app-form-label small"
                htmlFor="content-metadata-max-length"
              >
                Max Length
              </CFormLabel>
              <CFormInput
                id="content-metadata-max-length"
                className="app-form-control"
                size="sm"
                type="number"
                min="0"
                step="1"
                value={form.maxLength}
                onChange={(event) =>
                  onChange("maxLength", event.target.value)
                }
                invalid={Boolean(validationErrors.maxLength)}
                aria-invalid={Boolean(validationErrors.maxLength)}
                aria-describedby={
                  validationErrors.maxLength
                    ? "content-metadata-max-length-error"
                    : undefined
                }
              />
              {validationErrors.maxLength && (
                <div
                  id="content-metadata-max-length-error"
                  className="text-danger small mt-1"
                  role="alert"
                >
                  {validationErrors.maxLength}
                </div>
              )}
            </div>
          )}

          {(MODULE_SELECT_TYPES.includes(form.type) ||
            form.type === MULTIPLE_DROPDOWN_TYPE) && (
              <div className="mb-2">
                <CFormLabel
                  className="app-form-label small"
                  htmlFor={dropdownFieldId}
                >
                  Select Dropdown
                  <span className="text-danger ms-1" aria-hidden="true">
                    *
                  </span>
                </CFormLabel>
                <CDropdown className="w-100">
                  <CDropdownToggle
                    id={dropdownFieldId}
                    color="secondary"
                    variant="outline"
                    className="w-100 text-start app-form-dropdown"
                    aria-label="Select Dropdown"
                    aria-invalid={Boolean(validationErrors.typeData)}
                    aria-describedby={
                      validationErrors.typeData
                        ? "content-metadata-type-data-error"
                        : undefined
                    }
                  >
                    {selectedModuleLabel || "Select Dropdown"}
                  </CDropdownToggle>
                  <CDropdownMenu
                    className="w-100 p-2"
                    style={{ maxHeight: "16rem", overflowY: "auto" }}
                  >
                    <CFormInput
                      type="search"
                      className="app-form-control mb-2"
                      size="sm"
                      value={optionSearch}
                      onChange={(event) => setOptionSearch(event.target.value)}
                      placeholder="Search dropdown"
                      aria-label="Search dropdown"
                    />
                    {filteredOptions.length ? (
                      filteredOptions.map((option) => (
                        <CDropdownItem
                          as="button"
                          type="button"
                          key={option.value}
                          className="app-form-dropdown-option"
                          active={selectedModule === option.value}
                          onClick={() => {
                            onChange("typeData", option.value);
                            setOptionSearch("");
                          }}
                        >
                          {option.label}
                        </CDropdownItem>
                      ))
                    ) : (
                      <span className="dropdown-item-text text-body-secondary">
                        No dropdown fields found
                      </span>
                    )}
                  </CDropdownMenu>
                </CDropdown>
                {validationErrors.typeData && (
                  <div
                    id="content-metadata-type-data-error"
                    className="text-danger small mt-1"
                    role="alert"
                  >
                    {validationErrors.typeData}
                  </div>
                )}
              </div>
            )}

          {MODULE_SELECT_TYPES.includes(form.type) &&
            selectedModule === "custom" && (
              <div className="mb-2">
                <CFormLabel
                  className="app-form-label small"
                  htmlFor="content-metadata-custom-values"
                >
                  Custom Values
                  <CTooltip
                    content="values should be comma seperated"
                    placement="top"
                  >
                    <span
                      className="ms-1 text-primary"
                      role="img"
                      aria-label="Custom values should be comma separated"
                      tabIndex={0}
                    >
                      ⓘ
                    </span>
                  </CTooltip>
                </CFormLabel>
                <CFormTextarea
                  id="content-metadata-custom-values"
                  className="form-control-sm app-form-control"
                  value={form.customValues}
                  onChange={(event) =>
                    onChange("customValues", event.target.value)
                  }
                  placeholder="Enter Custom values with comma separator"
                  rows={2}
                />
              </div>
            )}

          <CRow className="align-items-start">
            <CCol md={4} className="mb-2">
              <CFormLabel className="app-form-label small" htmlFor="content-metadata-priority">
                Priority
                <span className="text-danger ms-1" aria-hidden="true">
                  *
                </span>
              </CFormLabel>
              <CFormInput
                id="content-metadata-priority"
                className="app-form-control"
                size="sm"
                type="number"
                min="1"
                step="1"
                value={form.priority}
                onChange={(event) => onChange("priority", event.target.value)}
                invalid={Boolean(validationErrors.priority)}
                aria-invalid={Boolean(validationErrors.priority)}
                aria-describedby={
                  validationErrors.priority
                    ? "content-metadata-priority-error"
                    : undefined
                }
              />
              {validationErrors.priority && (
                <div
                  id="content-metadata-priority-error"
                  className="text-danger small mt-1"
                  role="alert"
                >
                  {validationErrors.priority}
                </div>
              )}
            </CCol>
            <CCol
              md={8}
              className="mb-2 pt-md-4 d-flex flex-column flex-md-row justify-content-md-center gap-3"
            >
              <CFormCheck
                id="content-metadata-status"
                className="app-form-check app-form-label"
                label="Activate"
                checked={form.status}
                onChange={(event) =>
                  onChange("status", event.target.checked)
                }
              />
              <CFormCheck
                id="content-metadata-mandatory"
                className="app-form-check app-form-label"
                label="Is Mandatory"
                checked={form.isMandatory}
                onChange={(event) =>
                  onChange("isMandatory", event.target.checked)
                }
              />
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter className="py-2 bg-body-tertiary border-top">
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
          form="content-metadata-form"
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
