
import React, { useMemo, useState } from 'react'
import { CCard, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFile, cilSearch, cilSortAscending } from '@coreui/icons'
import './RecentlyCreated.css'

const documentData = [
  {
    id: 1,
    date: '12/09/2025',
    title: 'Akansha',
    type: 'Document',
    createdBy: 'Sarita',
    status: 'Private',
  },
  {
    id: 2,
    date: '15/09/2025',
    title: 'Office Guidelines',
    type: 'PDF',
    createdBy: 'Rahul',
    status: 'Published',
  },
  {
    id: 3,
    date: '18/09/2025',
    title: 'Annual Report',
    type: 'Report',
    createdBy: 'Priya',
    status: 'Private',
  },
  {
    id: 4,
    date: '22/09/2025',
    title: 'Department Policy',
    type: 'Document',
    createdBy: 'Amit',
    status: 'Published',
  },
  {
    id: 5,
    date: '25/09/2025',
    title: 'Meeting Minutes',
    type: 'Document',
    createdBy: 'Sarita',
    status: 'Draft',
  },
  {
    id: 6,
    date: '28/09/2025',
    title: 'Risk Assessment',
    type: 'Report',
    createdBy: 'Neha',
    status: 'Draft',
  },
  {
    id: 7,
    date: '02/10/2025',
    title: 'Project Proposal',
    type: 'Document',
    createdBy: 'Karan',
    status: 'Private',
  },
  {
    id: 8,
    date: '05/10/2025',
    title: 'Training Schedule',
    type: 'Spreadsheet',
    createdBy: 'Meera',
    status: 'Published',
  },
  {
    id: 9,
    date: '11/10/2025',
    title: 'Budget Overview',
    type: 'Spreadsheet',
    createdBy: 'Vikram',
    status: 'Private',
  },
  {
    id: 10,
    date: '16/10/2025',
    title: 'Client Brief',
    type: 'PDF',
    createdBy: 'Anjali',
    status: 'Published',
  },
]

const RecentlyCreated = ({ period, dateRange }) => {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('Newest')
  const [sortColumn, setSortColumn] = useState('date')
  const [ascending, setAscending] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 5

  const filteredData = useMemo(() => {
    let result = documentData.filter((item) =>
      Object.values(item).join(' ').toLowerCase().includes(search.toLowerCase())
    )

    result = [...result].sort((a, b) => {
      let valueA = a[sortColumn]
      let valueB = b[sortColumn]

      if (sortColumn === 'date') {
        const parseDate = (value) => {
          const [day, month, year] = value.split('/')
          return new Date(`${year}-${month}-${day}`).getTime()
        }

        valueA = parseDate(valueA)
        valueB = parseDate(valueB)
      } else {
        valueA = String(valueA).toLowerCase()
        valueB = String(valueB).toLowerCase()
      }

      if (valueA < valueB) return ascending ? -1 : 1
      if (valueA > valueB) return ascending ? 1 : -1

      return 0
    })

    return result
  }, [search, sortColumn, ascending])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize))

  const page = Math.min(currentPage, totalPages)

  const visibleData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  const handleSort = (column) => {
    if (sortColumn === column) {
      setAscending(!ascending)
    } else {
      setSortColumn(column)
      setAscending(true)
    }

    setCurrentPage(1)
  }

  const handleSortBy = (value) => {
    setSortBy(value)
    setSortColumn('date')
    setAscending(value === 'Oldest')
    setCurrentPage(1)
  }

  return (
    <CCard className="recently-created-card">
      <CCardBody>

        {/* Header */}
        <div className="recently-created-header">

          <div className="recently-created-title">
            <span className="recently-created-icon">
              <CIcon icon={cilFile} size="lg" />
            </span>
            <h5>Recently Created</h5>
          </div>

          <div className="recently-created-controls">

            <div className="recent-search">
              <CIcon icon={cilSearch} size="lg" />

              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => handleSortBy(e.target.value)}
            >
              <option value="Newest">Sort by : Newest</option>
              <option value="Oldest">Sort by : Oldest</option>
            </select>

          </div>

        </div>

        {/* Table */}
        <div className="recent-table-responsive">

          <table className="recent-document-table">

            <thead>
              <tr>
                <th>S.No</th>
                <th onClick={() => handleSort('date')}>
                  Date <CIcon icon={cilSortAscending} />
                </th>

                <th onClick={() => handleSort('title')}>
                  Title <CIcon icon={cilSortAscending} />
                </th>

                <th onClick={() => handleSort('type')}>
                  Type <CIcon icon={cilSortAscending} />
                </th>

                <th onClick={() => handleSort('createdBy')}>
                  Created by <CIcon icon={cilSortAscending} />
                </th>

                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {visibleData.length > 0 ? (
                visibleData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{(page - 1) * pageSize + index + 1}</td>
                    <td>{item.date}</td>
                    <td>{item.title}</td>
                    <td>{item.type}</td>
                    <td>{item.createdBy}</td>

                    <td>
                      <span className={`recent-status ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="recent-no-data">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>

        {/* Footer */}
        <div className="recent-table-footer">

          <span>
            Showing {filteredData.length === 0 ? 0 : (page - 1) * pageSize + 1}
            {' '}to {Math.min(page * pageSize, filteredData.length)}
            {' '}of {filteredData.length} entries
          </span>

          <div className="recent-pagination">

            <button
              disabled={page === 1}
              onClick={() => setCurrentPage(page - 1)}
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                className={page === number ? 'active' : ''}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setCurrentPage(page + 1)}
            >
              ›
            </button>

          </div>

        </div>

      </CCardBody>
    </CCard>
  )
}

export default RecentlyCreated
