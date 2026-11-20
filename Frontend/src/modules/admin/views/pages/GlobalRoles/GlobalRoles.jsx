import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSpinner,
} from "@coreui/react";
import { AdminGlobalRolesAPI } from "../../../services/api";
import toaster from "@/utils/toaster";
import GlobalRolePermissionsModal from "./GlobalRolePermissionsModal";
import GlobalRolesTable from "./GlobalRolesTable";

const PAGE_SIZES = [5, 10, 20, 50];

export default function GlobalRoles() {
  const showToast = useCallback((type, message) => {
    toaster(type, message);
  }, []);

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [checkedMenus, setCheckedMenus] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await AdminGlobalRolesAPI.globalRolesList();
      const list = response?.data?.data?.roles ?? [];
      setRows(
        list.map((item) => ({
          id: item.id,
          name: item.role_name ?? "",
          status: item.status,
        })),
      );
    } catch (requestError) {
      console.error(requestError);
      const message = "Failed to load roles. Please try again.";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      String(row.name ?? "").toLowerCase().includes(query),
    );
  }, [rows, search]);

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows;
    return [...filteredRows].sort((first, second) => {
      const firstValue = String(first[sortConfig.key] ?? "").toLowerCase();
      const secondValue = String(second[sortConfig.key] ?? "").toLowerCase();
      return sortConfig.direction === "asc"
        ? firstValue.localeCompare(secondValue)
        : secondValue.localeCompare(firstValue);
    });
  }, [filteredRows, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const rowStart = sortedRows.length === 0 ? 0 : (safePage - 1) * pageSize;
  const visibleRows = sortedRows.slice(rowStart, rowStart + pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleSort = (key) => {
    setSortConfig((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
    setMenuList([]);
    setCheckedMenus([]);
    setSaveError("");
    setSaveSuccess("");
  };

  const openPermissionModal = async (role) => {
    setSelectedRole(role);
    setShowModal(true);
    setSaveError("");
    setSaveSuccess("");

    try {
      const [menuResponse, roleResponse] = await Promise.all([
        AdminGlobalRolesAPI.getMenuList(),
        AdminGlobalRolesAPI.getRoleMenus(role.id),
      ]);

      const menuData = menuResponse?.data?.data?.menu ?? [];
      const permissionData = roleResponse?.data?.data?.modules_list ?? [];
      setMenuList(menuData);
      setCheckedMenus(permissionData.map(String));
    } catch (requestError) {
      console.error(requestError);
      const message = "Unable to load role permissions.";
      setSaveError(message);
      showToast("error", message);
    }
  };

  const getChildIds = (children = []) =>
    children.map((child) => String(child.id));

  const isParentChecked = (parent) => {
    const children = parent.children ?? [];
    if (children.length === 0) {
      return checkedMenus.includes(String(parent.id));
    }

    return children.every((child) => checkedMenus.includes(String(child.id)));
  };

  const toggleParent = (parent) => {
    const parentId = String(parent.id);
    const childIds = getChildIds(parent.children ?? []);

    if (isParentChecked(parent)) {
      setCheckedMenus((previous) =>
        previous.filter((id) => id !== parentId && !childIds.includes(id)),
      );
      return;
    }

    setCheckedMenus((previous) =>
      Array.from(new Set([...previous, parentId, ...childIds])),
    );
  };

  const toggleChild = (child, parent) => {
    const childId = String(child.id);
    const parentId = String(parent.id);

    setCheckedMenus((previous) => {
      let updated = previous.includes(childId)
        ? previous.filter((id) => id !== childId)
        : [...previous, childId];

      const allChildrenChecked = (parent.children ?? []).every((item) =>
        updated.includes(String(item.id)),
      );
      updated = allChildrenChecked
        ? [...updated, parentId]
        : updated.filter((id) => id !== parentId);

      return Array.from(new Set(updated));
    });
  };

  const buildPermissionPayload = () =>
    menuList
      .filter((parent) => {
        const parentChecked = checkedMenus.includes(String(parent.id));
        const anyChildChecked = (parent.children ?? []).some((child) =>
          checkedMenus.includes(String(child.id)),
        );
        return parentChecked || anyChildChecked;
      })
      .map((parent) => ({
        id: Number(parent.id),
        children: (parent.children ?? [])
          .filter((child) => checkedMenus.includes(String(child.id)))
          .map((child) => Number(child.id)),
      }));

  const savePermissions = async () => {
    if (!selectedRole) return;

    setSaving(true);
    setSaveError("");
    setSaveSuccess("");
    try {
      await AdminGlobalRolesAPI.updateRoleMenus({
        role_id: selectedRole.id,
        modules: buildPermissionPayload(),
      });

      const message = "Role permissions updated successfully.";
      setSaveSuccess(message);
      showToast("success", message);
      setTimeout(handleCloseModal, 700);
    } catch (requestError) {
      console.error(requestError);
      const message = "Failed to update permissions. Please try again.";
      setSaveError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Global Roles</strong>
          </CCardHeader>
          <CCardBody>
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <CFormLabel
                  customClassName="app-form-label"
                  htmlFor="global-roles-page-size"
                >
                  Show
                </CFormLabel>
                <CFormSelect
                  id="global-roles-page-size"
                  className="app-form-select w-auto"
                  size="sm"
                  value={pageSize}
                  onChange={(event) =>
                    setPageSize(Number(event.target.value) || 5)
                  }
                  aria-label="Rows per page"
                >
                  {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </CFormSelect>
                <span>entries</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <CFormLabel
                  customClassName="app-form-label"
                  htmlFor="global-roles-search"
                >
                  Search:
                </CFormLabel>
                <CFormInput
                  id="global-roles-search"
                  className="app-form-control w-auto"
                  type="search"
                  size="sm"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search roles"
                />
              </div>
            </div>

            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <CSpinner color="primary" aria-label="Loading roles" />
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
              <GlobalRolesTable
                rows={visibleRows}
                sortConfig={sortConfig}
                onSort={handleSort}
                rowStart={rowStart}
                rowCount={sortedRows.length}
                page={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
                onViewPermissions={openPermissionModal}
              />
            )}
          </CCardBody>
        </CCard>

        <GlobalRolePermissionsModal
          visible={showModal}
          selectedRole={selectedRole}
          menuList={menuList}
          checkedMenus={checkedMenus}
          saveError={saveError}
          saveSuccess={saveSuccess}
          saving={saving}
          isParentChecked={isParentChecked}
          onToggleParent={toggleParent}
          onToggleChild={toggleChild}
          onClose={handleCloseModal}
          onSave={savePermissions}
        />
      </CCol>
    </CRow>
  );
}
