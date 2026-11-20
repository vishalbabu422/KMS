import {
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
import "./UserRoles.css";

const columns = [
  { label: "Sno", key: null, sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Login ID", key: "login_id", sortable: true },
  { label: "Employee Code", key: "employee_code", sortable: true },
  { label: "Designation", key: "designation", sortable: true },
  { label: "Set Role", key: null, sortable: false },
];

const roleOptions = [
  { label: "System Admin", roleId: 3 },
  { label: "Super Admin", roleId: 2 },
  { label: "User", roleId: 1 },
];

export default function UserRolesTable({
  rows,
  rowCount,
  start,
  page,
  totalPages,
  sortConfig,
  onSort,
  onPageChange,
  onRoleChange,
}) {
  return (
    <>
      <div className="table-responsive">
        <CTable
          striped
          bordered
          hover
          className="mb-0 align-middle table-sm small user-roles-table"
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
                    column.sortable && "user-roles-sortable",
                    "text-nowrap",
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
              rows.map((row, index) => (
                <CTableRow key={row.id}>
                  <CTableDataCell className="text-center">
                    {start + index + 1}
                  </CTableDataCell>
                  <CTableDataCell>{row.name}</CTableDataCell>
                  <CTableDataCell>{row.email}</CTableDataCell>
                  <CTableDataCell>{row.login_id}</CTableDataCell>
                  <CTableDataCell>{row.employee_code}</CTableDataCell>
                  <CTableDataCell>{row.designation}</CTableDataCell>
                  <CTableDataCell>
                    <CFormSelect
                      size="sm"
                      value={row.role_id}
                      aria-label={`Set role for ${row.name}`}
                      onChange={(event) => {
                        const selectedRoleId = Number(event.target.value);
                        const selectedRole = roleOptions.find(
                          (role) => role.roleId === selectedRoleId,
                        );

                        if (selectedRole) onRoleChange(row, selectedRole);
                      }}
                    >
                      <option value="">Select Role</option>
                      {roleOptions.map((role) => (
                        <option key={role.roleId} value={role.roleId}>
                          {role.label}
                        </option>
                      ))}
                    </CFormSelect>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell
                  colSpan={columns.length}
                  className="text-center text-body-secondary py-4"
                >
                  No records found.
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
              Showing <strong>{start + 1}</strong> to{" "}
              <strong>{start + rows.length}</strong> of <strong>{rowCount}</strong>{" "}
              entries
            </>
          ) : (
            "No entries found"
          )}
        </small>
        {totalPages > 1 && (
          <CPagination className="mb-0" aria-label="User pages">
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
