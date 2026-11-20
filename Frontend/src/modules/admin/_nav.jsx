import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilBug,
  cilDescription,
  cilFile,
  cilFolderOpen,
  cilHistory,
  cilLanguage,
  cilLayers,
  cilPencil,
  cilPeople,
  cilSettings,
  cilSpeedometer,
  cilStar,
  cilStorage,
  cilTrash,
  cilUser,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Global Roles",
    to: "/global-roles",
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "User Role Mapping",
    to: "/user-roles",
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Workflows",
    to: "/workflows",
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Workflow Action",
    to: "/workflow-actions",
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Workflow Roles",
    to: "/workflow-roles",
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Content Type",
    to: "/content-type",
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Content Metadata",
    to: "/content-metadata",
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: "Metadata Modules",
    manualToggleOnly: true,
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Organisation",
        to: "/organisation",
      },
      {
        component: CNavItem,
        name: "Category",
        to: "/category",
      },
      {
        component: CNavItem,
        name: "Audience",
        to: "/audience",
      },
      {
        component: CNavItem,
        name: "Type",
        to: "/type",
      },
      {
        component: CNavItem,
        name: "Language",
        to: "/language",
      },
    ],
  },

  {
    component: CNavGroup,
    name: "Admin Module",
    manualToggleOnly: true,
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Document Report",
        to: "/document-report",
      },
      {
        component: CNavItem,
        name: "Sharing Reports",
        to: "/sharing-reports",
      },
      {
        component: CNavItem,
        name: "Priority Notice",
        to: "/priority-notice",
      },
      {
        component: CNavItem,
        name: "User Report",
        to: "/user-report",
      },

{
        component: CNavItem,
        name: "Review Report",
        to: "/review-report",
      },

      {
        component: CNavItem,
        name: "Hindi Report",
        to: "/hindi-report",
      },
    ],
  },

  {
    component: CNavItem,
    name: "Trash",
    to: "/trash",
    icon: <CIcon icon={cilTrash} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Audit Trail",
    to: "/audit-trail",
    icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Local Language",
    to: "/local-language",
    icon: <CIcon icon={cilLanguage} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Storage",
    to: "/storage",
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: "Icons",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "CoreUI Free",
        to: "/icons/coreui-icons",
      },
      {
        component: CNavItem,
        name: "CoreUI Flags",
        to: "/icons/flags",
      },
      {
        component: CNavItem,
        name: "CoreUI Brands",
        to: "/icons/brands",
      },
    ],
  },
  {
    component: CNavTitle,
    name: "Extras",
  },
  {
    component: CNavGroup,
    name: "Error pages",
    icon: <CIcon icon={cilBug} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Error 404",
        to: "/error-pages/404",
      },
      {
        component: CNavItem,
        name: "Error 500",
        to: "/error-pages/500",
      },
    ],
  },
];

const prefixAdminPath = (item) => ({
  ...item,
  ...(item.to && { to: item.to === "/" ? "/admin" : `/admin${item.to}` }),
  ...(item.items && { items: item.items.map(prefixAdminPath) }),
});

export default _nav.map(prefixAdminPath);
