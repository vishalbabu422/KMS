import { Fragment } from "react";
import {
  CBadge,
  CButton,
  CFormInput,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilFile } from "@coreui/icons";
import TruncatedName from "@/components/TruncatedName";

const columns = [
  { label: "Sno", key: null },
  { label: "Title", key: "title" },
  { label: "Attachment", key: "attachment" },
  { label: "No. of Pages", key: "pages" },
  { label: "Attachment Size", key: "size" },
  { label: "Collection Name", key: "collection" },
  { label: "Created By", key: "createdBy" },
  { label: "Created On", key: "createdOn" },
  { label: "Status", key: "status" },
];

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function UserReportTable({
  rows,
  rowStart,
  rowCount,
  page,
  totalPages,
  pageSize,
  tableSearch,
  sortConfig,
  onPageSizeChange,
  onSearchChange,
  onSort,
  onPageChange,
}) {
  return (
    <>
      <div className="user-report-table-toolbar d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
        <div className="d-flex align-items-center gap-2 small text-body-secondary">
          <label htmlFor="user-report-page-size">Show</label>
          <CFormSelect
            id="user-report-page-size"
            size="sm"
            value={pageSize}
            onChange={(event) => onPageSizeChange(event.target.value)}
            aria-label="Rows per page"
            className="user-report-page-size"
          >
            {[5, 10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </CFormSelect>
          <span>entries</span>
        </div>
        <CFormInput
          type="search"
          size="sm"
          placeholder="Search documents..."
          value={tableSearch}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search uploaded documents"
          className="user-report-table-search"
        />
      </div>

      <div className="table-responsive">
        <CTable
          striped
          bordered
          hover
          className="mb-0 align-middle table-sm small user-report-table"
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
                    column.key && "user-report-sortable",
                    "text-nowrap",
                    column.label === "Sno" && "text-center",
                    column.label === "Status" && "text-center",
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
              rows.map((item, index) => (
                <CTableRow key={item.id}>
                  <CTableDataCell className="text-center">
                    {rowStart + index + 1}
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="user-report-title-cell">
                      <CIcon
                        icon={cilFile}
                        className="user-report-file-icon"
                        aria-hidden="true"
                      />
                      <TruncatedName text={item.title} />
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    {item.attachmentUrl ? (
                      <a
                        href={item.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="user-report-attachment"
                        title={item.attachment}
                      >
                        {item.attachment}
                      </a>
                    ) : (
                      <TruncatedName text={item.attachment} />
                    )}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    {item.pages}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    {item.size}
                  </CTableDataCell>
                  <CTableDataCell>
                    <TruncatedName text={item.collection} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <TruncatedName text={item.createdBy} />
                  </CTableDataCell>
                  <CTableDataCell className="text-nowrap">
                    {formatDate(item.createdOn)}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CBadge
                      color={item.status === "Published" ? "success" : "warning"}
                    >
                      {item.status}
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell
                  colSpan={columns.length}
                  className="text-center text-body-secondary py-4"
                >
                  No documents found.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-3">
        <div className="small text-body-secondary">
          Showing {rowCount === 0 ? 0 : rowStart + 1} to{" "}
          {Math.min(rowStart + rows.length, rowCount)} of {rowCount} records
        </div>

        <CPagination aria-label="User report pages" className="mb-0">
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
                Math.abs(pageNumber - page) <= 1,
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
