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
import { cilPencil, cilTrash } from "@coreui/icons";
import TruncatedName from "@/components/TruncatedName";
import "./Language.css";

const columns = [
  { label: "Sno", key: "serialNumber" },
  { label: "Status", key: "status" },
  { label: "Language Code", key: "code" },
  { label: "Language Name", key: "name" },
  { label: "Action", key: null },
];

export default function LanguageTable({
  rows,
  sortConfig,
  onSort,
  rowStart,
  rowCount,
  page,
  totalPages,
  onPageChange,
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
          className="mb-0 align-middle table-sm small language-table"
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
                    column.key && "user-select-none",
                    "text-nowrap",
                    (column.key === "serialNumber" ||
                      column.key === "status") &&
                      "text-center",
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
              rows.map((row) => (
                <CTableRow key={row.id}>
                  <CTableDataCell className="text-center">
                    {row.serialNumber}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CBadge
                      color={row.status ? "primary" : "secondary"}
                      aria-label={row.status ? "Active" : "Inactive"}
                    >
                      {row.status ? "✓" : "✕"}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{row.code || "-"}</CTableDataCell>
                  <CTableDataCell>
                    <TruncatedName
                      text={row.name}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-1">
                      <CTooltip content="Edit" placement="top">
                        <CButton
                          color="primary"
                          variant="ghost"
                          size="sm"
                          aria-label={`Edit ${row.name}`}
                          onClick={() => onEdit(row)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                      </CTooltip>
                      {row.status && (
                        <CTooltip content="Delete" placement="top">
                          <CButton
                            color="primary"
                            variant="ghost"
                            size="sm"
                            aria-label={`Delete ${row.name}`}
                            onClick={() => onDelete(row)}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTooltip>
                      )}
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
                  No languages found.
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

        <CPagination aria-label="Language pages" className="mb-0">
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
