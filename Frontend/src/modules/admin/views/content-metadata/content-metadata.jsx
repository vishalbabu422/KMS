import { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormCheck,
  CFormFloating,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
} from "@coreui/react";

import "./content-metadata.css";

const initialFormData = {
  content_type: "",
  metadata_title: "",
  metadata_title_hindi: "",
  metadata_description: "",
  metadata_description_hindi: "",
  field_type: "",
  max_length: "",
  is_mandatory: false,
  is_active: false,
  priority_serial_no: "",
};

const fieldTypeOptions = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Textarea" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "date", label: "Date" },
  { value: "dropdown", label: "Dropdown" },
  { value: "radio", label: "Radio Button" },
  { value: "checkbox", label: "Checkbox" },
  { value: "file", label: "File Upload" },
];

const priorityOptions = Array.from({ length: 20 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1),
}));

const ContentMetadata = ({
  initialData = null,
  mode = "add",
  onSubmit,
  metadataTitleOptions = [],
}) => {
  const [formData, setFormData] = useState({
    ...initialFormData,
    ...(initialData || {}),
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.content_type.trim()) {
      newErrors.content_type = "Please enter Content Type.";
    }

    if (!formData.metadata_title) {
      newErrors.metadata_title = "Please select Meta-data Title.";
    }

    if (!formData.metadata_title_hindi.trim()) {
      newErrors.metadata_title_hindi = "Please enter Meta-data Title (Hindi).";
    }

    if (!formData.metadata_description.trim()) {
      newErrors.metadata_description = "Please enter Meta-data Description.";
    }

    if (!formData.metadata_description_hindi.trim()) {
      newErrors.metadata_description_hindi =
        "Please enter Meta-data Description (Hindi).";
    }

    if (!formData.field_type) {
      newErrors.field_type = "Please select Field Type.";
    }

    if (
      formData.max_length !== "" &&
      (!Number.isInteger(Number(formData.max_length)) ||
        Number(formData.max_length) <= 0)
    ) {
      newErrors.max_length = "Please enter a valid maximum length.";
    }

    if (!formData.priority_serial_no) {
      newErrors.priority_serial_no = "Please select Priority Serial No.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    if (typeof onSubmit !== "function") {
      console.error("Please provide an onSubmit function.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        max_length:
          formData.max_length === "" ? null : Number(formData.max_length),
        priority_serial_no: Number(formData.priority_serial_no),
        is_mandatory: Boolean(formData.is_mandatory),
        is_active: Boolean(formData.is_active),
      };

      await onSubmit(payload);
    } catch (error) {
      console.error("Content Metadata submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-metadata-page">
      <CCard className="content-metadata-card">
        <CCardBody>
          <CForm onSubmit={handleSubmit} noValidate>
            <CRow>
              {/* Content Type */}
              <CCol xs={12}>
                <CFormFloating>
                  <CFormInput
                    id="content_type"
                    name="content_type"
                    type="text"
                    placeholder="Enter Content Type"
                    value={formData.content_type}
                    onChange={handleChange}
                    invalid={!!errors.content_type}
                  />

                  <CFormLabel htmlFor="content_type">
                    Content Type <span className="required">*</span>
                  </CFormLabel>
                </CFormFloating>

                {errors.content_type && (
                  <div className="field-error">{errors.content_type}</div>
                )}
              </CCol>

              {/* Metadata Title */}
              <CCol md={6} xs={12}>
                <CFormFloating>
                  <CFormSelect
                    id="metadata_title"
                    name="metadata_title"
                    value={formData.metadata_title}
                    onChange={handleChange}
                    invalid={!!errors.metadata_title}
                  >
                    <option value="">Select Meta-data Title</option>

                    {metadataTitleOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </CFormSelect>

                  <CFormLabel htmlFor="metadata_title">
                    Meta-data Title <span className="required">*</span>
                  </CFormLabel>
                </CFormFloating>

                {errors.metadata_title && (
                  <div className="field-error">{errors.metadata_title}</div>
                )}
              </CCol>

              {/* Metadata Title Hindi */}
              <CCol md={6} xs={12}>
                <CFormFloating>
                  <CFormInput
                    id="metadata_title_hindi"
                    name="metadata_title_hindi"
                    type="text"
                    placeholder="Enter Meta-data Title in Hindi"
                    value={formData.metadata_title_hindi}
                    onChange={handleChange}
                    invalid={!!errors.metadata_title_hindi}
                  />

                  <CFormLabel htmlFor="metadata_title_hindi">
                    Meta-data Title (Hindi) <span className="required">*</span>
                  </CFormLabel>
                </CFormFloating>

                {errors.metadata_title_hindi && (
                  <div className="field-error">
                    {errors.metadata_title_hindi}
                  </div>
                )}
              </CCol>

              {/* Metadata Description */}
              <CCol xs={12}>
                <CFormFloating>
                  <CFormTextarea
                    id="metadata_description"
                    name="metadata_description"
                    placeholder="Enter Meta-data Description"
                    value={formData.metadata_description}
                    onChange={handleChange}
                    invalid={!!errors.metadata_description}
                  />

                  <CFormLabel htmlFor="metadata_description">
                    Meta-data Description <span className="required">*</span>
                  </CFormLabel>
                </CFormFloating>

                {errors.metadata_description && (
                  <div className="field-error">
                    {errors.metadata_description}
                  </div>
                )}
              </CCol>

              {/* Metadata Description Hindi */}
              <CCol xs={12}>
                <CFormFloating>
                  <CFormTextarea
                    id="metadata_description_hindi"
                    name="metadata_description_hindi"
                    placeholder="Enter Meta-data Description in Hindi"
                    value={formData.metadata_description_hindi}
                    onChange={handleChange}
                    invalid={!!errors.metadata_description_hindi}
                  />

                  <CFormLabel htmlFor="metadata_description_hindi">
                    Meta-data Description (Hindi){" "}
                    <span className="required">*</span>
                  </CFormLabel>
                </CFormFloating>

                {errors.metadata_description_hindi && (
                  <div className="field-error">
                    {errors.metadata_description_hindi}
                  </div>
                )}
              </CCol>

              {/* Field Type */}
              <CCol xs={12}>
                <CFormFloating>
                  <CFormSelect
                    id="field_type"
                    name="field_type"
                    value={formData.field_type}
                    onChange={handleChange}
                    invalid={!!errors.field_type}
                  >
                    <option value="">Select Field Type</option>

                    {fieldTypeOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </CFormSelect>

                  <CFormLabel htmlFor="field_type">
                    Field Type <span className="required">*</span>
                  </CFormLabel>
                </CFormFloating>

                {errors.field_type && (
                  <div className="field-error">{errors.field_type}</div>
                )}
              </CCol>

              {/* Max Length */}
              <CCol xs={12}>
                <CFormFloating>
                  <CFormInput
                    id="max_length"
                    name="max_length"
                    type="number"
                    min="1"
                    placeholder="Enter Maximum Length"
                    value={formData.max_length}
                    onChange={handleChange}
                    invalid={!!errors.max_length}
                  />

                  <CFormLabel htmlFor="max_length">Max Length</CFormLabel>
                </CFormFloating>

                {errors.max_length && (
                  <div className="field-error">{errors.max_length}</div>
                )}
              </CCol>

              {/* Mandatory and Active Checkboxes */}
              <CCol xs={12}>
                <div className="metadata-checkboxes">
                  <CFormCheck
                    id="is_mandatory"
                    name="is_mandatory"
                    label="Is Mandatory"
                    checked={Boolean(formData.is_mandatory)}
                    onChange={handleChange}
                  />

                  <CFormCheck
                    id="is_active"
                    name="is_active"
                    label="Activate"
                    checked={Boolean(formData.is_active)}
                    onChange={handleChange}
                  />
                </div>
              </CCol>

              {/* Priority Serial Number */}
              <CCol xs={12}>
                <CFormFloating>
                  <CFormSelect
                    id="priority_serial_no"
                    name="priority_serial_no"
                    value={formData.priority_serial_no}
                    onChange={handleChange}
                    invalid={!!errors.priority_serial_no}
                  >
                    <option value="" disabled>
                      Select Priority Serial No
                    </option>

                    {priorityOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </CFormSelect>

                  <CFormLabel htmlFor="priority_serial_no">
                    Priority Serial No <span className="required">*</span>
                  </CFormLabel>
                </CFormFloating>

                {errors.priority_serial_no && (
                  <div className="field-error">{errors.priority_serial_no}</div>
                )}
              </CCol>

              {/* Submit Button */}
              <CCol xs={12}>
                <div className="d-flex justify-content-end mt-2">
                  <CButton
                    type="submit"
                    color="primary"
                    className="metadata-submit-btn"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Submitting..."
                      : mode === "edit"
                        ? "Update"
                        : "Submit"}
                  </CButton>
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default ContentMetadata;
