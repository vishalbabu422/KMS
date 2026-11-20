/**
 * App Component
 *
 * Root application component that sets up routing, theme management,
 * and lazy-loaded page components with suspense boundaries.
 *
 * Features:
 * - Admin routes mounted under the application's BrowserRouter at /admin
 * - Theme detection from URL parameters and Redux state
 * - Lazy loading for all routes with loading spinner fallback
 * - Public routes (login, register, error pages)
 * - Protected routes wrapped in DefaultLayout
 *
 * @module AdminApp
 */

import React, { Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import store from './store'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Error pages
const Page404 = React.lazy(() => import('./views/error-pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/error-pages/page500/Page500'))

/**
 * Admin Module Component
 *
 * Manages admin-module concerns:
 * - Theme initialization and persistence
 * - Admin route configuration
 * - Lazy loading with suspense fallbacks
 * - Theme detection from URL query parameters
 *
 * Theme priority:
 * 1. URL parameter (?theme=dark)
 * 2. Redux stored theme
 * 3. Browser/system preference (auto)
 *
 * @component
 * @returns {React.ReactElement} Application root with routing
 *
 * @example
 * // Standard usage in index.js
 * import AdminApp from './AdminApp'
 */
const AdminContent = () => {
  const { colorMode, isColorModeSet, setColorMode } = useColorModes(
    'coreui-free-react-admin-template-theme',
  )
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="admin-module" data-coreui-theme={colorMode}>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route path="error-pages/404" name="Page 404" element={<Page404 />} />
          <Route path="error-pages/500" name="Page 500" element={<Page500 />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default function AdminApp() {
  return (
    <Provider store={store}>
      <AdminContent />
    </Provider>
  )
}
