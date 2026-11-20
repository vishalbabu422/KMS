import { useState, useMemo, useEffect, useCallback } from "react";
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CSpinner,
} from "@coreui/react";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import { AdminUserRolesAPI } from "../../../services/api";
import toaster from "@/utils/toaster";
import UserRolesTable from "./UserRolesTable";

export default function AdminUserRoles() {
  const showToast = useCallback((type, message) => {
    toaster(type, message);
  }, []);

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingRoleChange, setPendingRoleChange] = useState(null);
  const [roleChangeLoading, setRoleChangeLoading] = useState(false);
  const [roleChangeError, setRoleChangeError] = useState("");

  /* ================= FETCH ROLES ================= */
  const fetchRoles = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await AdminUserRolesAPI.getUsers();
      const list = res?.data?.data?.users ?? [];

      setRows(
        list.map((item) => ({
          id: item.employee_id,
          name: item.appellation_name + " " + item.full_name,
          employee_code: item.employee_code,
          email: item.email,
          login_id: item.login_id,
          designation: item.designation,
          org_unit_name: item.org_unit_name,
          // 🔑 role mapping
          role_id: item.UserRoleMapping?.role_id ?? "",
        })),
      );
    } catch (err) {
      console.error(err);
      const message = "Failed to load roles. Please try again.";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  /* ================= SEARCH & SORT ================= */
  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();

    return rows.filter((r) =>
      [r.name, r.email, r.login_id, r.employee_code, r.designation]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, search]);

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const aVal = String(a[sortConfig.key] ?? "").toLowerCase();
      const bVal = String(b[sortConfig.key] ?? "").toLowerCase();
      return sortConfig.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [filteredRows, sortConfig]);

  /* ================= PAGINATION ================= */
  const start = (page - 1) * pageSize;
  const visibleRows = sortedRows.slice(start, start + pageSize);
  const totalPages = Math.ceil(sortedRows.length / pageSize);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const requestRoleChange = (row, role) => {
    setRoleChangeError("");
    setPendingRoleChange({
      employeeId: row.id,
      employeeName: row.name,
      roleId: role.roleId,
      roleName: role.label,
    });
  };

  const handleRoleChange = async () => {
    if (!pendingRoleChange) return;

    const previousRows = [...rows];
    setRoleChangeError("");
    setRoleChangeLoading(true);
    // Optimistic UI update
    setRows((prev) =>
      prev.map((row) =>
        row.id === pendingRoleChange.employeeId
          ? { ...row, role_id: pendingRoleChange.roleId }
          : row,
      ),
    );

    try {
      await AdminUserRolesAPI.assignRole({
        userRole: {
          employee_id: pendingRoleChange.employeeId,
          role_id: pendingRoleChange.roleId,
        },
      });
      setPendingRoleChange(null);
      showToast(
        "success",
        `Role for ${pendingRoleChange.employeeName} updated successfully.`,
      );
    } catch (error) {
      console.error(error);

      setRows(previousRows);
      const message = "Failed to update role. Please try again.";
      setRoleChangeError(message);
      showToast("error", message);
    } finally {
      setRoleChangeLoading(false);
    }
  };

  const closeRoleChangeConfirmation = () => {
    if (roleChangeLoading) return;
    setPendingRoleChange(null);
    setRoleChangeError("");
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <strong>User Roles</strong>
              <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2">
                <CFormInput
                  type="search"
                  placeholder="Search users"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search users"
                  size="sm"
                  style={{ minWidth: "220px" }}
                />
                <CFormSelect
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                  aria-label="Rows per page"
                  size="sm"
                  style={{ minWidth: "130px" }}
                >
                  {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size} rows
                    </option>
                  ))}
                </CFormSelect>
              </div>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <div className="d-flex justify-content-center py-5">
                  <CSpinner color="primary" aria-label="Loading users" />
                </div>
              ) : error ? (
                <CAlert
                  color="danger"
                  className="d-flex align-items-center justify-content-between gap-3 mb-0"
                >
                  <span>{error}</span>
                  <CButton
                    color="danger"
                    variant="outline"
                    size="sm"
                    onClick={fetchRoles}
                  >
                    Try again
                  </CButton>
                </CAlert>
              ) : (
                <>
                  <UserRolesTable
                    rows={visibleRows}
                    rowCount={sortedRows.length}
                    start={start}
                    page={page}
                    totalPages={totalPages}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    onPageChange={setPage}
                    onRoleChange={requestRoleChange}
                  />
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <ConfirmActionModal
        visible={Boolean(pendingRoleChange)}
        title="Confirm role change?"
        message={
          pendingRoleChange
            ? `Change "${pendingRoleChange.employeeName}"'s role to "${pendingRoleChange.roleName}"?`
            : ""
        }
        confirmLabel="Change role"
        loadingLabel="Updating..."
        confirmColor="primary"
        loading={roleChangeLoading}
        error={roleChangeError}
        onClose={closeRoleChangeConfirmation}
        onConfirm={handleRoleChange}
      />
    </>
  );
}
