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
import "./ContentMetadata.css";

const columns = [
  { label: "Sno", key: "serialNumber" },
  { label: "Status", key: "status" },
  { label: "Content Type", key: "contentType" },
  { label: "Priority", key: "priority" },
  { label: "Field Title", key: "title" },
  { label: "Field Description", key: "description" },
  { label: "Action", key: null },
];

export default function ContentMetadataTable({
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
          className="mb-0 align-middle table-sm small content-metadata-table"
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
                  <CTableDataCell>
                    <TruncatedName
                      text={row.contentType}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    {row.priority === "" ? "-" : row.priority}
                  </CTableDataCell>
                  <CTableDataCell>
                    <TruncatedName
                      text={row.title}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <TruncatedName
                      text={row.description}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex justify-content-start gap-0">
                      <CTooltip content="Edit" placement="top">
                        <CButton
                          color="primary"
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          aria-label={`Edit ${row.title}`}
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
                            className="p-1"
                            aria-label={`Delete ${row.title}`}
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
                  No content metadata found.
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

        <CPagination aria-label="Content Metadata pages" className="mb-0">
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
