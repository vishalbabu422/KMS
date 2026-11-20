
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
import { cilFile, cilFolderOpen } from '@coreui/icons'
import './review-report.css'

const sampleReviewData = [
  {
    id: 'sample-1',
    type: 'collection',
    collectionDocumentName: 'KMS Document Management Collection',
    totalDocuments: 24,
    reviewed: 18,
  },
  {
    id: 'sample-2',
    type: 'document',
    collectionDocumentName: 'Knowledge Base User Guide.pdf',
    totalDocuments: 1,
    reviewed: 1,
  },
  {
    id: 'sample-3',
    type: 'collection',
    collectionDocumentName: 'Metadata Standards Collection',
    totalDocuments: 16,
    reviewed: 12,
  },
  {
    id: 'sample-4',
    type: 'document',
    collectionDocumentName: 'Digital Archive Procedures.pdf',
    totalDocuments: 1,
    reviewed: 1,
  },
  {
    id: 'sample-5',
    type: 'document',
    collectionDocumentName: 'Content Workflow Manual.pdf',
    totalDocuments: 1,
    reviewed: 0,
  },
]

const getReviewItemIcon = (item) => {
  const type = String(item.type ?? item.itemType ?? '').toLowerCase()
  const name = String(
    item.collectionDocumentName ??
      item.collection_document_name ??
      item.name ??
      '',
  )

  return type === 'collection' || (!type && /collection$/i.test(name))
    ? cilFolderOpen
    : cilFile
}

