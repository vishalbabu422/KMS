import React from 'react'
import DigitalIndiaLogo from '../../user/assets/images/svg/logo-digital-india.png'
import NICLogo from '../../user/assets/images/svg/logo-NIC.png'

const AppFooter = () => {
  return (
    <footer
      className="app-footer footer-theme flex-shrink-0"
      style={{ backgroundColor: '#002266', color: '#fff' }}
    >
      <div className="footer-background d-md-flex flex-column flex-md-row">
        <div
          className="footer-logo-bar d-flex flex-md-grow-1 pe-4"
          style={{ color: '#fff', minHeight: 60, alignItems: 'center' }}
        >
          <div className="ps-4">Version 9.0</div>
          <div className="d-none d-md-flex flex-md-grow-1">
            <p className="mb-0 flex-grow-1 text-center">
              eOffice is Mission Mode Project under the National E-Governance Plan,
              developed and implemented by National Informatics Centre (NIC) © 2026
            </p>
          </div>
          <div className="ms-auto d-md-flex" style={{ gap: 8 }}>
            <img
              className="footer-logo"
              src={DigitalIndiaLogo}
              alt="Digital India"
              style={{ maxHeight: 40, width: 'auto' }}
            />
            <img
              className="footer-logo"
              src={NICLogo}
              alt="NIC bilingual logo"
              style={{ maxHeight: 32, width: 'auto' }}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default React.memo(AppFooter)
