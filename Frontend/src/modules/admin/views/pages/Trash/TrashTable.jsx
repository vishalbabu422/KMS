import { Fragment } from "react";
import {
  CButton,
  CPagination,
  CPaginationItem,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilHistory, cilTrash } from "@coreui/icons";
import TruncatedName from "@/components/TruncatedName";
import docLinkIcon from "@/modules/admin/assets/images/svg/doc-link.svg";
import folderIcon from "@/modules/admin/assets/images/svg/folder.svg";
import globeIcon from "@/modules/admin/assets/images/svg/globe.svg";
import linkIcon from "@/modules/admin/assets/images/svg/link.svg";

const CONTENT_TYPE_ICONS = {
  "svg/doc-link.svg": docLinkIcon,
  "svg/folder.svg": folderIcon,
  "svg/globe.svg": globeIcon,
  "svg/link.svg": linkIcon,
};

const getContentTypeIcon = (icon) => CONTENT_TYPE_ICONS[icon] ?? null;

const columns = [
  { label: "Type", key: "contentName" },
  { label: "Title", key: "title" },
  { label: "Path", key: "path" },
  { label: "Deleted By", key: "deletedBy" },
  { label: "Deleted On", key: "deletedOn" },
  { label: "Action", key: null },
];

export default function TrashTable({
  rows,
  sortConfig,
  onSort,
  rowStart,
  rowCount,
  page,
  totalPages,
  onPageChange,
  actionLoading,
  onRestore,
  onDelete,
}) {
  return (
    <>
      <div className="table-responsive">
        <CTable
          striped
          bordered
          hover
          className="mb-0 align-middle table-sm small trash-table"
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
                  <CTableDataCell>
                    <div className="d-flex flex-nowrap align-items-center gap-2 overflow-hidden">
                      {getContentTypeIcon(row.icon) && (
                        <img
                          src={getContentTypeIcon(row.icon)}
                          alt=""
                          width="18"
                          height="18"
                          className="flex-shrink-0"
                        />
                      )}
                      <TruncatedName
                        text={row.contentName}
                        className="flex-grow-1"
                      />
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <TruncatedName text={row.title} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <TruncatedName text={row.path} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <TruncatedName text={row.deletedBy} />
                  </CTableDataCell>
                  <CTableDataCell className="text-nowrap">
                    {row.deletedOn}
                  </CTableDataCell>
                  <CTableDataCell>
                    {actionLoading === row.id ? (
                      <div className="d-flex justify-content-center">
                        <CSpinner size="sm" color="primary" aria-label="Processing item" />
                      </div>
                    ) : (
                      <div className="d-flex gap-1">
                        <CTooltip content="Restore" placement="top">
                          <CButton
                            color="primary"
                            variant="ghost"
                            size="sm"
                            aria-label={`Restore ${row.title}`}
                            onClick={() => onRestore(row)}
                          >
                            <CIcon icon={cilHistory} />
                          </CButton>
                        </CTooltip>
                        <CTooltip content="Delete permanently" placement="top">
                          <CButton
                            color="primary"
                            variant="ghost"
                            size="sm"
                            aria-label={`Delete ${row.title} permanently`}
                            onClick={() => onDelete(row)}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTooltip>
                      </div>
                    )}
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell
                  colSpan={columns.length}
                  className="text-center text-body-secondary py-4"
                >
                  No trash items found.
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

        <CPagination aria-label="Trash pages" className="mb-0">
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
