import { useCallback, useEffect, useState } from "react";
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPlus } from "@coreui/icons";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import { AdminWorkflowRoleAPI } from "../../../services/api";
import toaster from "@/utils/toaster";
import WorkflowRoleFormModal from "./WorkflowRoleFormModal";
import { workflowRoleSchema } from "./workflowRole.schema";
import WorkflowRoleTable from "./WorkflowRoleTable";

const EMPTY_ROLE = { role_name: "", status: true };
const PAGE_SIZES = [5, 10, 20, 50];

const isActive = (status) =>
  status === true || status === 1 || status === "1" || status === "true";

const getRoleRecord = (response) => {
  const data = response?.data?.data;
  if (Array.isArray(data)) return data[0] ?? null;
  return (
    data?.workflowRole ?? data?.workflow_role ?? data?.role ?? data ?? null
  );
};

const getRoleName = (role) =>
  role?.role_name ?? role?.workflow_role_name ?? role?.name ?? "";

const formatTime = (time) => {
  if (!time) return "-";
  const parsedDate = new Date(`1970-01-01T${time}`);
  return Number.isNaN(parsedDate.getTime())
    ? String(time)
    : parsedDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
};

export default function WorkflowRole() {
  const showToast = useCallback((type, message) => {
    toaster(type, message);
  }, []);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "role_name",
    direction: "asc",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form, setForm] = useState(EMPTY_ROLE);
  const [formError, setFormError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await AdminWorkflowRoleAPI.getWorkflowRoles({
        ...(search.trim() ? { role_name: search.trim() } : {}),
        sort: `${sortConfig.key} ${sortConfig.direction}`,
        fields: "id,role_name,display_name,status,created",
        page,
        limit: pageSize,
      });
      const list = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
      const resultTotal = Number(response?.data?.total ?? list.length);

      if (page > 1 && list.length === 0 && resultTotal > 0) {
        setTotal(resultTotal);
        setPage((current) => current - 1);
        return;
      }

      setRows(
        list.map((item) => ({
          ...item,
          id: item.id,
          role_name: getRoleName(item),
          display_name: item.display_name ?? "",
          status: item.status,
          created: item.created,
        })),
      );
      setTotal(resultTotal);
    } catch (requestError) {
      if (requestError.response?.status === 404) {
        setRows([]);
        setTotal(0);
      } else {
        console.error(requestError);
        const message = "Failed to load workflow roles. Please try again.";
        setError(message);
        showToast("error", message);
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortConfig, showToast]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const rowStart = total === 0 ? 0 : (safePage - 1) * pageSize;

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const closeFormModal = () => {
    if (saving || detailLoading) return;
    setModalMode(null);
    setSelectedRole(null);
    setForm(EMPTY_ROLE);
    setFormError("");
    setValidationErrors({});
  };

  const closeFormModalAfterSave = () => {
    setModalMode(null);
    setSelectedRole(null);
    setForm(EMPTY_ROLE);
    setFormError("");
    setValidationErrors({});
  };

  const openCreateModal = () => {
    setSelectedRole(null);
    setForm(EMPTY_ROLE);
    setFormError("");
    setValidationErrors({});
    setModalMode("create");
  };

  const openRoleModal = async (mode, role) => {
    setModalMode(mode);
    setSelectedRole(role);
    setForm({ role_name: getRoleName(role), status: isActive(role.status) });
    setFormError("");
    setValidationErrors({});
    setDetailLoading(true);

    try {
      const response = await AdminWorkflowRoleAPI.getWorkflowRole(role.id);
      const record = getRoleRecord(response) ?? role;
      setSelectedRole(record);
      setForm({
        role_name: getRoleName(record),
        status: isActive(record.status),
      });
    } catch (requestError) {
      console.error(requestError);
      setFormError(
        "Could not load workflow role details. Showing the list data.",
      );
    } finally {
      setDetailLoading(false);
    }
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = workflowRoleSchema.safeParse(form);
    if (!result.success) {
      const errors = Object.fromEntries(
        result.error.issues.map((issue) => [issue.path[0], issue.message]),
      );
      setValidationErrors(errors);
      showToast("warning", result.error.issues[0].message);
      return;
    }

    setValidationErrors({});
    setSaving(true);
    setFormError("");
    setActionError("");

    try {
      if (modalMode === "edit") {
        await AdminWorkflowRoleAPI.updateWorkflowRole(selectedRole.id, {
          role_name: result.data.role_name,
          status: result.data.status,
        });
      } else {
        await AdminWorkflowRoleAPI.createWorkflowRole({
          WorkflowRole: { role_name: result.data.role_name },
        });
      }

      closeFormModalAfterSave();
      showToast(
        "success",
        `Workflow role ${modalMode === "edit" ? "updated" : "created"} successfully.`,
      );
      await fetchRoles();
    } catch (requestError) {
      console.error(requestError);
      const message =
        modalMode === "edit"
          ? "Failed to update workflow role. Please try again."
          : "Failed to create workflow role. Please try again.";
      setFormError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteTarget(null);
    setActionError("");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError("");

    try {
      await AdminWorkflowRoleAPI.deleteWorkflowRole(deleteTarget.id);
      setDeleteTarget(null);
      showToast("success", "Workflow role deleted successfully.");
      if (rows.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await fetchRoles();
      }
    } catch (requestError) {
      console.error(requestError);
      const message = "Failed to delete workflow role. Please try again.";
      setActionError(message);
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
            <CCardHeader className="d-flex align-items-center justify-content-between gap-3">
              <strong>Workflow Roles</strong>
              <CButton
                color="primary"
                size="sm"
                className="d-inline-flex align-items-center gap-1 text-nowrap"
                onClick={openCreateModal}
              >
                <CIcon icon={cilPlus} />
                <span className="d-none d-sm-inline">Create role</span>
              </CButton>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <CFormLabel
                    customClassName="app-form-label"
                    htmlFor="workflow-role-page-size"
                  >
                    Show
                  </CFormLabel>
                  <CFormSelect
                    id="workflow-role-page-size"
                    className="app-form-select w-auto"
                    size="sm"
                    value={pageSize}
                    onChange={(event) =>
                      setPageSize(Number(event.target.value))
                    }
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
                  <CFormLabel
                    customClassName="app-form-label"
                    htmlFor="workflow-role-search"
                  >
                    Search:
                  </CFormLabel>
                  <CFormInput
                    id="workflow-role-search"
                    className="app-form-control w-auto"
                    type="search"
                    size="sm"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search workflow roles"
                  />
                </div>
              </div>

              {actionError && (
                <CAlert
                  color="danger"
                  dismissible
                  onClose={() => setActionError("")}
                >
                  {actionError}
                </CAlert>
              )}
              {loading ? (
                <div className="d-flex justify-content-center py-5">
                  <CSpinner color="primary" aria-label="Loading workflow roles" />
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
                    onClick={fetchRoles}
                  >
                    Try again
                  </CButton>
                </CAlert>
              ) : (
                <WorkflowRoleTable
                  rows={rows}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  rowStart={rowStart}
                  rowCount={total}
                  page={safePage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  onView={(role) => openRoleModal("view", role)}
                  onEdit={(role) => openRoleModal("edit", role)}
                  onDelete={setDeleteTarget}
                />
              )}
            </CCardBody>
          </CCard>

          <WorkflowRoleFormModal
            visible={Boolean(modalMode)}
            mode={modalMode}
            form={form}
            selectedRole={selectedRole}
            formError={formError}
            validationErrors={validationErrors}
            detailLoading={detailLoading}
            saving={saving}
            formatTime={formatTime}
            onChange={handleFormChange}
            onClose={closeFormModal}
            onSubmit={handleSubmit}
          />
          <ConfirmActionModal
            visible={Boolean(deleteTarget)}
            title="Delete workflow role?"
            message={
              deleteTarget
                ? `Delete "${deleteTarget.role_name}"? This action cannot be undone.`
                : ""
            }
            confirmLabel="Delete role"
            loadingLabel="Deleting..."
            loading={deleting}
            error={actionError}
            onClose={closeDeleteModal}
            onConfirm={handleDelete}
          />
        </CCol>
      </CRow>
    </>
  );
}
