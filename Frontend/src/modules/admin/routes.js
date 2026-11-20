import React from "react";

const AuditTrail = React.lazy(
  () => import("./views/pages/AuditTrail/AuditTrail"),
);
const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const RecentlyCreated = React.lazy(
  () => import("./views/dashboard/RecentlyCreated/RecentlyCreated"),
);
const UserRoles = React.lazy(() => import("./views/pages/UserRoles/UserRoles"));
const Trash = React.lazy(() => import("./views/pages/Trash/Trash"));
const Workflows = React.lazy(() => import("./views/pages/Workflows/Workflows"));

const GlobalRoles = React.lazy(
  () => import("./views/pages/GlobalRoles/GlobalRoles"),
);
const WorkflowActions = React.lazy(
  () => import("./views/pages/WorkflowActions/WorkflowActions"),
);
const WorkflowRoles = React.lazy(
  () => import("./views/pages/WorkflowRole/WorkflowRole"),
);
const DocumentReport = React.lazy(
  () => import("./views/admin-module/document-report/document-reports.jsx"),
);
const SharingReports = React.lazy(
  () => import("./views/admin-module/sharing-reports/sharing-reports.jsx"),
);
const PriorityNotice = React.lazy(
  () => import("./views/admin-module/priority-notice/priority-notice.jsx"),
);
const UserReport = React.lazy(
  () => import("./views/admin-module/user-report/UserReport"),
);
const ReviewReport = React.lazy(
  () => import("./views/admin-module/review-report/review-report.jsx"),
);


const HindiReport = React.lazy(
  () => import("./views/admin-module/hindi-report/hindi-report.jsx"),
);

const ContentMetadata = React.lazy(
  () => import("./views/pages/ContentMetadata/ContentMetadata"),
);
const CoreUIIcons = React.lazy(
  () => import("./views/icons/coreui-icons/CoreUIIcons"),
);
const Organisation = React.lazy(
  () => import("./views/pages/Organisation/Organisation"),
);
const Category = React.lazy(() => import("./views/pages/Category/Category"));
const Audience = React.lazy(() => import("./views/pages/Audience/Audience"));
const Type = React.lazy(() => import("./views/pages/Type/Type"));
const Language = React.lazy(() => import("./views/pages/Language/Language"));
const ContentType = React.lazy(
  () => import("./views/pages/ContentType/ContentType"),
);

const Flags = React.lazy(() => import("./views/icons/flags/Flags"));
const Brands = React.lazy(() => import("./views/icons/brands/Brands"));


export const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/audit-trail", name: "AuditTrail", element: AuditTrail },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  {
    path: "/recently-created",
    name: "Recently Created",
    element: RecentlyCreated,
  },
  { path: "/global-roles", name: "GlobalRoles", element: GlobalRoles },
  { path: "/user-roles", name: "UserRoles", element: UserRoles },
  { path: "/trash", name: "Trash", element: Trash },
  { path: "/workflows", name: "Workflows", element: Workflows },
  {
    path: "/workflow-actions",
    name: "WorkflowActions",
    element: WorkflowActions,
  },

  {
    path: "/workflow-roles",
    name: "WorkflowRoles",
    element: WorkflowRoles,
  },
  {
    path: "/document-report",
    name: "Document Report",
    element: DocumentReport,
  },
  {
    path: "/sharing-reports",
    name: "Sharing Reports",
    element: SharingReports,
  },

  {
    path: "/priority-notice",
    name: "Priority Notice",
    element: PriorityNotice,
  },
  {
    path: "/user-report",
    name: "User Report",
    element: UserReport,
  },

  {
    path: "/review-report",
    name: "Review Report",
    element: ReviewReport,
  },
  {
    path: "/review-report",
    name: "Review Report",
    element: ReviewReport,
  },
  {
    path: "/hindi-report",
    name: "Hindi Report",
    element: HindiReport,
  },
  {
    path: "/content-metadata",
    name: "Content Metadata",
    element: ContentMetadata,
  },
  { path: "/icons", exact: true, name: "Icons", element: CoreUIIcons },
  { path: "/icons/coreui-icons", name: "CoreUI Icons", element: CoreUIIcons },
  { path: "/icons/flags", name: "Flags", element: Flags },
  { path: "/icons/brands", name: "Brands", element: Brands },

  { path: "/organisation", name: "Organisation", element: Organisation },
  { path: "/category", name: "Category", element: Category },
  { path: "/audience", name: "Audience", element: Audience },
  { path: "/type", name: "Type", element: Type },
  { path: "/language", name: "Language", element: Language },
  { path: "/content-type", name: "Content Type", element: ContentType },
];

export default routes;
