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
import { cilMagnifyingGlass } from "@coreui/icons";
import TruncatedName from "@/components/TruncatedName";
import "./GlobalRoles.css";

const columns = [
  { label: "Sno", key: null },
  { label: "Name", key: "name" },
  { label: "Status", key: "status" },
  { label: "Action", key: null },
];

const isRoleActive = (status) => status === true || status === "ACTIVE";

export default function GlobalRolesTable({
  rows,
  sortConfig,
  onSort,
  rowStart,
  rowCount,
  page,
  totalPages,
  onPageChange,
  onViewPermissions,
}) {
  return (
    <>
      <div className="table-responsive">
        <CTable
          striped
          bordered
          hover
          className="mb-0 align-middle table-sm small global-roles-table"
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
                    column.key && "global-roles-sortable",
                    "text-nowrap",
                    (column.label === "Sno" || column.label === "Status") &&
                      "text-center",
                    column.label === "Action" && "text-center",
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
              rows.map((row, index) => (
                <CTableRow key={row.id}>
                  <CTableDataCell className="text-center">
                    {rowStart + index + 1}
                  </CTableDataCell>
                  <CTableDataCell>
                    <TruncatedName text={row.name || "-"} />
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CBadge
                      color={isRoleActive(row.status) ? "primary" : "secondary"}
                      className="px-2 py-1"
                      aria-label={
                        isRoleActive(row.status) ? "Active" : "Inactive"
                      }
                    >
                      {isRoleActive(row.status) ? "✓" : "✕"}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <div className="d-flex justify-content-center gap-1">
                      <CTooltip content="View permissions" placement="top">
                        <CButton
                          color="primary"
                          variant="ghost"
                          size="sm"
                          aria-label={`View permissions for ${row.name}`}
                          onClick={() => onViewPermissions(row)}
                        >
                          <CIcon icon={cilMagnifyingGlass} />
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
                  No roles found.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-3">
        <div className="small text-body-secondary">
          Showing {rowCount === 0 ? 0 : rowStart + 1} to{" "}
          {Math.min(rowStart + rows.length, rowCount)} of {rowCount} entries
        </div>

        <CPagination aria-label="Global role pages" className="mb-0">
          <CPaginationItem
            disabled={page === 1}
            onClick={() => onPageChange((current) => Math.max(current - 1, 1))}
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
          >
            Next
          </CPaginationItem>
        </CPagination>
      </div>
    </>
  );
}
