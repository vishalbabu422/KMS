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
import { AdminTrashAPI } from "@/modules/admin/services/api";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import TrashTable from "./TrashTable";
import "./Trash.css";

const PAGE_SIZES = [5, 10, 20, 50];

const formatDate = (dateValue) => {
  if (!dateValue) return "-";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatPathLabel = (path) => {
  if (!path) return "-";

  const parts = String(path).split("/");

  if (parts[0] === "members") {
    return parts.length > 1
      ? `My Docs / ${parts.slice(1).join("/")}`
      : "My Docs";
  }

  if (parts[0] === "document-library") {
    return parts.length > 1
      ? `Collection / ${parts.slice(1).join("/")}`
      : "Collection";
  }

  return String(path);
};

export default function Trash() {
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
  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchTrashList = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await AdminTrashAPI.getTrashList({
        sort: "modified desc",
        models: [
          "ContentCatalogField.title",
          "createdBy.full_name",
          "modifiedBy.full_name",
          "contentType.content_name",
          "contentType.icon",
        ].join(","),
        modelFilter: JSON.stringify({}),
      });
      const list = response?.data?.data?.trashList ?? [];
      if (!Array.isArray(list)) {
        throw new Error("Trash API returned an invalid list.");
      }

      setRows(
        list.map((item) => ({
          id: item.id,
          title: item.ContentCatalogField?.title ?? "-",
          path: formatPathLabel(item.path),
          deletedBy: item.modifiedBy?.full_name ?? "-",
          deletedOn: formatDate(item.modified),
          contentName: item.contentType?.content_name ?? "-",
          icon: item.contentType?.icon,
        })),
      );
    } catch (requestError) {
      console.error(requestError);
      setError("Failed to load trash items. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrashList();
  }, [fetchTrashList]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      [row.title, row.path, row.deletedBy, row.contentName]
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
      const comparison = firstValue.localeCompare(secondValue);

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredRows, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const rowStart = (safePage - 1) * pageSize;
  const visibleRows = sortedRows.slice(rowStart, rowStart + pageSize);

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

  const closeConfirmAction = () => {
    if (actionLoading !== null) return;
    setConfirmAction(null);
    setActionError("");
  };

  const handleConfirmAction = async () => {
    if (!confirmAction || actionLoading !== null) return;

    const { id, type } = confirmAction;
    setActionLoading(id);
    setActionError("");

    try {
      if (type === "restore") {
        await AdminTrashAPI.restoreItem(id);
      } else {
        await AdminTrashAPI.deleteItem(id);
      }

      setConfirmAction(null);
      await fetchTrashList();
    } catch (requestError) {
      console.error(requestError);
      setActionError(
        type === "restore"
          ? "Failed to restore item. Please try again."
          : "Failed to permanently delete item. Please try again.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex align-items-center justify-content-between">
              <span>Trash List</span>
            </CCardHeader>

            <CCardBody>
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <CFormLabel
                    customClassName="app-form-label"
                    htmlFor="trash-page-size"
                  >
                    Show
                  </CFormLabel>
                  <CFormSelect
                    id="trash-page-size"
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
                    htmlFor="trash-search"
                  >
                    Search:
                  </CFormLabel>
                  <CFormInput
                    id="trash-search"
                    className="app-form-control w-auto"
                    type="search"
                    size="sm"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search trash items"
                  />
                </div>
              </div>

              {loading ? (
                <div className="d-flex justify-content-center py-5">
                  <CSpinner color="primary" aria-label="Loading trash items" />
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
                    onClick={fetchTrashList}
                  >
                    Try again
                  </CButton>
                </CAlert>
              ) : (
                <TrashTable
                  rows={visibleRows}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  rowStart={rowStart}
                  rowCount={sortedRows.length}
                  page={safePage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  actionLoading={actionLoading}
                  onRestore={(row) => {
                    setActionError("");
                    setConfirmAction({ id: row.id, type: "restore", title: row.title });
                  }}
                  onDelete={(row) => {
                    setActionError("");
                    setConfirmAction({ id: row.id, type: "delete", title: row.title });
                  }}
                />
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <ConfirmActionModal
        visible={Boolean(confirmAction)}
        title={
          confirmAction?.type === "restore"
            ? "Restore item?"
            : "Delete permanently?"
        }
        message={
          confirmAction?.type === "restore"
            ? `Restore "${confirmAction.title}" to its original location?`
            : `Permanently delete "${confirmAction?.title}"? This action cannot be undone.`
        }
        confirmLabel={
          confirmAction?.type === "restore" ? "Restore" : "Delete permanently"
        }
        loadingLabel="Processing..."
        confirmColor={confirmAction?.type === "restore" ? "success" : "danger"}
        loading={actionLoading !== null}
        error={actionError}
        onClose={closeConfirmAction}
        onConfirm={handleConfirmAction}
      />
    </>
  );
}