const ReviewReport = ({
  reviewerOptions = [],
  data = sampleReviewData,
  onSubmit,
}) => {
  const [reviewer, setReviewer] = useState('')
  const [reviewFrom, setReviewFrom] = useState('')
  const [reviewTill, setReviewTill] = useState('')

  const [search, setSearch] = useState('')
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: 'asc',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const newErrors = {}

    if (!reviewer) {
      newErrors.reviewer = 'Please select a reviewer.'
    }

    if (!reviewFrom) {
      newErrors.reviewFrom = 'Please select Review From date.'
    }

    if (!reviewTill) {
      newErrors.reviewTill = 'Please select Review Till date.'
    }

    if (reviewFrom && reviewTill && reviewFrom > reviewTill) {
      newErrors.reviewTill = 'Review Till cannot be earlier than Review From.'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    const filters = {
      reviewer,
      reviewFrom,
      reviewTill,
    }

    if (onSubmit) {
      setLoading(true)
      try {
        await onSubmit(filters)
      } finally {
        setLoading(false)
      }
    }
  }

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase()

    let result = data.filter((item) => {
      const name = String(
        item.collectionDocumentName ??
        item.collection_document_name ??
        item.name ??
        '',
      ).toLowerCase()

      return name.includes(query)
    })

    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        const firstValue = a[sortConfig.key] ?? ''
        const secondValue = b[sortConfig.key] ?? ''

        const comparison =
          typeof firstValue === 'number' && typeof secondValue === 'number'
            ? firstValue - secondValue
            : String(firstValue).localeCompare(String(secondValue), undefined, {
                numeric: true,
                sensitivity: 'base',
              })

        return sortConfig.direction === 'asc' ? comparison : -comparison
      })
    }

    return result
  }, [data, search, sortConfig])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / entriesPerPage))

  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage,
  )

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleSearchChange = (value) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleEntriesChange = (value) => {
    setEntriesPerPage(Number(value))
    setCurrentPage(1)
  }

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '↕'
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  const startRecord =
    filteredData.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1

  const endRecord = Math.min(
    currentPage * entriesPerPage,
    filteredData.length,
  )

  return (
    <div className="review-report-page">

      {/* PAGE HEADING */}
      <div className="review-report-heading">
        <h4>Review Report</h4>
        <p>View reviewer-wise document review details.</p>
      </div>

      {/* FILTER SECTION */}
      <CCard className="review-filter-card">
        <CCardBody>
       

          <CRow className="g-3 align-items-end">

            {/* REVIEWER */}
            <CCol xl={3} lg={3} md={6} sm={12}>
              <label
                htmlFor="reviewer"
                className="review-field-label"
              >
                Reviewer <span className="review-required">*</span>
              </label>

              <CFormSelect
                id="reviewer"
                value={reviewer}
                invalid={Boolean(errors.reviewer)}
                onChange={(e) => {
                  setReviewer(e.target.value)
                  setErrors((prev) => ({ ...prev, reviewer: '' }))
                }}
              >
                <option value="">Select Reviewer</option>

                {reviewerOptions.map((option) => (
                  <option
                    key={option.value ?? option.id}
                    value={option.value ?? option.id}
                  >
                    {option.label ?? option.name}
                  </option>
                ))}
              </CFormSelect>

              {errors.reviewer && (
                <div className="review-field-error">{errors.reviewer}</div>
              )}
            </CCol>

            {/* REVIEW FROM */}
            <CCol xl={3} lg={3} md={6} sm={6}>
              <label
                htmlFor="reviewFrom"
                className="review-field-label"
              >
                Review From <span className="review-required">*</span>
              </label>

              <CFormInput
                id="reviewFrom"
                type="date"
                value={reviewFrom}
                max={reviewTill || undefined}
                invalid={Boolean(errors.reviewFrom)}
                onChange={(e) => {
                  setReviewFrom(e.target.value)
                  setErrors((prev) => ({ ...prev, reviewFrom: '' }))
                }}
              />

              {errors.reviewFrom && (
                <div className="review-field-error">{errors.reviewFrom}</div>
              )}
            </CCol>

            {/* REVIEW TILL */}
            <CCol xl={3} lg={3} md={6} sm={6}>
              <label
                htmlFor="reviewTill"
                className="review-field-label"
              >
                Review Till <span className="review-required">*</span>
              </label>

              <CFormInput
                id="reviewTill"
                type="date"
                value={reviewTill}
                min={reviewFrom || undefined}
                invalid={Boolean(errors.reviewTill)}
                onChange={(e) => {
                  setReviewTill(e.target.value)
                  setErrors((prev) => ({ ...prev, reviewTill: '' }))
                }}
              />

              {errors.reviewTill && (
                <div className="review-field-error">{errors.reviewTill}</div>
              )}
            </CCol>

            {/* SEARCH */}
            <CCol xl={2} lg={2} md={6} sm={12}>
              <CButton
                className="review-submit-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </CButton>
            </CCol>

          </CRow>
        </CCardBody>
      </CCard>

      {/* RESULTS SECTION */}
      <CCard className="review-results-card">
        <CCardBody>

          <div className="review-results-header">
            <div>
              <h5>Review Details</h5>
              <p>Collection and document review summary</p>
            </div>

            <div className="review-record-count">
              Total Records:
              <strong>{filteredData.length}</strong>
            </div>
          </div>

          {/* TABLE CONTROLS */}
          <div className="review-table-controls">
            <div className="review-entries-control">
              <span>Show</span>

              <CFormSelect
                value={entriesPerPage}
                onChange={(e) => handleEntriesChange(e.target.value)}
                aria-label="Entries per page"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </CFormSelect>

              <span>entries</span>
            </div>

            <div className="review-search-control">
              <label htmlFor="reviewTableSearch">Search:</label>

              <CFormInput
                id="reviewTableSearch"
                type="search"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* RESULTS TABLE */}
          <div className="review-table-wrapper">
            <CTable responsive className="review-report-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>
                    <button
                      type="button"
                      className="review-sort-button"
                      onClick={() => handleSort('collectionDocumentName')}
                    >
                      Collection/Document Name
                      <span>{getSortIndicator('collectionDocumentName')}</span>
                    </button>
                  </CTableHeaderCell>

                  <CTableHeaderCell>
                    <button
                      type="button"
                      className="review-sort-button"
                      onClick={() => handleSort('totalDocuments')}
                    >
                      Total (Documents in Collection)
                      <span>{getSortIndicator('totalDocuments')}</span>
                    </button>
                  </CTableHeaderCell>

                  <CTableHeaderCell>
                    <button
                      type="button"
                      className="review-sort-button"
                      onClick={() => handleSort('reviewed')}
                    >
                      Reviewed
                      <span>{getSortIndicator('reviewed')}</span>
                    </button>
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <CTableRow key={item.id ?? index}>
                      <CTableDataCell>
                        <div className="review-item-name">
                          <CIcon
                            icon={getReviewItemIcon(item)}
                            className="review-item-icon"
                            aria-hidden="true"
                          />
                          <span>
                            {item.collectionDocumentName ??
                              item.collection_document_name ??
                              item.name ??
                              '-'}
                          </span>
                        </div>
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.totalDocuments ??
                          item.total_documents ??
                          item.total ??
                          0}
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.reviewed ?? item.reviewed_count ?? 0}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell
                      colSpan={3}
                      className="review-empty-state"
                    >
                      No data available in table
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>

          {/* TABLE FOOTER */}
          <div className="review-table-footer">
            <span>
              Showing {startRecord} to {endRecord} of {filteredData.length} entries
            </span>

            <div className="review-pagination">
              <CButton
                className="review-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                Previous
              </CButton>

              <span className="review-current-page">
                {currentPage}
              </span>

              <CButton
                className="review-page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                Next
              </CButton>
            </div>
          </div>

        </CCardBody>
      </CCard>
    </div>
  )
}

export default ReviewReport
