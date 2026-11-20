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
import { AdminCategoryAPI } from "@/modules/admin/services/api";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import CategoryFormModal from "./CategoryFormModal";
import CategoryTable from "./CategoryTable";
import { categorySchema } from "./category.schema";
import toaster from "@/utils/toaster";

const EMPTY_FORM = {
  code: "",
  name: "",
  parentId: "0",
  status: true,
};

const PAGE_SIZES = [10, 20, 50];

const getErrorMessage = (requestError, fallback) =>
  requestError.response?.data?.message || fallback;

export default function AdminCategory() {
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
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  const fetchCategories = useCallback(async ({ notifySuccess = false } = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await AdminCategoryAPI.getCategories({ limit: 10000 });
      const list = response?.data?.data;
      if (!Array.isArray(list)) {
        throw new Error("Category API returned an invalid list.");
      }

      const namesById = new Map(
        list.map((item) => [String(item.id), item.name ?? ""]),
      );
      setRows(
        list.map((item, index) => ({
          id: item.id,
          serialNumber: index + 1,
          code: item.category_code ?? "",
          name: item.name ?? "",
          parent:
            item.Parent?.name ??
            namesById.get(String(item.parent_id)) ??
            "",
          parentId: item.parent_id ?? 0,
          status:
            item.status === true ||
            item.status === 1 ||
            item.status === "1" ||
            item.status === "true",
        })),
      );
      if (notifySuccess) {
        showToast("success", "Categories loaded successfully.");
      }
    } catch (requestError) {
      console.error(requestError);
      const message = "Failed to load categories. Please try again.";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      [row.code, row.name, row.parent].join(" ").toLowerCase().includes(query),
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
    setSelectedCategory(null);
    setFormError("");
    setValidationErrors({});
    setFormMode("create");
  };

  const openEditModal = (category) => {
    setForm({
      code: category.code,
      name: category.name,
      parentId: String(category.parentId),
      status: category.status,
    });
    setSelectedCategory(category);
    setFormError("");
    setValidationErrors({});
    setFormMode("edit");
  };

  const closeFormModal = () => {
    if (saving) return;
    setFormMode(null);
    setSelectedCategory(null);
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
    const result = categorySchema.safeParse(form);
    if (!result.success) {
      const errors = Object.fromEntries(
        result.error.issues.map((issue) => [issue.path[0], issue.message]),
      );
      setValidationErrors(errors);
      showToast("warning", result.error.issues[0].message);
      return;
    }

    setValidationErrors({});
    const { code, name, parentId, status } = result.data;
    const payload = {
      categoryMaster: {
        category_code: code,
        name,
        parent_id: Number(parentId) || 0,
        status,
      },
    };

    setSaving(true);
    setFormError("");
    try {
      let response;
      if (formMode === "edit") {
        response = await AdminCategoryAPI.updateCategory(
          selectedCategory.id,
          payload,
        );
      } else {
        response = await AdminCategoryAPI.createCategory(payload);
      }
      setFormMode(null);
      setSelectedCategory(null);
      showToast(
        "success",
        response?.data?.message ||
        `Category ${formMode === "edit" ? "updated" : "created"} successfully.`,
      );
      await fetchCategories();
    } catch (requestError) {
      console.error(requestError);
      const message = getErrorMessage(
        requestError,
        `Failed to ${formMode === "edit" ? "update" : "create"} category. Please try again.`,
      );
      setFormError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (category) => {
    setDeleteTarget(category);
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
      const response = await AdminCategoryAPI.deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      showToast(
        "success",
        response?.data?.message || "Category deleted successfully.",
      );
      await fetchCategories();
    } catch (requestError) {
      console.error(requestError);
      const message = getErrorMessage(
        requestError,
        "Failed to delete category. Please try again.",
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
            <span>Category</span>
            <CTooltip content="Add category" placement="top">
              <CButton
                color="primary"
                size="sm"
                aria-label="Add category"
                onClick={openCreateModal}
              >
                <CIcon icon={cilPlus} />
              </CButton>
            </CTooltip>
          </CCardHeader>

          <CCardBody>
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <CFormLabel customClassName="app-form-label" htmlFor="category-page-size">Show</CFormLabel>
                <CFormSelect
                  id="category-page-size"
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
                <CFormLabel customClassName="app-form-label" htmlFor="category-search">Search:</CFormLabel>
                <CFormInput
                  id="category-search"
                  className="app-form-control w-auto"
                  type="search"
                  size="sm"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search categories"
                />
              </div>
            </div>

            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <CSpinner color="primary" aria-label="Loading categories" />
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
                  onClick={() => fetchCategories({ notifySuccess: true })}
                >
                  Try again
                </CButton>
              </CAlert>
            ) : (
              <CategoryTable
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

        <CategoryFormModal
          mode={formMode}
          form={form}
          rows={rows}
          selectedId={selectedCategory?.id}
          saving={saving}
          error={formError}
          validationErrors={validationErrors}
          onChange={handleFormChange}
          onClose={closeFormModal}
          onSubmit={handleFormSubmit}
        />
        <ConfirmActionModal
          visible={Boolean(deleteTarget)}
          title="Delete category"
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
