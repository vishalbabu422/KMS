import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSpinner,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPlus } from "@coreui/icons";
import {
  AdminContentMetadataAPI,
  AdminContentTypeAPI,
} from "@/modules/admin/services/api";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import ContentMetadataFormModal from "./ContentMetadataFormModal";
import ContentMetadataTable from "./ContentMetadataTable";
import { contentMetadataSchema } from "./contentMetadata.schema";
import toaster from "@/utils/toaster";

const EMPTY_FORM = {
  contentTypeId: "",
  title: "",
  titleHindi: "",
  description: "",
  descriptionHindi: "",
  type: "",
  maxLength: "",
  typeData: "",
  customValues: "",
  isMandatory: false,
  priority: "",
  status: true,
};

const PAGE_SIZES = [10, 20, 50];
const TEXT_FIELD_TYPES = ["textbox", "text_area"];
const SELECT_FIELD_TYPES = ["dropdown", "checkbox", "multiple_dropdown"];
const MODULE_SELECT_OPTIONS = [
  { value: "AudienceMasters", label: "Audience" },
  { value: "CategoryMasters", label: "Category" },
  { value: "custom", label: "Custom Values" },
  { value: "LanguageMasters", label: "Language" },
  { value: "OrganisationMasters", label: "Organisation" },
  { value: "TypeMasters", label: "Type" },
];

