import { Fragment } from "react";
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
import { cilMagnifyingGlass, cilPencil, cilTrash } from "@coreui/icons";
import TruncatedName from "@/components/TruncatedName";
import "./WorkflowRole.css";

const columns = [
  { label: "Sno", key: null },
  { label: "Role", key: "role_name" },
  { label: "Display Name", key: "display_name" },
  { label: "Status", key: "status" },
  { label: "Actions", key: null },
];

const isActive = (status) =>
  status === true || status === 1 || status === "1" || status === "true";

export default function WorkflowRoleTable({
  rows,
  sortConfig,
  onSort,
  rowStart,
  rowCount,
  page,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <>
      <div className="table-responsive">
        <CTable
          striped
          bordered
          hover
          className="mb-0 align-middle table-sm small workflow-roles-table"
        >
          <CTableHead>
            <CTableRow>
              {columns.map((column) => (
                <CTableHeaderCell
                  key={column.label}
                  scope="col"
                  aria-sort={
                    column.key && sortConfig.key === column.key
                      ? sortConfig.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  onClick={() => column.key && onSort(column.key)}
                  className={[
                    column.key && "workflow-roles-sortable",
                    "text-nowrap",
                    column.label === "Sno" && "text-center",
                    column.label === "Status" && "text-center",
                    column.label === "Actions" && "text-end",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {column.label}
                  {column.key && (
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
              rows.map((role, index) => (
                <CTableRow key={role.id}>
                  <CTableDataCell className="text-center">
                    {rowStart + index + 1}
                  </CTableDataCell>
                  <CTableDataCell>
                    <TruncatedName text={role.role_name || "-"} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <TruncatedName text={role.display_name || "-"} />
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CBadge
                      color={isActive(role.status) ? "primary" : "secondary"}
                      aria-label={isActive(role.status) ? "Active" : "Inactive"}
                    >
                      {isActive(role.status) ? "✓" : "✕"}
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
                          aria-label={`View ${role.role_name}`}
                          onClick={() => onView(role)}
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
                          aria-label={`Edit ${role.role_name}`}
                          onClick={() => onEdit(role)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                      </CTooltip>
                      <CTooltip content="Delete" placement="top">
                        <CButton
                          color="primary"
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          aria-label={`Delete ${role.role_name}`}
                          onClick={() => onDelete(role)}
                        >
                          <CIcon icon={cilTrash} />
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
                  No workflow roles found.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-3">
        <div className="small text-body-secondary">
          Showing {rowCount === 0 ? 0 : rowStart + 1} to{" "}
          {Math.min(rowStart + rows.length, rowCount)} of {rowCount} roles
        </div>

        <CPagination aria-label="Workflow role pages" className="mb-0">
          <CPaginationItem
            disabled={page === 1}
            onClick={() => onPageChange((current) => Math.max(current - 1, 1))}
            aria-label="Previous page"
          >
            Previous
          </CPaginationItem>
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter(
              (pageNumber) =>
                pageNumber === 1 ||
                pageNumber === totalPages ||
                Math.abs(pageNumber - page) <= 2,
            )
            .map((pageNumber, index, pages) => (
              <Fragment key={pageNumber}>
                {index > 0 && pages[index - 1] < pageNumber - 1 && (
                  <CPaginationItem disabled>...</CPaginationItem>
                )}
                <CPaginationItem
                  active={pageNumber === page}
                  onClick={() => onPageChange(pageNumber)}
                  aria-label={`Page ${pageNumber}`}
                >
                  {pageNumber}
                </CPaginationItem>
              </Fragment>
            ))}
          <CPaginationItem
            disabled={page === totalPages}
            onClick={() =>
              onPageChange((current) => Math.min(current + 1, totalPages))
            }
            aria-label="Next page"
          >
            Next
          </CPaginationItem>
        </CPagination>
      </div>
    </>
  );
}
