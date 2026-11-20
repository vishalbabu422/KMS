
import React, { useMemo, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFolderOpen } from '@coreui/icons'
import './hindi-report.css'

const repositoryOptions = [
  { label: 'All', value: 'All' },
  { label: 'Docs', value: 'Docs' },
  { label: 'Collection', value: 'Collection' },
]

const sampleHindiReportData = [
  {
    id: 'hindi-sample-1',
    path: 'KMS / Hindi / Knowledge Base',
    folderName: 'Hindi Knowledge Base Collection',
    count: 32,
    repository: 'Collection',
    createdOn: '2026-11-05',
  },
  {
    id: 'hindi-sample-2',
    path: 'KMS / Hindi / User Guides',
    folderName: 'KMS Hindi User Guides',
    count: 18,
    repository: 'Docs',
    createdOn: '2026-11-03',
  },
  {
    id: 'hindi-sample-3',
    path: 'KMS / Hindi / Digital Archives',
    folderName: 'Hindi Digital Archive Collection',
    count: 24,
    repository: 'Collection',
    createdOn: '2026-10-28',
  },
  {
    id: 'hindi-sample-4',
    path: 'KMS / Hindi / Document Management',
    folderName: 'Hindi Document Management Manuals',
    count: 11,
    repository: 'Docs',
    createdOn: '2026-10-21',
  },
  {
    id: 'hindi-sample-5',
    path: 'KMS / Hindi / Training Materials',
    folderName: 'KMS Hindi Training Documents',
    count: 14,
    repository: 'Docs',
    createdOn: '2026-10-14',
  },
]

const HindiReport = ({
  data = sampleHindiReportData,
  onSearch,
  onViewFolder,
}) => {
  const [repository, setRepository] = useState('All')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const [appliedFilters, setAppliedFilters] = useState({
    repository: 'All',
    fromDate: '',
    toDate: '',
  })

  const [loading, setLoading] = useState(false)

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemDate = item.createdOn || item.date || ''

      if (itemDate && appliedFilters.fromDate && itemDate < appliedFilters.fromDate) {
        return false
      }

      if (itemDate && appliedFilters.toDate && itemDate > appliedFilters.toDate) {
        return false
      }

      if (
        appliedFilters.repository !== 'All' &&
        item.repository !== appliedFilters.repository
      ) {
        return false
      }

      return true
    })
  }, [data, appliedFilters])

  const handleSearch = async () => {
    if (fromDate && toDate && fromDate > toDate) {
      window.alert('From Date cannot be greater than To Date.')
      return
    }

    const filters = {
      repository,
      fromDate,
      toDate,
    }

    setAppliedFilters(filters)

    if (onSearch) {
      setLoading(true)
      try {
        await onSearch(filters)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="hindi-report-page">

      {/* PAGE HEADING */}
      <div className="hindi-report-heading">
        <div>
          <h4>Hindi Report</h4>
          <p>View repository-wise folder details.</p>
        </div>
      </div>

      {/* FILTER SECTION */}
      <CCard className="hindi-report-filter-card">
        <CCardBody>
          <CRow className="align-items-end g-3">

            {/* REPOSITORY */}
            <CCol xl={3} lg={3} md={6} sm={12}>
              <label
                className="hindi-report-label"
                htmlFor="repository"
              >
                Select Repository
              </label>

              <CFormSelect
                id="repository"
                value={repository}
                onChange={(e) => setRepository(e.target.value)}
              >
                {repositoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {/* FROM DATE */}
            <CCol xl={3} lg={3} md={6} sm={6}>
              <label
                className="hindi-report-label"
                htmlFor="fromDate"
              >
                From Date :
              </label>

              <CFormInput
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </CCol>

            {/* TO DATE */}
            <CCol xl={3} lg={3} md={6} sm={6}>
              <label
                className="hindi-report-label"
                htmlFor="toDate"
              >
                To Date :
              </label>

              <CFormInput
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </CCol>

            {/* SEARCH */}
            <CCol xl={2} lg={2} md={3} sm={6}>
              <CButton
                className="hindi-report-search-btn"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </CButton>
            </CCol>

          </CRow>
        </CCardBody>
      </CCard>

      {/* REPORT TABLE */}
      <CCard className="hindi-report-table-card">
        <CCardBody>

          <div className="hindi-report-table-toolbar">
            <div>
              <h5>Folder Details</h5>
              <span className="hindi-report-table-subtitle">
                Repository-wise folder summary
              </span>
            </div>

            <div className="hindi-report-record-count">
              Total Records:
              <strong>{filteredData.length}</strong>
            </div>
          </div>

          <div className="hindi-report-table-wrapper">
            <CTable
              responsive
              className="hindi-report-table"
            >
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Path</CTableHeaderCell>
                  <CTableHeaderCell>Folder Name</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Count
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <CTableRow key={item.id || index}>
                      <CTableDataCell>
                        <span className="hindi-report-path">
                          {item.path || '-'}
                        </span>
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="hindi-report-folder">
                          <CIcon
                            icon={cilFolderOpen}
                            className="hindi-report-folder-icon"
                          />
                          <span>{item.folderName || '-'}</span>
                        </div>
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        {item.count ?? 0}
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        {onViewFolder ? (
                          <CButton
                            className="hindi-report-view-btn"
                            onClick={() => onViewFolder(item)}
                          >
                            View
                          </CButton>
                        ) : (
                          <span className="hindi-report-dash">-</span>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow className="hindi-report-empty-row">
                    <CTableDataCell
                      colSpan={4}
                      className="hindi-report-empty"
                    >
                      <div className="hindi-report-empty-content">
                        <CIcon
                          icon={cilFolderOpen}
                          className="hindi-report-empty-icon"
                          aria-hidden="true"
                        />
                        <strong>No data available</strong>
                        <span>Try changing the repository or date filters.</span>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>

          <div className="hindi-report-table-footer">
            Showing {filteredData.length} record(s)
          </div>

        </CCardBody>
      </CCard>
    </div>
  )
}

export default HindiReport
