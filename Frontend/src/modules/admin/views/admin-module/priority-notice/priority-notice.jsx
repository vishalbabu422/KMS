import React, { useMemo, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";
import SetPriorityModal from "./SetPriorityModal.jsx";
import "./priority-notice.css";

const initialNoticeData = [
  { id: 1, title: "GQA Link", creator: "Gopal Gaur", date: "Sep 18, 2025" },
  {
    id: 2,
    title: "GQA Online Docs",
    creator: "Gopal Gaur",
    date: "Aug 28, 2025",
  },
  {
    id: 3,
    title: "Satru Doc 18A-Rename",
    creator: "Gopal Gaur",
    date: "Jul 16, 2025",
  },
  {
    id: 4,
    title: "Satru Doc 18A-Rename",
    creator: "Gopal Gaur",
    date: "Jun 05, 2025",
  },
  { id: 5, title: "GQA Link", creator: "Gopal Gaur", date: "May 22, 2025" },
  {
    id: 6,
    title: "GQA Online Docs",
    creator: "Gopal Gaur",
    date: "Apr 09, 2025",
  },
  {
    id: 7,
    title: "Satru Doc 18A-Rename",
    creator: "Gopal Gaur",
    date: "Mar 18, 2025",
  },
  {
    id: 8,
    title: "GQA Online Docs",
    creator: "Gopal Gaur",
    date: "Feb 03, 2025",
  },
  {
    id: 9,
    title: "GQA Online Docs",
    creator: "Gopal Gaur",
    date: "Jan 12, 2025",
  },
  {
    id: 10,
    title: "Satru Doc 18A-Rename",
    creator: "Gopal Gaur",
    date: "Dec 20, 2024",
  },
  {
    id: 11,
    title: "Satru Doc 18A-Rename",
    creator: "Gopal Gaur",
    date: "Nov 08, 2024",
  },
  {
    id: 12,
    title: "Satru Doc 18A-Rename",
    creator: "Gopal Gaur",
    date: "Oct 01, 2024",
  },
  {
    id: 13,
    title: "GQA Online Docs",
    creator: "Gopal Gaur",
    date: "Sep 14, 2024",
  },
];

const initialExistingDates = [
  "Sep 11, 2025",
  "Aug 28, 2025",
  "Jul 16, 2025",
  "Jun 05, 2025",
  "May 22, 2025",
  "Apr 09, 2025",
  "Mar 18, 2025",
  "Feb 03, 2025",
  "Jan 12, 2025",
  "Dec 20, 2024",
  "Nov 08, 2024",
  "Oct 01, 2024",
  "Sep 14, 2024",
];

const initialExistingData = initialExistingDates.map((date, index) => ({
  id: index + 101,
  title: "GQA Link",
  date,
  order: index + 1,
}));

const PAGE_SIZE = 13;

const compareNoticeValues = (first, second, key) => {
  if (key === "date") {
    const firstDate = Date.parse(first);
    const secondDate = Date.parse(second);

    if (Number.isFinite(firstDate) && Number.isFinite(secondDate)) {
      return firstDate - secondDate;
    }
  }

  if (typeof first === "number" && typeof second === "number") {
    return first - second;
  }

  return String(first).localeCompare(String(second), undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

const SearchBar = ({ value, onChange, onReset, placeholder = "Search" }) => (
  <div className="priority-search-group">
    <div className="priority-search-input">
      <CIcon icon={cilSearch} />
      <CFormInput
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>

    <CButton
      color="secondary"
      variant="outline"
      className="priority-reset-btn"
      onClick={onReset}
    >
      Reset
    </CButton>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems }) => {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, totalItems);

  return (
    <div className="priority-pagination">
      <div className="priority-pagination-info">
        Showing data {start} to {end} of {totalItems} entries
      </div>

      <div className="priority-pagination-buttons">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ‹
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              type="button"
              key={page}
              className={currentPage === page ? "active" : ""}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
};

const PriorityNotice = () => {
  const [availableNotices, setAvailableNotices] = useState(initialNoticeData);
  const [existingNotices, setExistingNotices] = useState(initialExistingData);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const [availableSearch, setAvailableSearch] = useState("");
  const [existingSearch, setExistingSearch] = useState("");

  const [availablePage, setAvailablePage] = useState(1);
  const [existingPage, setExistingPage] = useState(1);

  const [availableSort, setAvailableSort] = useState({
    key: "",
    direction: "asc",
  });

  const [existingSort, setExistingSort] = useState({
    key: "",
    direction: "asc",
  });

  const filteredAvailable = useMemo(() => {
    let result = availableNotices.filter((notice) =>
      `${notice.title} ${notice.creator} ${notice.date}`
        .toLowerCase()
        .includes(availableSearch.toLowerCase()),
    );

    if (availableSort.key) {
      result = [...result].sort((a, b) => {
        const comparison = compareNoticeValues(
          a[availableSort.key],
          b[availableSort.key],
          availableSort.key,
        );

        return availableSort.direction === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [availableNotices, availableSearch, availableSort]);

  const filteredExisting = useMemo(() => {
    let result = existingNotices.filter((notice) =>
      `${notice.title} ${notice.date} ${notice.order}`
        .toLowerCase()
        .includes(existingSearch.toLowerCase()),
    );

    if (existingSort.key) {
      result = [...result].sort((a, b) => {
        const comparison = compareNoticeValues(
          a[existingSort.key],
          b[existingSort.key],
          existingSort.key,
        );

        return existingSort.direction === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [existingNotices, existingSearch, existingSort]);

  const availableTotalPages = Math.ceil(filteredAvailable.length / PAGE_SIZE);
  const existingTotalPages = Math.ceil(filteredExisting.length / PAGE_SIZE);

  const availablePageData = filteredAvailable.slice(
    (availablePage - 1) * PAGE_SIZE,
    availablePage * PAGE_SIZE,
  );

  const existingPageData = filteredExisting.slice(
    (existingPage - 1) * PAGE_SIZE,
    existingPage * PAGE_SIZE,
  );

  const handleAvailableSort = (key) => {
    setAvailableSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleExistingSort = (key) => {
    setExistingSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortIndicator = (sort, key) => {
    if (sort.key !== key) return "↕";
    return sort.direction === "asc" ? "↑" : "↓";
  };

  const handleSetPriority = (notice) => {
    setSelectedNotice(notice);
  };

  const handleSavePriority = (order, lastDate) => {
    if (!selectedNotice) return;

    const newNotice = {
      id: Date.now(),
      title: selectedNotice.title,
      date: new Date(`${lastDate}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      order,
    };

    setAvailableNotices((current) =>
      current.filter((item) => item.id !== selectedNotice.id),
    );
    setExistingNotices((current) =>
      [...current, newNotice]
        .sort((first, second) => first.order - second.order)
        .map((notice, index) => ({ ...notice, order: index + 1 })),
    );
    setAvailablePage(1);
    setExistingPage(1);
    setSelectedNotice(null);
  };

  const handleDelete = (id) => {
    setExistingNotices((current) =>
      current
        .filter((notice) => notice.id !== id)
        .map((notice, index) => ({
          ...notice,
          order: index + 1,
        })),
    );
  };

  const resetAvailableSearch = () => {
    setAvailableSearch("");
    setAvailablePage(1);
    setAvailableSort({ key: "", direction: "asc" });
  };

  const resetExistingSearch = () => {
    setExistingSearch("");
    setExistingPage(1);
    setExistingSort({ key: "", direction: "asc" });
  };

  const SortHeader = ({ label, sort, sortKey, onSort }) => (
    <button
      type="button"
      className="priority-sort-header"
      aria-label={`${label}, ${sort.key === sortKey ? sort.direction : "not sorted"}`}
      onClick={() => onSort(sortKey)}
    >
      {label}
      <span aria-hidden="true">{sortIndicator(sort, sortKey)}</span>
    </button>
  );

  return (
    <div className="priority-notice-page">
      <CRow className="priority-notice-row">
        <CCol lg={6} md={12}>
          <CCard className="priority-panel priority-available-panel">
            <CCardBody>
              <div className="priority-panel-toolbar">
                <h5>Set Priority Notice</h5>

                <SearchBar
                  value={availableSearch}
                  onChange={(value) => {
                    setAvailableSearch(value);
                    setAvailablePage(1);
                  }}
                  onReset={resetAvailableSearch}
                />
              </div>

              <div className="priority-table-wrapper">
                <CTable className="priority-table" responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>
                        <SortHeader
                          label="Title"
                          sort={availableSort}
                          sortKey="title"
                          onSort={handleAvailableSort}
                        />
                      </CTableHeaderCell>

                      <CTableHeaderCell>
                        <SortHeader
                          label="Creator"
                          sort={availableSort}
                          sortKey="creator"
                          onSort={handleAvailableSort}
                        />
                      </CTableHeaderCell>

                      <CTableHeaderCell>
                        <SortHeader
                          label="Date"
                          sort={availableSort}
                          sortKey="date"
                          onSort={handleAvailableSort}
                        />
                      </CTableHeaderCell>

                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {availablePageData.length > 0 ? (
                      availablePageData.map((notice) => (
                        <CTableRow key={notice.id}>
                          <CTableDataCell>{notice.title}</CTableDataCell>
                          <CTableDataCell>{notice.creator}</CTableDataCell>
                          <CTableDataCell>{notice.date}</CTableDataCell>
                          <CTableDataCell>
                            <button
                              type="button"
                              className="set-priority-link"
                              onClick={() => handleSetPriority(notice)}
                            >
                              Set Priority
                            </button>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={4} className="text-center">
                          No records found
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </div>

              <Pagination
                currentPage={availablePage}
                totalPages={availableTotalPages}
                totalItems={filteredAvailable.length}
                onPageChange={setAvailablePage}
              />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={6} md={12}>
          <CCard className="priority-panel priority-existing-panel">
            <CCardBody>
              <div className="priority-panel-toolbar">
                <h5>Existing Priority Notice</h5>

                <SearchBar
                  value={existingSearch}
                  onChange={(value) => {
                    setExistingSearch(value);
                    setExistingPage(1);
                  }}
                  onReset={resetExistingSearch}
                />
              </div>

              <div className="priority-table-wrapper">
                <CTable className="priority-table" responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>
                        <SortHeader
                          label="Title"
                          sort={existingSort}
                          sortKey="title"
                          onSort={handleExistingSort}
                        />
                      </CTableHeaderCell>

                      <CTableHeaderCell>
                        <SortHeader
                          label="Date"
                          sort={existingSort}
                          sortKey="date"
                          onSort={handleExistingSort}
                        />
                      </CTableHeaderCell>

                      <CTableHeaderCell>
                        <SortHeader
                          label="Order"
                          sort={existingSort}
                          sortKey="order"
                          onSort={handleExistingSort}
                        />
                      </CTableHeaderCell>

                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {existingPageData.length > 0 ? (
                      existingPageData.map((notice) => (
                        <CTableRow key={notice.id}>
                          <CTableDataCell>{notice.title}</CTableDataCell>
                          <CTableDataCell>{notice.date}</CTableDataCell>
                          <CTableDataCell>{notice.order}</CTableDataCell>
                          <CTableDataCell>
                            <button
                              type="button"
                              className="priority-delete-btn"
                              onClick={() => handleDelete(notice.id)}
                              title="Delete priority notice"
                              aria-label="Delete priority notice"
                            >
                              <span className="priority-trash-icon" />
                            </button>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={4} className="text-center">
                          No records found
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </div>

              <Pagination
                currentPage={existingPage}
                totalPages={existingTotalPages}
                totalItems={filteredExisting.length}
                onPageChange={setExistingPage}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <SetPriorityModal
        notice={selectedNotice}
        orderCount={existingNotices.length}
        onClose={() => setSelectedNotice(null)}
        onSave={handleSavePriority}
      />
    </div>
  );
};

export default PriorityNotice;
