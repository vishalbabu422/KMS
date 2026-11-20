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
import { AdminWorkflowActionAPI } from "../../../services/api";
import toaster from "@/utils/toaster";
import WorkflowActionFormModal from "./WorkflowActionFormModal";
import { workflowActionSchema } from "./workflowAction.schema";
import WorkflowActionsTable from "./WorkflowActionsTable";

const EMPTY_ACTION = { action_name: "", status: true };
const PAGE_SIZES = [5, 10, 20, 50];

const isActive = (status) =>
  status === true || status === 1 || status === "1" || status === "true";

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

export default function WorkflowActions() {
  const showToast = useCallback((type, message) => {
    toaster(type, message);
  }, []);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "action_name",
    direction: "asc",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [form, setForm] = useState(EMPTY_ACTION);
  const [formError, setFormError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchActions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await AdminWorkflowActionAPI.getWorkflowActions({
        ...(search.trim() ? { action_name: search.trim() } : {}),
        sort: `${sortConfig.key} ${sortConfig.direction}`,
        fields: "id,action_name,status,created",
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
          id: item.id,
          action_name: item.action_name ?? "",
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
        const message = "Failed to load workflow actions. Please try again.";
        setError(message);
        showToast("error", message);
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortConfig, showToast]);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

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
    if (saving) return;
    setModalMode(null);
    setSelectedAction(null);
    setForm(EMPTY_ACTION);
    setFormError("");
    setValidationErrors({});
  };

  const openCreateModal = () => {
    setSelectedAction(null);
    setForm(EMPTY_ACTION);
    setFormError("");
    setValidationErrors({});
    setModalMode("create");
  };

  const openActionModal = (mode, action) => {
    setSelectedAction(action);
    setForm({
      action_name: action.action_name,
      status: isActive(action.status),
    });
    setFormError("");
    setValidationErrors({});
    setModalMode(mode);
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

  const closeFormModalAfterSave = () => {
    setModalMode(null);
    setSelectedAction(null);
    setForm(EMPTY_ACTION);
    setFormError("");
    setValidationErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = workflowActionSchema.safeParse(form);
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
        await AdminWorkflowActionAPI.updateWorkflowAction(selectedAction.id, {
          action_name: result.data.action_name,
          status: result.data.status,
        });
      } else {
        await AdminWorkflowActionAPI.createWorkflowAction({
          WorkflowAction: { action_name: result.data.action_name },
        });
      }

      closeFormModalAfterSave();
      showToast(
        "success",
        `Workflow action ${modalMode === "edit" ? "updated" : "created"} successfully.`,
      );
      await fetchActions();
    } catch (requestError) {
      console.error(requestError);
      const message =
        modalMode === "edit"
          ? "Failed to update workflow action. Please try again."
          : "Failed to create workflow action. Please try again.";
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
      await AdminWorkflowActionAPI.deleteWorkflowAction(deleteTarget.id);
      setDeleteTarget(null);
      showToast("success", "Workflow action deleted successfully.");
      if (rows.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await fetchActions();
      }
    } catch (requestError) {
      console.error(requestError);
      const message = "Failed to delete workflow action. Please try again.";
      setActionError(message);
      showToast("error", message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex align-items-center justify-content-between gap-3">
            <strong>Workflow Actions</strong>
            <CButton
              color="primary"
              size="sm"
              className="d-inline-flex align-items-center gap-1 text-nowrap"
              onClick={openCreateModal}
            >
              <CIcon icon={cilPlus} />
              <span className="d-none d-sm-inline">Create action</span>
            </CButton>
          </CCardHeader>
          <CCardBody>
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <CFormLabel
                  customClassName="app-form-label"
                  htmlFor="workflow-action-page-size"
                >
                  Show
                </CFormLabel>
                <CFormSelect
                  id="workflow-action-page-size"
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
                <CFormLabel
                  customClassName="app-form-label"
                  htmlFor="workflow-action-search"
                >
                  Search:
                </CFormLabel>
                <CFormInput
                  id="workflow-action-search"
                  className="app-form-control w-auto"
                  type="search"
                  size="sm"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search workflow actions"
                />
              </div>
            </div>

            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <CSpinner
                  color="primary"
                  aria-label="Loading workflow actions"
                />
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
                  onClick={fetchActions}
                >
                  Try again
                </CButton>
              </CAlert>
            ) : (
              <WorkflowActionsTable
                rows={rows}
                sortConfig={sortConfig}
                onSort={handleSort}
                rowStart={rowStart}
                rowCount={total}
                page={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
                onView={(action) => openActionModal("view", action)}
                onEdit={(action) => openActionModal("edit", action)}
                onDelete={setDeleteTarget}
              />
            )}
          </CCardBody>
        </CCard>

        <WorkflowActionFormModal
          visible={Boolean(modalMode)}
          mode={modalMode}
          form={form}
          selectedAction={selectedAction}
          formError={formError}
          validationErrors={validationErrors}
          saving={saving}
          formatTime={formatTime}
          onChange={handleFormChange}
          onClose={closeFormModal}
          onSubmit={handleSubmit}
        />
        <ConfirmActionModal
          visible={Boolean(deleteTarget)}
          title="Delete workflow action?"
          message={
            deleteTarget
              ? `Delete "${deleteTarget.action_name}"? This action cannot be undone.`
              : ""
          }
          confirmLabel="Delete action"
          loadingLabel="Deleting..."
          loading={deleting}
          error={actionError}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      </CCol>
    </CRow>
  );
}
