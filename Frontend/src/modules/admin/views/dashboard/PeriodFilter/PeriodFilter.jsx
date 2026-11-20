
import React, { useState } from 'react'
import {
  CButton,
  CDropdown,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CFormLabel,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCalendar,
  cilChevronBottom,
  cilReload,
  cilInfo,
} from '@coreui/icons'

import './PeriodFilter.css'

const PeriodFilter = ({
  period,
  setPeriod,
  dateRange,
  setDateRange,
}) => {
  const [showCustom, setShowCustom] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('10:42 AM')

  const periods = [
    'Today',
    'Last 7 Days',
    'Last 30 Days',
    'This Year',
  ]

  const handlePeriodChange = (value) => {
    setPeriod(value)
    setShowCustom(false)
  }

  const handleApply = () => {
    if (!dateRange.fromDate || !dateRange.toDate) {
      return
    }

    if (dateRange.fromDate > dateRange.toDate) {
      alert('From Date cannot be greater than To Date')
      return
    }

    setPeriod('Custom Range')
    setShowCustom(false)
  }

  const handleRefresh = () => {
    setLastUpdated(
      new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    )

    window.dispatchEvent(new Event('kms-dashboard-refresh'))
  }

  return (
    <div className="kms-period-wrapper">

      {/* LEFT SECTION */}
      <div className="kms-period-left">

        <div className="kms-period-title">
          <CIcon icon={cilCalendar} />
          <strong>Period</strong>
        </div>

        {/* Period Buttons */}
        <div className="kms-period-buttons">
          {periods.map((item) => (
            <button
              type="button"
              key={item}
              className={period === item ? 'active' : ''}
              onClick={() => handlePeriodChange(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="kms-period-divider" />

        {/* Custom Range */}
        <CDropdown
          className="kms-custom-container"
          placement="bottom-start"
          offset={[0, 4]}
          popper
          autoClose="outside"
          visible={showCustom}
          onShow={() => setShowCustom(true)}
          onHide={() => setShowCustom(false)}
        >
          <CDropdownToggle
            type="button"
            color="light"
            size="sm"
            caret={false}
            className={`kms-custom-btn ${
              period === 'Custom Range' ? 'active-custom' : ''
            }`}
          >
            <span>Custom Range</span>
            <CIcon icon={cilChevronBottom} className="kms-dropdown-arrow" />
          </CDropdownToggle>

          <CDropdownMenu as="div" className="kms-custom-dropdown">
            <div className="kms-date-field">
              <CFormLabel htmlFor="period-filter-from-date">From Date</CFormLabel>
              <CFormInput
                id="period-filter-from-date"
                type="date"
                value={dateRange.fromDate}
                onChange={(event) =>
                  setDateRange({
                    ...dateRange,
                    fromDate: event.target.value,
                  })
                }
              />
            </div>

            <div className="kms-date-field">
              <CFormLabel htmlFor="period-filter-to-date">To Date</CFormLabel>
              <CFormInput
                id="period-filter-to-date"
                type="date"
                min={dateRange.fromDate || undefined}
                value={dateRange.toDate}
                onChange={(event) =>
                  setDateRange({
                    ...dateRange,
                    toDate: event.target.value,
                  })
                }
              />
            </div>

            <div className="kms-date-actions">
              <CButton
                type="button"
                color="secondary"
                variant="outline"
                size="sm"
                className="kms-clear-btn"
                onClick={() => {
                  setDateRange({
                    fromDate: '',
                    toDate: '',
                  })
                  setPeriod('Today')
                  setShowCustom(false)
                }}
              >
                Clear
              </CButton>

              <CButton
                type="button"
                color="primary"
                size="sm"
                className="kms-apply-btn"
                onClick={handleApply}
              >
                Apply
              </CButton>
            </div>
          </CDropdownMenu>
        </CDropdown>

      </div>

      {/* RIGHT SECTION */}
      <div className="kms-period-right">

        <button
          type="button"
          className="kms-refresh-btn"
          title="Refresh Dashboard"
          onClick={handleRefresh}
        >
          <CIcon icon={cilReload} />
        </button>

        <span className="kms-updated-text">
          Last Updated: {lastUpdated}
        </span>

        <span className="kms-period-info" title="Dashboard last updated time">
          <CIcon icon={cilInfo} />
        </span>

      </div>

    </div>
  )
}

export default PeriodFilter
