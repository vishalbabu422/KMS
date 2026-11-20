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
import { AdminOrganisationAPI } from "@/modules/admin/services/api";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import OrganisationFormModal from "./OrganisationFormModal";
import OrganisationTable from "./OrganisationTable";
import { organisationSchema } from "./organisation.schema";
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

export default function AdminOrganisation() {
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
  const [selectedOrganisation, setSelectedOrganisation] = useState(null);
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

  const fetchOrganisations = useCallback(async ({ notifySuccess = false } = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await AdminOrganisationAPI.getOrganisation({
        limit: 10000,
      });
      const list = response?.data?.data;
      if (!Array.isArray(list)) {
        throw new Error("Organisation API returned an invalid list.");
      }

      setRows(
        list.map((item, index) => ({
          id: item.id,
          serialNumber: index + 1,
          code: item.organisation_code ?? "",
          name: item.name ?? "",
          parent: item.Parent?.name ?? "",
          parentId: item.parent_id ?? 0,
          status:
            item.status === true ||
            item.status === 1 ||
            item.status === "1" ||
            item.status === "true",
        })),
      );
      if (notifySuccess) {
        showToast("success", "Organisations loaded successfully.");
      }
    } catch (requestError) {
      console.error(requestError);
      const message = "Failed to load organisations. Please try again.";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchOrganisations();
  }, [fetchOrganisations]);

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
    setSelectedOrganisation(null);
    setFormError("");
    setValidationErrors({});
    setFormMode("create");
  };

  const openEditModal = (organisation) => {
    setForm({
      code: organisation.code,
      name: organisation.name,
      parentId: String(organisation.parentId),
      status: organisation.status,
    });
    setSelectedOrganisation(organisation);
    setFormError("");
    setValidationErrors({});
    setFormMode("edit");
  };

  const closeFormModal = () => {
    if (saving) return;
    setFormMode(null);
    setSelectedOrganisation(null);
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
    const result = organisationSchema.safeParse(form);
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
      organisationMaster: {
        organisation_code: code,
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
        response = await AdminOrganisationAPI.updateOrganisation(
          selectedOrganisation.id,
          payload,
        );
      } else {
        response = await AdminOrganisationAPI.createOrganisation(payload);
      }
      setFormMode(null);
      setSelectedOrganisation(null);
      showToast(
        "success",
        response?.data?.message ||
        `Organisation ${formMode === "edit" ? "updated" : "created"} successfully.`,
      );
      await fetchOrganisations();
    } catch (requestError) {
      console.error(requestError);
      const message = getErrorMessage(
        requestError,
        `Failed to ${formMode === "edit" ? "update" : "create"} organisation. Please try again.`,
      );
      setFormError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (organisation) => {
    setDeleteTarget(organisation);
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
      const response = await AdminOrganisationAPI.deleteOrganisation(
        deleteTarget.id,
      );
      setDeleteTarget(null);
      showToast(
        "success",
        response?.data?.message || "Organisation deleted successfully.",
      );
      await fetchOrganisations();
    } catch (requestError) {
      console.error(requestError);
      const message = getErrorMessage(
        requestError,
        "Failed to delete organisation. Please try again.",
      );
      setDeleteError(message);
      showToast("error", message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex align-items-center justify-content-between">
              <span>Organisation</span>
              <CTooltip content="Add organisation" placement="top">
                <CButton
                  color="primary"
                  size="sm"
                  aria-label="Add organisation"
                  onClick={openCreateModal}
                >
                  <CIcon icon={cilPlus} />
                </CButton>
              </CTooltip>
            </CCardHeader>

            <CCardBody>
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <CFormLabel customClassName="app-form-label" htmlFor="organisation-page-size">Show</CFormLabel>
                  <CFormSelect
                    id="organisation-page-size"
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
                  <CFormLabel customClassName="app-form-label" htmlFor="organisation-search">Search:</CFormLabel>
                  <CFormInput
                    id="organisation-search"
                    className="app-form-control w-auto"
                    type="search"
                    size="sm"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search organisations"
                  />
                </div>
              </div>

              {loading ? (
                <div className="d-flex justify-content-center py-5">
                  <CSpinner color="primary" aria-label="Loading organisations" />
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
                    onClick={() => fetchOrganisations({ notifySuccess: true })}
                  >
                    Try again
                  </CButton>
                </CAlert>
              ) : (
                <OrganisationTable
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

          <OrganisationFormModal
            mode={formMode}
            form={form}
            rows={rows}
            selectedId={selectedOrganisation?.id}
            saving={saving}
            error={formError}
            validationErrors={validationErrors}
            onChange={handleFormChange}
            onClose={closeFormModal}
            onSubmit={handleFormSubmit}
          />
          <ConfirmActionModal
            visible={Boolean(deleteTarget)}
            title="Delete organisation"
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
    </>
  );
}
