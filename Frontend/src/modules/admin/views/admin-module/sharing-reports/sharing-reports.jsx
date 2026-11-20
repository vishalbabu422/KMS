import React, { useMemo, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import ReactECharts from "echarts-for-react";
import "./sharing-reports.css";

const initialReportData = [
  { id: 1, name: "06-June", count: 4 },
  { id: 2, name: "2020", count: 4 },
  { id: 3, name: "2021", count: 4 },
  { id: 4, name: "ADMIN", count: 7 },
  { id: 5, name: "Admin Section Cabinet Secretariat", count: 1 },
  { id: 6, name: "Document eOffice", count: 1 },
  { id: 7, name: "Important reference documents for Admin-I", count: 6 },
  { id: 8, name: "KMS", count: 1 },
  { id: 9, name: "Minutes of the Meeting MoM COVID-19", count: 4 },
  { id: 10, name: "NIC", count: 1 },
];

const chartColors = [
  "#3979E8",
  "#91CE70",
  "#FFC83D",
  "#F04E45",
  "#75C8E8",
  "#18A477",
  "#FF873D",
  "#A05AB5",
  "#E66CC2",
  "#E879B8",
];

const SharingReports = () => {
  const [reportData] = useState(initialReportData);

  const [userName, setUserName] = useState("");
  const [appliedUserName, setAppliedUserName] = useState("");

  const [tableSearch, setTableSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const filteredData = useMemo(() => {
    let result = [...reportData];

    if (tableSearch.trim()) {
      const searchValue = tableSearch.trim().toLowerCase();

      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValue) ||
          String(item.count).includes(searchValue),
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        const first = a[sortConfig.key];
        const second = b[sortConfig.key];

        const comparison =
          typeof first === "number" && typeof second === "number"
            ? first - second
            : String(first).localeCompare(String(second), undefined, {
                numeric: true,
                sensitivity: "base",
              });

        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [reportData, tableSearch, sortConfig]);

  const pageSize = Number(entriesPerPage);
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalEntries);

  const currentData = filteredData.slice(startIndex, endIndex);

  const handleSort = (key) => {
    setSortConfig((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc" ? "desc" : "asc",
    }));

    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  const handleReportSearch = (event) => {
    event.preventDefault();

    const searchValue = userName.trim();
    setAppliedUserName(searchValue);
    setCurrentPage(1);

    // TODO: Call your Sharing Report API here.
    // Send searchValue as username to the backend.
    console.log("Sharing Report - Shared By:", searchValue);
  };

  const handleReset = () => {
    setUserName("");
    setAppliedUserName("");
    setTableSearch("");
    setEntriesPerPage("10");
    setCurrentPage(1);
    setSortConfig({
      key: "name",
      direction: "asc",
    });
  };

  const handleTableSearch = (value) => {
    setTableSearch(value);
    setCurrentPage(1);
  };

  const chartOption = {
    color: chartColors,

    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: "#ffffff",
      borderColor: "#dce3f5",
      borderWidth: 1,
      padding: 12,
      textStyle: {
        color: "#344054",
        fontSize: 12,
      },
      formatter: (params) => `
        <div style="font-weight:600;margin-bottom:8px;">
          Document Name with User count
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="
            width:9px;
            height:9px;
            border-radius:50%;
            background:${params.color};
            display:inline-block;
          "></span>
          <span>${params.name}</span>
          <strong style="margin-left:8px;">${params.value}</strong>
        </div>
      `,
    },

    legend: {
      show: false,
    },

    series: [
      {
        name: "Document Name with User count",
        type: "pie",
        radius: ["40%", "72%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,

        itemStyle: {
          borderColor: "#ffffff",
          borderWidth: 2,
        },

        label: {
          show: false,
          position: "center",
        },

        emphasis: {
          scale: true,
          scaleSize: 8,
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
            color: "#002266",
            formatter: "{c}",
          },
        },

        labelLine: {
          show: false,
        },

        data: reportData.map((item) => ({
          value: item.count,
          name: item.name,
        })),
      },
    ],

  };

  // ========================================
  // PAGE JSX
  // ========================================

  return (
    <div className="sharing-report-page p-2">
      {/* FILTER REPORTS */}

      <CCard className="sharing-filter-card mb-4">
        <CCardBody className="p-2 p-md-3">
          <form onSubmit={handleReportSearch}>
            <CRow className="align-items-center g-2">
              <CCol xs={12} md="auto" className="sharing-filter-title">
                <h4 className="h6 fw-bold text-primary bg-primary-subtle rounded-2 px-3 py-2 mb-0">
                  Filter Reports
                </h4>
              </CCol>

              <CCol xs={12} md={6} lg={4}>
                <div className="d-flex align-items-center gap-2">
                  <label
                    className="form-label small text-body-secondary text-nowrap mb-0"
                    htmlFor="sharingUserName"
                  >
                    Shared By
                  </label>

                  <CFormInput
                    className="flex-grow-1 w-auto"
                    id="sharingUserName"
                    type="text"
                    placeholder="Enter user name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
              </CCol>

              <CCol xs={12} md="auto">
                <CButton type="submit" color="primary" className="px-4">
                  Search
                </CButton>
              </CCol>
            </CRow>
          </form>
        </CCardBody>
      </CCard>

      {/* MAIN REPORT CONTENT */}

      <CRow className="g-3 align-items-stretch">
        {/* SHARED DOCUMENTS TABLE */}

        <CCol lg={6} className="d-flex">
          <CCard className="sharing-content-card h-100 flex-grow-1">
            <CCardBody className="d-flex flex-column p-3 p-md-4">
              <div className="d-flex align-items-md-center justify-content-between flex-column flex-md-row gap-3 mb-3">
                <h5 className="h6 fw-semibold mb-0">Shared Documents</h5>

                <div className="d-flex align-items-center justify-content-between justify-content-md-end flex-wrap gap-3">
                  <div className="d-flex align-items-center gap-2 text-nowrap">
                    <span>Show</span>

                    <CFormSelect
                      className="w-auto"
                      value={entriesPerPage}
                      onChange={(e) => {
                        setEntriesPerPage(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </CFormSelect>

                    <span>entries</span>
                  </div>

                  <div className="sharing-table-search">
                    <CFormInput
                      type="search"
                      placeholder="Search documents..."
                      value={tableSearch}
                      onChange={(e) => handleTableSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="sharing-table-wrapper">
                <CTable
                  hover
                  striped
                  bordered
                  className="sharing-report-table mb-0 align-middle"
                >
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="sharing-serial-column bg-primary text-white text-center">
                        S.No
                      </CTableHeaderCell>

                      <CTableHeaderCell className="bg-primary text-white">
                        <button
                          type="button"
                          className="btn btn-link d-flex align-items-center justify-content-between w-100 p-0 text-white text-decoration-none"
                          onClick={() => handleSort("name")}
                        >
                          Document Name
                          <span className="ms-2 small">
                            {getSortIcon("name")}
                          </span>
                        </button>
                      </CTableHeaderCell>

                      <CTableHeaderCell className="sharing-count-column bg-primary text-white text-center">
                        <button
                          type="button"
                          className="btn btn-link d-flex align-items-center justify-content-between w-100 p-0 text-white text-decoration-none"
                          onClick={() => handleSort("count")}
                        >
                          User Count
                          <span className="ms-2 small">
                            {getSortIcon("count")}
                          </span>
                        </button>
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {currentData.length > 0 ? (
                      currentData.map((item, index) => (
                        <CTableRow key={item.id}>
                          <CTableDataCell className="sharing-serial-column text-center text-body-secondary">
                            {startIndex + index + 1}
                          </CTableDataCell>

                          <CTableDataCell>{item.name}</CTableDataCell>

                          <CTableDataCell className="sharing-count-column text-center fw-semibold">
                            {item.count}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell
                          colSpan={3}
                          className="text-center text-body-secondary py-5"
                        >
                          No records found
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </div>

              {/* TABLE FOOTER */}

              <div className="d-flex align-items-sm-center justify-content-between flex-column flex-sm-row gap-3 mt-auto pt-3">
                <div className="small text-body-secondary">
                  Showing {totalEntries === 0 ? 0 : startIndex + 1} to{" "}
                  {endIndex} of {totalEntries} entries
                </div>

                <CPagination
                  className="mb-0 gap-1"
                  aria-label="Shared documents pages"
                >
                  <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                  >
                    Previous
                  </CPaginationItem>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <CPaginationItem
                      key={page}
                      active={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </CPaginationItem>
                  ))}

                  <CPaginationItem
                    disabled={currentPage >= totalPages || totalPages === 0}
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* SHARING CHART */}

        <CCol lg={6} className="d-flex">
          <CCard className="sharing-content-card h-100 flex-grow-1">
            <CCardHeader className="fw-semibold">
              Shared Documents Count for All Users
            </CCardHeader>
            <CCardBody className="d-flex flex-column p-3 p-md-4">

              <div className="row align-items-center g-2 flex-grow-1">
                <div className="col-xl-8 sharing-chart-visual">
                  <ReactECharts
                    option={chartOption}
                    style={{
                      width: "100%",
                      height: "390px",
                    }}
                    notMerge
                    lazyUpdate
                  />
                </div>

                {/* DOCUMENT LEGEND */}

                <div className="col-xl-4 sharing-chart-legend">
                  {reportData.map((item, index) => (
                    <div className="sharing-legend-item" key={item.id}>
                      <span
                        className="sharing-legend-color"
                        style={{
                          backgroundColor:
                            chartColors[index % chartColors.length],
                        }}
                      />

                      <span className="sharing-legend-name" title={item.name}>
                        {item.name}
                      </span>

                      <strong>{item.count}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default SharingReports;
