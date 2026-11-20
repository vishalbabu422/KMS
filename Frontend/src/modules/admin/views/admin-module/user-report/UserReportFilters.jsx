import {
  CButton,
  CCol,
  CFormInput,
  CRow,
} from "@coreui/react";

export default function UserReportFilters({
  allUsers,
  userName,
  fromDate,
  toDate,
  onAllUsersChange,
  onUserNameChange,
  onFromDateChange,
  onToDateChange,
  onSearch,
}) {
  return (
    <form onSubmit={onSearch}>
      <CRow className="g-3 align-items-end">
        <CCol xs={12} sm={6} md={3} lg={2} xl={2}>
          <label className="user-report-switch" htmlFor="user-report-all-users">
            <input
              className="user-report-switch-input"
              type="checkbox"
              id="user-report-all-users"
              role="switch"
              checked={allUsers}
              onChange={(event) => onAllUsersChange(event.target.checked)}
            />
            <span className="user-report-switch-track" aria-hidden="true" />
            <span className="user-report-switch-label">All Users</span>
          </label>
        </CCol>

        {!allUsers && (
          <CCol xs={12} sm={6} md={6} lg={2} xl={2}>
            <label
              className="form-label small fw-semibold"
              htmlFor="user-report-user-name"
            >
              Uploaded by
            </label>
            <CFormInput
              id="user-report-user-name"
              type="search"
              size="sm"
              placeholder="User name"
              value={userName}
              onChange={(event) => onUserNameChange(event.target.value)}
            />
          </CCol>
        )}

        <CCol
          xs={12}
          sm={6}
          md={4}
          lg={allUsers ? 3 : 2}
          xl={allUsers ? 3 : 2}
        >
          <label
            className="form-label small fw-semibold"
            htmlFor="user-report-from-date"
          >
            From Date
          </label>
          <CFormInput
            id="user-report-from-date"
            type="date"
            size="sm"
            value={fromDate}
            onChange={(event) => onFromDateChange(event.target.value)}
          />
        </CCol>

        <CCol
          xs={12}
          sm={6}
          md={4}
          lg={allUsers ? 3 : 2}
          xl={allUsers ? 3 : 2}
        >
          <label
            className="form-label small fw-semibold"
            htmlFor="user-report-to-date"
          >
            To Date
          </label>
          <CFormInput
            id="user-report-to-date"
            type="date"
            size="sm"
            value={toDate}
            onChange={(event) => onToDateChange(event.target.value)}
          />
        </CCol>

        <CCol xs={6} sm={6} md={3} lg={2} xl={1}>
          <CButton color="primary" type="submit" className="w-100">
            Search
          </CButton>
        </CCol>

        <CCol xs={6} sm={6} md={3} lg={2} xl={1}>
          <CButton
            color="secondary"
            variant="outline"
            type="button"
            className="w-100"
          >
            Export
          </CButton>
        </CCol>
      </CRow>
    </form>
  );
}
