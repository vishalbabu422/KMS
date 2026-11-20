import api from "../../../api/axios.config";

export const AdminRecentlyCreatedAPI = {
  getRecentlyCreated: (params) => api.get("/admin/recentlyCreated", { params }),
};

export const AdminDashboardCountsAPI = {
  getDashboardCount: (filter) =>
    api.get("/admin/dashboard-counts", { params: { filter } }),
};

export const AdminDashboardActivityAPI = {
  getDashboardActivity: (params) => api.get("/admin/auditTrail", { params }),
};

export const AdminDashboardYearlyDataAPI = {
  getDashboardYearlyData: () => api.get("/admin/dashboard-valid-year"),
};

export const AdminDashboardGraphDataAPI = {
  getDashboardYearlyData: (params) =>
    api.get("/admin/dashboard-yearly-report", { params }),
};

export const AdminGlobalRolesAPI = {
  globalRolesList: (params) => api.get("/admin/globalRolesList", { params }),
  getMenuList: () => api.get("/admin/menuList"),
  getRoleMenus: (roleId) =>
    api.get("/admin/userRolePermission", { params: { role_id: roleId } }),
  updateRoleMenus: (payload) => api.put("/admin/userRolePermission", payload),
};

export const AdminUserRolesAPI = {
  getUsers: (params) => api.get("/users", { params }),
  assignRole: (payload) => api.post("/users/userRoleMapping", payload),
};

export const AdminOrganisationAPI = {
  getOrganisation: (params) => api.get("/admin/organisationMaster", { params }),
  createOrganisation: (payload) =>
    api.post("/admin/organisationMaster", payload),
  updateOrganisation: (id, payload) =>
    api.patch(`/admin/organisationMaster/${id}`, payload),
  deleteOrganisation: (id) => api.delete(`/admin/organisationMaster/${id}`),
};

export const AdminCategoryAPI = {
  getCategories: (params) => api.get("/admin/categoryMaster", { params }),
  createCategory: (payload) => api.post("/admin/categoryMaster", payload),
  updateCategory: (id, payload) =>
    api.patch(`/admin/categoryMaster/${id}`, payload),
  deleteCategory: (id) => api.delete(`/admin/categoryMaster/${id}`),
};

export const AdminAudienceAPI = {
  getAudiences: (params) => api.get("/admin/AudienceMaster", { params }),
  createAudience: (payload) => api.post("/admin/AudienceMaster", payload),
  updateAudience: (id, payload) =>
    api.put(`/admin/AudienceMaster/${id}`, payload),
  deleteAudience: (id) => api.delete(`/admin/AudienceMaster/${id}`),
};

export const AdminTypeAPI = {
  getTypes: (params) => api.get("/admin/typeMaster", { params }),
  createType: (payload) => api.post("/admin/typeMaster", payload),
  updateType: (id, payload) => api.put(`/admin/typeMaster/${id}`, payload),
  deleteType: (id) => api.delete(`/admin/typeMaster/${id}`),
};

export const AdminLanguageAPI = {
  getLanguages: (params) => api.get("/admin/languageMaster", { params }),
  createLanguage: (payload) => api.post("/admin/languageMaster", payload),
  updateLanguage: (id, payload) =>
    api.put(`/admin/languageMaster/${id}`, payload),
  deleteLanguage: (id) => api.delete(`/admin/languageMaster/${id}`),
};

export const AdminContentTypeAPI = {
  getContentTypes: (params) => api.get("/admin/contentType", { params }),
  createContentType: (payload) => api.post("/admin/contentType", payload),
  updateContentType: (id, payload) =>
    api.put(`/admin/contentType/${id}`, payload),
  deleteContentType: (id) => api.delete(`/admin/contentType/${id}`),
};

export const AdminContentMetadataAPI = {
  getContentMetadata: (params) => api.get("/admin/contentMetadata", { params }),
  createContentMetadata: (payload) =>
    api.post("/admin/contentMetadata", payload),
  updateContentMetadata: (id, payload) =>
    api.put(`/admin/contentMetadata/${id}`, payload),
  deleteContentMetadata: (id) => api.delete(`/admin/contentMetadata/${id}`),
};

export const AdminTrashAPI = {
  getTrashList: (params) => api.get("/admin/trashList", { params }),
  restoreItem: (id) => api.put(`/admin/trashList/${id}`),
  deleteItem: (id) => api.delete(`/admin/trashList/${id}`),
};

export const AdminWorkflowAPI = {
  getWorkflows: (params) => api.get("/admin/workflowMaster", { params }),
  createWorkflow: (payload) => api.post("/admin/workflowMaster", payload),
  updateWorkflow: (id, payload) =>
    api.put(`/admin/workflowMaster/${id}`, payload),
  deleteWorkflow: (id) => api.delete(`/admin/workflowMaster/${id}`),
  getWorkflow: (id) => api.get(`/admin/workflowMaster/${id}`),
};

export const AdminWorkflowActionAPI = {
  getWorkflowActions: (params) => api.get("/admin/workflowAction", { params }),
  createWorkflowAction: (payload) => api.post("/admin/workflowAction", payload),
  updateWorkflowAction: (id, payload) =>
    api.put(`/admin/workflowAction/${id}`, payload),
  deleteWorkflowAction: (id) => api.delete(`/admin/workflowAction/${id}`),
};

export const AdminWorkflowRoleAPI = {
  getWorkflowRoles: (params) => api.get("/admin/workflowRole", { params }),
  createWorkflowRole: (payload) => api.post("/admin/workflowRole", payload),
  updateWorkflowRole: (id, payload) =>
    api.put(`/admin/workflowRole/${id}`, payload),
  deleteWorkflowRole: (id) => api.delete(`/admin/workflowRole/${id}`),
  getWorkflowRole: (id) => api.get(`/admin/workflowRole/${id}`),
};

export const AuditTrailAPI = {
  getAuditTrails: (params) => api.get("/admin/auditTrail", { params }),
};
