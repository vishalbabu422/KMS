import {
  CButton,
  CFormInput,
  CFormSelect,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";

export default function AuditTrailFilters({
  draftFilters,
  pageSize,
  pageSizes,
  onFilterChange,
  onPageSizeChange,
  onApply,
  onClear,
}) {
  return (
    <form
      className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2"
      onSubmit={onApply}
    >
      <CFormInput
        type="search"
        placeholder="Login ID"
        value={draftFilters.loginId}
        onChange={(event) => onFilterChange("loginId", event.target.value)}
        aria-label="Filter by login ID"
        size="sm"
        style={{ flex: "1 1 180px", minWidth: "150px" }}
      />
      <CFormInput
        type="date"
        className="audit-trail-date-input"
        value={draftFilters.startDate}
        onChange={(event) => onFilterChange("startDate", event.target.value)}
        aria-label="Start date"
        size="sm"
        style={{ flex: "1 1 160px", minWidth: "155px" }}
      />
      <CFormInput
        type="date"
        className="audit-trail-date-input"
        value={draftFilters.endDate}
        onChange={(event) => onFilterChange("endDate", event.target.value)}
        aria-label="End date"
        size="sm"
        style={{ flex: "1 1 160px", minWidth: "155px" }}
      />
      <CFormSelect
        value={pageSize}
        onChange={(event) => onPageSizeChange(Number(event.target.value))}
        aria-label="Rows per page"
        size="sm"
        style={{ flex: "0 0 125px", minWidth: "125px" }}
      >
        {pageSizes.map((size) => (
          <option key={size} value={size}>
            {size} rows
          </option>
        ))}
      </CFormSelect>
      <CButton
        color="primary"
        size="sm"
        type="submit"
        className="d-inline-flex align-items-center gap-1 text-nowrap"
        style={{ flex: "0 0 auto" }}
      >
        <CIcon icon={cilSearch} />
        Apply
      </CButton>
      <CButton
        color="secondary"
        variant="outline"
        size="sm"
        type="button"
        onClick={onClear}
        className="text-nowrap"
        style={{ flex: "0 0 auto" }}
      >
        Clear
      </CButton>
    </form>
  );
}
