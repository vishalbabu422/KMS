
import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// Routes config
import { routes } from '../routes'

const AppContent = () => {
  return (
    <CContainer fluid className="app-content-container px-3">

      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>

          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}

          <Route
            path="/"
            element={<Navigate to="/admin/dashboard" replace />}
          />

        </Routes>
      </Suspense>

    </CContainer>
  )
}

export default React.memo(AppContent)