const normalizeFieldType = (type) => {
  const normalized = String(type ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  if (normalized === "texbox" || normalized === "text_box") return "textbox";
  if (normalized === "textarea") return "text_area";
  return normalized;
};

const getErrorMessage = (requestError, fallback) =>
  requestError.response?.data?.message || fallback;

const normalizeStatus = (status) =>
  status === true ||
  status === 1 ||
  status === "1" ||
  status === "true";

export default function ContentMetadata() {
  const [rows, setRows] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formMode, setFormMode] = useState(null);
  const [selectedMetadata, setSelectedMetadata] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const showToast = useCallback((type, message) => {
    toaster(type, message);
  }, []);

  const fetchContentMetadata = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [metadataResponse, contentTypeResponse] = await Promise.all([
        AdminContentMetadataAPI.getContentMetadata({
          limit: 10000,
          models: "contentType.content_name",
          modelFilter: "{}",
        }),
        AdminContentTypeAPI.getContentTypes({ limit: 10000 }),
      ]);

      const metadataList =
        metadataResponse?.data?.data?.contentMetadataList;
      const contentTypeList = contentTypeResponse?.data?.data;
      if (!Array.isArray(metadataList) || !Array.isArray(contentTypeList)) {
        throw new Error("Content Metadata API returned an invalid response.");
      }

      setContentTypes(
        contentTypeList.map((item) => ({
          id: item.id,
          name: item.content_name ?? "",
        })),
      );
      setRows(
        metadataList.map((item, index) => ({
          id: item.id,
          serialNumber: index + 1,
          contentTypeId: item.content_type_id ?? "",
          contentType:
            item.contentType?.content_name ??
            contentTypeList.find(
              (contentType) =>
                String(contentType.id) === String(item.content_type_id),
            )?.content_name ??
            "",
          priority: item.priority ?? "",
          title: item.title ?? "",
          titleHindi: item.title_hi ?? "",
          description: item.description ?? "",
          descriptionHindi: item.description_hi ?? "",
          type: normalizeFieldType(item.type),
          maxLength: item.max_length ?? "",
          typeData: item.type_data ?? "",
          customValues: item.custom_data ?? "",
          isMandatory: normalizeStatus(item.is_mandatory),
          status: normalizeStatus(item.status),
        })),
      );
    } catch (requestError) {
      console.error(requestError);
      const message = getErrorMessage(
        requestError,
        "Failed to load content metadata. Please try again.",
      );
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchContentMetadata();
  }, [fetchContentMetadata]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      [
        row.contentType,
        row.priority,
        row.title,
        row.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [rows, search]);

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows;

    return [...filteredRows].sort((first, second) => {
      const comparison =
        sortConfig.key === "serialNumber" || sortConfig.key === "priority"
          ? Number(first[sortConfig.key] || 0) -
            Number(second[sortConfig.key] || 0)
          : String(first[sortConfig.key] ?? "")
              .toLowerCase()
              .localeCompare(
                String(second[sortConfig.key] ?? "").toLowerCase(),
              );

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredRows, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const rowStart = sortedRows.length === 0 ? 0 : (safePage - 1) * pageSize;
  const visibleRows = sortedRows.slice(rowStart, rowStart + pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleSort = (key) => {
    setSortConfig((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc" ? "desc" : "asc",
    }));
  };

  const openCreateModal = () => {
    setForm({ ...EMPTY_FORM });
    setSelectedMetadata(null);
    setFormError("");
    setValidationErrors({});
    setFormMode("create");
  };

  const openEditModal = (metadata) => {
    const type = normalizeFieldType(metadata.type);
    const storedTypeData = String(metadata.typeData ?? "");
    const storedCustomValues = String(metadata.customValues ?? "");
    const legacyTypeOption = MODULE_SELECT_OPTIONS.find(
      (option) =>
        option.label === storedCustomValues ||
        option.value === storedCustomValues,
    );
    const storedTypeOption = MODULE_SELECT_OPTIONS.find(
      (option) =>
        option.value === storedTypeData || option.label === storedTypeData,
    );
    const typeData =
      storedTypeOption?.value ||
      storedTypeData ||
      (storedCustomValues
        ? legacyTypeOption?.value ?? "custom"
        : "");

    setForm({
      contentTypeId: String(metadata.contentTypeId),
      title: metadata.title,
      titleHindi: metadata.titleHindi,
      description: metadata.description,
      descriptionHindi: metadata.descriptionHindi,
      type,
      maxLength: String(metadata.maxLength ?? ""),
      typeData,
      customValues:
        typeData === "custom" && storedCustomValues !== "Custom Values"
          ? storedCustomValues
          : "",
      isMandatory: metadata.isMandatory,
      priority: String(metadata.priority),
      status: metadata.status,
    });
    setSelectedMetadata(metadata);
    setFormError("");
    setValidationErrors({});
    setFormMode("edit");
  };

  const closeFormModal = () => {
    if (saving) return;
    setFormMode(null);
    setSelectedMetadata(null);
    setFormError("");
    setValidationErrors({});
  };

  const handleFormChange = (field, value) => {
    if (field === "type") {
      const type = normalizeFieldType(value);
      setForm((current) => ({
        ...current,
        type,
        maxLength: TEXT_FIELD_TYPES.includes(type) ? current.maxLength : "",
        typeData: SELECT_FIELD_TYPES.includes(type) ? current.typeData : "",
        customValues: ["dropdown", "checkbox"].includes(type)
          ? current.customValues
          : "",
      }));
      setValidationErrors((current) => {
        const next = { ...current };
        delete next.type;
        delete next.maxLength;
        delete next.typeData;
        return next;
      });
      return;
    }

    setForm((current) => ({ ...current, [field]: value }));
    setValidationErrors((current) => {
      if (!current[field]) return current;

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const result = contentMetadataSchema.safeParse(form);
    if (!result.success) {
      const errors = Object.fromEntries(
        result.error.issues.map((issue) => [issue.path[0], issue.message]),
      );
      setValidationErrors(errors);
      showToast("warning", result.error.issues[0].message);
      return;
    }

    setValidationErrors({});
    const validatedForm = result.data;
    const payload = {
      ContentMetadata: {
        content_type_id: Number(validatedForm.contentTypeId),
        title: validatedForm.title,
        title_hi: validatedForm.titleHindi,
        description: validatedForm.description,
        description_hi: validatedForm.descriptionHindi,
        type: validatedForm.type,
        max_length:
          TEXT_FIELD_TYPES.includes(validatedForm.type) &&
          validatedForm.maxLength
            ? Number(validatedForm.maxLength)
            : null,
        type_data: SELECT_FIELD_TYPES.includes(validatedForm.type)
          ? validatedForm.typeData
          : "",
        custom_data:
          SELECT_FIELD_TYPES.includes(validatedForm.type) &&
          validatedForm.typeData === "custom"
            ? validatedForm.customValues
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean)
                .join(",")
            : "",
        is_mandatory: validatedForm.isMandatory,
        priority: Number(validatedForm.priority),
        status: validatedForm.status,
      },
    };

    setSaving(true);
    setFormError("");
    try {
      const response =
        formMode === "edit"
          ? await AdminContentMetadataAPI.updateContentMetadata(
              selectedMetadata.id,
              payload,
            )
          : await AdminContentMetadataAPI.createContentMetadata(payload);

      setFormMode(null);
      setSelectedMetadata(null);
      showToast(
        "success",
        response?.data?.message ||
          `Content Metadata ${formMode === "edit" ? "updated" : "created"} successfully.`,
      );
      await fetchContentMetadata();
    } catch (requestError) {
      console.error(requestError);
      const message = getErrorMessage(
        requestError,
        `Failed to ${formMode === "edit" ? "update" : "create"} content metadata. Please try again.`,
      );
      setFormError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteTarget(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;

    setDeleting(true);
    setDeleteError("");
    try {
      const response = await AdminContentMetadataAPI.deleteContentMetadata(
        deleteTarget.id,
      );
      setDeleteTarget(null);
      showToast(
        "success",
        response?.data?.message || "Content Metadata deleted successfully.",
      );
      await fetchContentMetadata();
    } catch (requestError) {
      console.error(requestError);
      const message = getErrorMessage(
        requestError,
        "Failed to delete content metadata. Please try again.",
      );
      setDeleteError(message);
      showToast("error", message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 content-metadata-page shadow-sm overflow-hidden">
          <CCardHeader className="d-flex align-items-center justify-content-between py-2 fw-semibold">
            <span>Content Metadata</span>
            <CTooltip content="Add content metadata" placement="top">
              <CButton
                color="primary"
                size="sm"
                aria-label="Add content metadata"
                onClick={openCreateModal}
              >
                <CIcon icon={cilPlus} />
              </CButton>
            </CTooltip>
          </CCardHeader>

          <CCardBody>
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <CFormLabel
                  customClassName="app-form-label small text-body-secondary"
                  htmlFor="content-metadata-page-size"
                >
                  Show
                </CFormLabel>
                <CFormSelect
                  id="content-metadata-page-size"
                  size="sm"
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                  aria-label="Rows per page"
                  className="app-form-select w-auto content-metadata-page-size"
                >
                  {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </CFormSelect>
                <span>entries</span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <CFormLabel
                  customClassName="app-form-label small text-body-secondary"
                  htmlFor="content-metadata-search"
                >
                  Search:
                </CFormLabel>
                <CFormInput
                  id="content-metadata-search"
                  type="search"
                  size="sm"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search content metadata"
                  className="app-form-control w-auto"
                />
              </div>
            </div>

            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <CSpinner color="primary" aria-label="Loading content metadata" />
              </div>
            ) : error ? (
              <CAlert
                color="danger"
                className="d-flex align-items-center justify-content-between gap-3 mb-0"
              >
                <span>{error}</span>
                <CButton
                  color="danger"
                  variant="outline"
                  size="sm"
                  onClick={fetchContentMetadata}
                >
                  Try again
                </CButton>
              </CAlert>
            ) : (
              <ContentMetadataTable
                rows={visibleRows}
                sortConfig={sortConfig}
                onSort={handleSort}
                rowStart={rowStart}
                rowCount={sortedRows.length}
                page={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
                onEdit={openEditModal}
                onDelete={setDeleteTarget}
              />
            )}
          </CCardBody>
        </CCard>

        <ContentMetadataFormModal
          mode={formMode}
          form={form}
          contentTypes={contentTypes}
          saving={saving}
          error={formError}
          validationErrors={validationErrors}
          onChange={handleFormChange}
          onClose={closeFormModal}
          onSubmit={handleFormSubmit}
        />
        <ConfirmActionModal
          visible={Boolean(deleteTarget)}
          title="Delete content metadata"
          message={
            deleteTarget
              ? `Are you sure you want to delete "${deleteTarget.title}"?`
              : ""
          }
          confirmLabel="Delete"
          loadingLabel="Deleting..."
          loading={deleting}
          error={deleteError}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      </CCol>
    </CRow>
  );
}
