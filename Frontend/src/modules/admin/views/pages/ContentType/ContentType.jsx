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
import { AdminContentTypeAPI } from "@/modules/admin/services/api";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import ContentTypeFormModal from "./ContentTypeFormModal";
import ContentTypeTable from "./ContentTypeTable";
import { contentTypeSchema } from "./contentType.schema";
import toaster from "@/utils/toaster";

const EMPTY_FORM = {
  contentType: "",
  code: "",
  name: "",
  nameHindi: "",
  description: "",
  workflowId: "",
  status: true,
};

const PAGE_SIZES = [10, 20, 50];
const CONTENT_TYPE_LABELS = {
  Folderish: "Folder",
  NonFile: "Non File",
  File: "File",
};
const WORKFLOW_LABELS = {
  1: "kms_workflow",
  2: "Folder Workflow",
};

const getErrorMessage = (requestError, fallback) =>
  requestError.response?.data?.message || fallback;

const normalizeStatus = (status) =>
  status === true ||
  status === 1 ||
  status === "1" ||
  status === "true";

export default function ContentType() {
  const [rows, setRows] = useState([]);
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
  const [selectedContentType, setSelectedContentType] = useState(null);
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

  const fetchContentTypes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await AdminContentTypeAPI.getContentTypes({
        limit: 10000,
        models: "workflowMapping.workflow_id",
        modelFilter: "{}",
      });
      console.log("Content Type API response:", response?.data?.data);
      const list = response?.data?.data;
      if (!Array.isArray(list)) {
        throw new Error("Content Type API returned an invalid list.");
      }

      setRows(
        list.map((item, index) => {
          const workflowId =
            item.workflowMapping?.workflow_id ?? item.workflow_id ?? "";

          return {
            id: item.id,
            serialNumber: index + 1,
            status: normalizeStatus(item.status),
            code: item.content_code ?? "",
            name: item.content_name ?? "",
            contentType: item.content_type ?? "",
            workflowId: String(workflowId),
            workflowName: WORKFLOW_LABELS[workflowId] ?? "",
            nameHindi: item.content_name_hi ?? "",
            description: item.content_description ?? "",
          };
        }),
      );
    } catch (requestError) {
      console.error(requestError);
      const message = getErrorMessage(
        requestError,
        "Failed to load content types. Please try again.",
      );
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchContentTypes();
  }, [fetchContentTypes]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      [
        row.code,
        row.name,
        row.contentType,
        CONTENT_TYPE_LABELS[row.contentType],
        row.workflowName,
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
        sortConfig.key === "serialNumber"
          ? first.serialNumber - second.serialNumber
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
    setSelectedContentType(null);
    setFormError("");
    setValidationErrors({});
    setFormMode("create");
  };

  const openEditModal = (contentType) => {
    setForm({
      contentType: contentType.contentType,
      code: contentType.code,
      name: contentType.name,
      nameHindi: contentType.nameHindi,
      description: contentType.description,
      workflowId: contentType.workflowId,
      status: contentType.status,
    });
    setSelectedContentType(contentType);
    setFormError("");
    setValidationErrors({});
    setFormMode("edit");
  };

  const closeFormModal = () => {
    if (saving) return;
    setFormMode(null);
    setSelectedContentType(null);
    setFormError("");
    setValidationErrors({});
  };

  const handleFormChange = (field, value) => {
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
    const result = contentTypeSchema.safeParse(form);
    if (!result.success) {
      const errors = Object.fromEntries(
        result.error.issues.map((issue) => [issue.path[0], issue.message]),
      );
      setValidationErrors(errors);
      showToast("warning", result.error.issues[0].message);
      return;
    }

    setValidationErrors({});
    const {
      contentType,
      code,
      name,
      nameHindi,
      description,
      workflowId,
      status,
    } = result.data;
    const payload = {
      content_type: contentType,
      content_code: code,
      content_name: name,
      content_name_hi: nameHindi,
      content_description: description,
      workflow_id: Number(workflowId),
      status,
    };

    setSaving(true);
    setFormError("");
    try {
      const response =
        formMode === "edit"
          ? await AdminContentTypeAPI.updateContentType(
            selectedContentType.id,
            payload,
          )
          : await AdminContentTypeAPI.createContentType(payload);

      setFormMode(null);
      setSelectedContentType(null);
      showToast(
        "success",
        response?.data?.message ||
        `Content Type ${formMode === "edit" ? "updated" : "created"} successfully.`,
      );
      await fetchContentTypes();
    } catch (requestError) {
      console.error(requestError);
      const message = getErrorMessage(
        requestError,
        `Failed to ${formMode === "edit" ? "update" : "create"} content type. Please try again.`,
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
      const response = await AdminContentTypeAPI.deleteContentType(
        deleteTarget.id,
      );
      setDeleteTarget(null);
      showToast(
        "success",
        response?.data?.message || "Content Type deleted successfully.",
      );
      await fetchContentTypes();
    } catch (requestError) {
      console.error(requestError);
      const message = getErrorMessage(
        requestError,
        "Failed to delete content type. Please try again.",
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
        <CCard className="mb-4">
          <CCardHeader className="d-flex align-items-center justify-content-between">
            <span>Content Type</span>
            <CTooltip content="Add content type" placement="top">
              <CButton
                color="primary"
                size="sm"
                aria-label="Add content type"
                onClick={openCreateModal}
              >
                <CIcon icon={cilPlus} />
              </CButton>
            </CTooltip>
          </CCardHeader>

          <CCardBody>
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <CFormLabel customClassName="app-form-label" htmlFor="content-type-page-size">Show</CFormLabel>
                <CFormSelect
                  id="content-type-page-size"
                  className="app-form-select w-auto"
                  size="sm"
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                  aria-label="Rows per page"
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
                <CFormLabel customClassName="app-form-label" htmlFor="content-type-search">Search:</CFormLabel>
                <CFormInput
                  id="content-type-search"
                  className="app-form-control w-auto"
                  type="search"
                  size="sm"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search content types"
                />
              </div>
            </div>

            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <CSpinner color="primary" aria-label="Loading content types" />
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
                  onClick={fetchContentTypes}
                >
                  Try again
                </CButton>
              </CAlert>
            ) : (
              <ContentTypeTable
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

        <ContentTypeFormModal
          mode={formMode}
          form={form}
          saving={saving}
          error={formError}
          validationErrors={validationErrors}
          onChange={handleFormChange}
          onClose={closeFormModal}
          onSubmit={handleFormSubmit}
        />
        <ConfirmActionModal
          visible={Boolean(deleteTarget)}
          title="Delete content type"
          message={
            deleteTarget
              ? `Are you sure you want to delete "${deleteTarget.name}"?`
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
