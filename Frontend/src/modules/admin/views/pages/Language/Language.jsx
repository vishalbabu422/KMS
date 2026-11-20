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
import { AdminLanguageAPI } from "@/modules/admin/services/api";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import LanguageFormModal from "./LanguageFormModal";
import LanguageTable from "./LanguageTable";
import { languageSchema } from "./language.schema";
import toaster from "@/utils/toaster";

const EMPTY_FORM = {
  code: "",
  name: "",
  status: true,
};

const PAGE_SIZES = [10, 20, 50];

const getErrorMessage = (requestError, fallback) =>
  requestError.response?.data?.message || fallback;

export default function AdminLanguage() {
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
  const [selectedLanguage, setSelectedLanguage] = useState(null);
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

  const fetchLanguages = useCallback(
    async ({ notifySuccess = false } = {}) => {
      setLoading(true);
      setError("");

      try {
        const response = await AdminLanguageAPI.getLanguages({ limit: 10000 });
        const list = response?.data?.data;
        if (!Array.isArray(list)) {
          throw new Error("Language API returned an invalid list.");
        }

        setRows(
          list.map((item, index) => ({
            id: item.id,
            serialNumber: index + 1,
            code: item.language_code ?? "",
            name: item.name ?? "",
            status:
              item.status === true ||
              item.status === 1 ||
              item.status === "1" ||
              item.status === "true",
          })),
        );
        if (notifySuccess) {
          showToast("success", "Languages loaded successfully.");
        }
      } catch (requestError) {
        console.error(requestError);
        const message = "Failed to load languages. Please try again.";
        setError(message);
        showToast("error", message);
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      [row.code, row.name].join(" ").toLowerCase().includes(query),
    );
  }, [rows, search]);

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows;

    return [...filteredRows].sort((first, second) => {
      const firstValue = String(first[sortConfig.key] ?? "").toLowerCase();
      const secondValue = String(second[sortConfig.key] ?? "").toLowerCase();
      const comparison =
        sortConfig.key === "serialNumber"
          ? first.serialNumber - second.serialNumber
          : firstValue.localeCompare(secondValue);

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
    setSelectedLanguage(null);
    setFormError("");
    setValidationErrors({});
    setFormMode("create");
  };

  const openEditModal = (language) => {
    setForm({
      code: language.code,
      name: language.name,
      status: language.status,
    });
    setSelectedLanguage(language);
    setFormError("");
    setValidationErrors({});
    setFormMode("edit");
  };

  const closeFormModal = () => {
    if (saving) return;
    setFormMode(null);
    setSelectedLanguage(null);
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
    const result = languageSchema.safeParse(form);
    if (!result.success) {
      const errors = Object.fromEntries(
        result.error.issues.map((issue) => [issue.path[0], issue.message]),
      );
      setValidationErrors(errors);
      showToast("warning", result.error.issues[0].message);
      return;
    }

    setValidationErrors({});
    const { code, name, status } = result.data;
    const payload = {
      languageMaster: {
        language_code: code,
        name,
        status,
      },
    };

    setSaving(true);
    setFormError("");
    try {
      let response;
      if (formMode === "edit") {
        response = await AdminLanguageAPI.updateLanguage(
          selectedLanguage.id,
          payload,
        );
      } else {
        response = await AdminLanguageAPI.createLanguage(payload);
      }
      setFormMode(null);
      setSelectedLanguage(null);
      showToast(
        "success",
        response?.data?.message ||
          `Language ${formMode === "edit" ? "updated" : "created"} successfully.`,
      );
      await fetchLanguages();
    } catch (requestError) {
      console.error(requestError);
      const message = getErrorMessage(
        requestError,
        `Failed to ${formMode === "edit" ? "update" : "create"} language. Please try again.`,
      );
      setFormError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (language) => {
    setDeleteTarget(language);
    setDeleteError("");
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
      const response = await AdminLanguageAPI.deleteLanguage(deleteTarget.id);
      setDeleteTarget(null);
      showToast(
        "success",
        response?.data?.message || "Language deleted successfully.",
      );
      await fetchLanguages();
    } catch (requestError) {
      console.error(requestError);
      const message = getErrorMessage(
        requestError,
        "Failed to delete language. Please try again.",
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
            <span>Language</span>
            <CTooltip content="Add language" placement="top">
              <CButton
                color="primary"
                size="sm"
                aria-label="Add language"
                onClick={openCreateModal}
              >
                <CIcon icon={cilPlus} />
              </CButton>
            </CTooltip>
          </CCardHeader>

          <CCardBody>
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <CFormLabel customClassName="app-form-label" htmlFor="language-page-size">Show</CFormLabel>
                <CFormSelect
                  id="language-page-size"
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
                <CFormLabel customClassName="app-form-label" htmlFor="language-search">Search:</CFormLabel>
                <CFormInput
                  id="language-search"
                  className="app-form-control w-auto"
                  type="search"
                  size="sm"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search languages"
                />
              </div>
            </div>

            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <CSpinner color="primary" aria-label="Loading languages" />
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
                  onClick={() => fetchLanguages({ notifySuccess: true })}
                >
                  Try again
                </CButton>
              </CAlert>
            ) : (
              <LanguageTable
                rows={visibleRows}
                sortConfig={sortConfig}
                onSort={handleSort}
                rowStart={rowStart}
                rowCount={sortedRows.length}
                page={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            )}
          </CCardBody>
        </CCard>

        <LanguageFormModal
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
          title="Delete language"
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
