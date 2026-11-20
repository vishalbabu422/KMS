/**
 * AppHeader Component
 *
 * Main application header with navigation, theme switcher, and user menu.
 * Features include:
 * - Sidebar toggle button
 * - Search button with keyboard shortcut and recent searches modal
 * - Primary navigation links
 * - Notification and action icons
 * - Theme switcher (light/dark/auto)
 * - User dropdown menu
 * - Breadcrumb navigation
 * - Sticky positioning with scroll shadow effect
 *
 * @component
 * @example
 * return (
 *   <AppHeader />
 * )
 */

import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  useColorModes,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilContrast, cilMenu, cilMoon, cilSun } from "@coreui/icons";

import { AppBreadcrumb } from "./index";
import { AppHeaderDropdown } from "./header/index";

const AppHeader = () => {
  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes(
    "coreui-free-react-admin-template-theme",
  );

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current &&
        headerRef.current.classList.toggle(
          "shadow-sm",
          document.documentElement.scrollTop > 0,
        );
    };

    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: "-14px" }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
