import {
  CBadge,
  CButton,
  CPagination,
  CPaginationItem,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMagnifyingGlass, cilPencil } from "@coreui/icons";
import TruncatedName from "@/components/TruncatedName";
import "./Workflows.css";

const columns = [
  { label: "Sno", key: null, sortable: false },
  { label: "Workflow", key: "workflow_name", sortable: true },
  { label: "Description", key: "workflow_description", sortable: true },
  { label: "Status", key: "status", sortable: true },
  { label: "Actions", key: null, sortable: false },
];

const isWorkflowActive = (status) =>
  status === true || status === 1 || status === "1" || status === "true";

export default function WorkflowsTable({
  rows,
  rowStart,
  rowCount,
  page,
  totalPages,
  sortConfig,
  onSort,
  onPageChange,
  onView,
  onEdit,
}) {
  return (
    <>
      <div className="table-responsive">
        <CTable
          striped
          bordered
          hover
          className="mb-0 align-middle table-sm small workflows-table"
        >
          <CTableHead>
            <CTableRow>
              {columns.map((column) => (
                <CTableHeaderCell
                  key={column.label}
                  scope="col"
                  aria-sort={
                    column.sortable && sortConfig.key === column.key
                      ? sortConfig.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  onClick={() => column.sortable && onSort(column.key)}
                  className={[
                    column.sortable && "workflows-sortable",
                    "text-nowrap",
                    column.label === "Actions" && "text-end",
                    (column.label === "Sno" || column.label === "Status") &&
                      "text-center",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {column.label}
                  {column.sortable && (
                    <span
                      className="ms-1 text-body-secondary"
                      aria-hidden="true"
                    >
                      {sortConfig.key === column.key
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}
                    </span>
                  )}
                </CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rows.length ? (
              rows.map((workflow, index) => (
                <CTableRow key={workflow.id}>
                  <CTableDataCell className="text-center">
                    {rowStart + index + 1}
                  </CTableDataCell>
                  <CTableDataCell>
                    <TruncatedName text={workflow.workflow_name || "-"} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <TruncatedName
                      text={workflow.workflow_description || "-"}
                    />
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CBadge
                      color={
                        isWorkflowActive(workflow.status)
                          ? "primary"
                          : "secondary"
                      }
                      aria-label={
                        isWorkflowActive(workflow.status) ? "Active" : "Inactive"
                      }
                    >
                      {isWorkflowActive(workflow.status) ? "✓" : "✕"}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="text-end">
                    <div className="d-flex justify-content-end gap-0">
                      <CTooltip content="View" placement="top">
                        <CButton
                          color="primary"
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          aria-label={`View ${workflow.workflow_name}`}
                          onClick={() => onView(workflow)}
                        >
                          <CIcon icon={cilMagnifyingGlass} />
                        </CButton>
                      </CTooltip>
                      <CTooltip content="Edit" placement="top">
                        <CButton
                          color="primary"
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          aria-label={`Edit ${workflow.workflow_name}`}
                          onClick={() => onEdit(workflow)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                      </CTooltip>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell
                  colSpan={columns.length}
                  className="text-center text-body-secondary py-4"
                >
                  No workflows found.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-3">
        <small className="text-body-secondary">
          {rowCount > 0 ? (
            <>
              Showing <strong>{rowStart + 1}</strong> to{" "}
              <strong>{Math.min(rowStart + rows.length, rowCount)}</strong> of{" "}
              <strong>{rowCount}</strong> workflows
            </>
          ) : (
            "No workflows to display"
          )}
        </small>
        {totalPages > 1 && (
          <CPagination className="mb-0" aria-label="Workflow pages">
            <CPaginationItem
              disabled={page === 1}
              onClick={() => onPageChange((current) => current - 1)}
              aria-label="Previous page"
            >
              Previous
            </CPaginationItem>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <CPaginationItem
                  key={pageNumber}
                  active={pageNumber === page}
                  onClick={() => onPageChange(pageNumber)}
                  aria-label={`Page ${pageNumber}`}
                >
                  {pageNumber}
                </CPaginationItem>
              ),
            )}
            <CPaginationItem
              disabled={page === totalPages}
              onClick={() => onPageChange((current) => current + 1)}
              aria-label="Next page"
            >
              Next
            </CPaginationItem>
          </CPagination>
        )}
      </div>
    </>
  );
}
