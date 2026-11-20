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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPlus } from "@coreui/icons";
import { AdminWorkflowAPI } from "../../../services/api";
import toaster from "@/utils/toaster";
import WorkflowFormModal from "./WorkflowFormModal";
import { workflowSchema } from "./workflow.schema";
import WorkflowsTable from "./WorkflowsTable";

const EMPTY_FORM = {
  workflow_name: "",
  workflow_description: "",
  status: true,
};

const PAGE_SIZES = [5, 10, 20, 50];

const getWorkflowRecord = (response) => {
  const data = response?.data?.data;
  if (Array.isArray(data)) return data[0] ?? null;
  return data?.workflowMaster ?? data?.workflow ?? data ?? null;
};

const isWorkflowActive = (status) =>
  status === true || status === 1 || status === "1" || status === "true";

const toWorkflowForm = (workflow) => ({
  workflow_name: workflow?.workflow_name ?? "",
  workflow_description: workflow?.workflow_description ?? "",
  status:
    workflow?.status == null ? true : isWorkflowActive(workflow.status),
});

export default function Workflows() {
  const showToast = useCallback((type, message) => {
    toaster(type, message);
  }, []);

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchWorkflows = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await AdminWorkflowAPI.getWorkflows();
      const list = response?.data?.data ?? [];
      setRows(
        list.map((workflow) => ({
          id: workflow.id,
          workflow_name: workflow.workflow_name ?? "",
          workflow_description: workflow.workflow_description ?? "",
          status: workflow.status,
        })),
      );
    } catch (requestError) {
      console.error(requestError);
      const message = "Failed to load workflows. Please try again.";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((workflow) =>
      [workflow.workflow_name, workflow.workflow_description]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [rows, search]);

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows;
    return [...filteredRows].sort((first, second) => {
      const firstValue = String(first[sortConfig.key] ?? "").toLowerCase();
      const secondValue = String(second[sortConfig.key] ?? "").toLowerCase();
      return sortConfig.direction === "asc"
        ? firstValue.localeCompare(secondValue)
        : secondValue.localeCompare(firstValue);
    });
  }, [filteredRows, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = sortedRows.length === 0 ? 0 : (safePage - 1) * pageSize;
  const visibleRows = sortedRows.slice(start, start + pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleSort = (key) => {
    if (!key) return;
    setSortConfig((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc" ? "desc" : "asc",
    }));
  };

  const closeModal = () => {
    if (saving || detailLoading) return;
    setModalMode(null);
    setSelectedWorkflow(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setValidationErrors({});
  };

  const openCreateModal = () => {
    setForm(EMPTY_FORM);
    setSelectedWorkflow(null);
    setFormError("");
    setValidationErrors({});
    setModalMode("create");
  };

  const openWorkflowModal = async (mode, workflow) => {
    setModalMode(mode);
    setSelectedWorkflow(workflow);
    setForm(toWorkflowForm(workflow));
    setFormError("");
    setValidationErrors({});
    setDetailLoading(true);
    try {
      const response = await AdminWorkflowAPI.getWorkflow(workflow.id);
      const record = getWorkflowRecord(response) ?? workflow;
      setSelectedWorkflow(record);
      setForm(toWorkflowForm(record));
    } catch (requestError) {
      console.error(requestError);
      const message = "Could not load workflow details. Showing the list data.";
      setFormError(message);
      showToast("error", message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = workflowSchema.safeParse(form);
    if (!result.success) {
      const errors = Object.fromEntries(
        result.error.issues.map((issue) => [issue.path[0], issue.message]),
      );
      setValidationErrors(errors);
      showToast("warning", result.error.issues[0].message);
      return;
    }

    setValidationErrors({});
    const payload = {
      workflowMasterBody: {
        workflow_name: result.data.workflow_name,
        workflow_description: result.data.workflow_description,
        status: result.data.status,
      },
    };

    setSaving(true);
    setFormError("");
    try {
      if (modalMode === "edit") {
        await AdminWorkflowAPI.updateWorkflow(selectedWorkflow.id, payload);
      } else {
        await AdminWorkflowAPI.createWorkflow(payload);
      }
      setModalMode(null);
      showToast(
        "success",
        `Workflow ${modalMode === "edit" ? "updated" : "created"} successfully.`,
      );
      await fetchWorkflows();
    } catch (requestError) {
      console.error(requestError);
      const message =
        modalMode === "edit"
          ? "Failed to update workflow. Please try again."
          : "Failed to create workflow. Please try again.";
      setFormError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
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

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex align-items-center justify-content-between gap-3">
            <strong>Workflow Master</strong>
            <CButton
              color="primary"
              size="sm"
              className="d-inline-flex align-items-center gap-1 text-nowrap"
              onClick={openCreateModal}
            >
              <CIcon icon={cilPlus} />
              <span className="d-none d-sm-inline">Create</span>
            </CButton>
          </CCardHeader>
          <CCardBody>
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <CFormLabel
                  customClassName="app-form-label"
                  htmlFor="workflow-page-size"
                >
                  Show
                </CFormLabel>
                <CFormSelect
                  id="workflow-page-size"
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
                  htmlFor="workflow-search"
                >
                  Search:
                </CFormLabel>
                <CFormInput
                  id="workflow-search"
                  className="app-form-control w-auto"
                  type="search"
                  size="sm"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search workflows"
                />
              </div>
            </div>
            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <CSpinner color="primary" aria-label="Loading workflows" />
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
                  onClick={fetchWorkflows}
                >
                  Try again
                </CButton>
              </CAlert>
            ) : (
              <WorkflowsTable
                rows={visibleRows}
                rowStart={start}
                rowCount={sortedRows.length}
                page={safePage}
                totalPages={totalPages}
                sortConfig={sortConfig}
                onSort={handleSort}
                onPageChange={setPage}
                onView={(workflow) => openWorkflowModal("view", workflow)}
                onEdit={(workflow) => openWorkflowModal("edit", workflow)}
              />
            )}
          </CCardBody>
        </CCard>
      </CCol>

      <WorkflowFormModal
        visible={Boolean(modalMode)}
        mode={modalMode}
        form={form}
        formError={formError}
        validationErrors={validationErrors}
        detailLoading={detailLoading}
        saving={saving}
        onChange={handleFormChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </CRow>
  );
}
