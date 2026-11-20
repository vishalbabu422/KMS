import { useMemo, useState } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";
import UserReportFilters from "./UserReportFilters";
import UserReportTable from "./UserReportTable";
import { documentData, TOTAL_DOCUMENT_COUNT } from "./userReport.data";
import "./user-report.css";

const UserReport = () => {
  const [allUsers, setAllUsers] = useState(true);
  const [userName, setUserName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    allUsers: true,
    userName: "",
    fromDate: "",
    toDate: "",
  });
  const [tableSearch, setTableSearch] = useState("");
  const [pageSize, setPageSize] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "createdOn",
    direction: "desc",
  });

  const handleSearch = (event) => {
    event.preventDefault();
    if (fromDate && toDate && fromDate > toDate) {
      window.alert("From Date cannot be greater than To Date.");
      return;
    }

    setAppliedFilters({
      allUsers,
      userName: allUsers ? "" : userName.trim(),
      fromDate,
      toDate,
    });
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    let result = [...documentData];

    if (appliedFilters.fromDate) {
      result = result.filter(
        (item) => item.createdOn >= appliedFilters.fromDate,
      );
    }

    if (appliedFilters.toDate) {
      result = result.filter((item) => item.createdOn <= appliedFilters.toDate);
    }

    if (!appliedFilters.allUsers && appliedFilters.userName) {
      const searchUser = appliedFilters.userName.toLowerCase();
      result = result.filter((item) =>
        item.createdBy.toLowerCase().includes(searchUser),
      );
    }

    if (tableSearch.trim()) {
      const search = tableSearch.toLowerCase();
      result = result.filter((item) =>
        [
          item.title,
          item.attachment,
          item.collection,
          item.createdBy,
          item.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search),
      );
    }

    result.sort((firstItem, secondItem) => {
      const first = String(firstItem[sortConfig.key] ?? "");
      const second = String(secondItem[sortConfig.key] ?? "");
      const comparison = first.localeCompare(second, undefined, {
        numeric: true,
        sensitivity: "base",
      });

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [appliedFilters, tableSearch, sortConfig]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / Number(pageSize)),
  );
  const rowStart = (currentPage - 1) * Number(pageSize);
  const currentPageData = filteredData.slice(
    rowStart,
    currentPage * Number(pageSize),
  );

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="user-report-overview mb-3">
          <CCardBody className="user-report-overview-body d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-3">
            <div className="user-report-heading-copy d-flex flex-wrap align-items-baseline gap-2 column-gap-3">
              <h4 className="user-report-page-title mb-0">User Report</h4>
              <p className="mb-0 text-body-secondary">
                Review uploaded documents and their publishing status.
              </p>
            </div>
            <div className="user-report-summary d-flex flex-wrap align-items-stretch gap-2">
              <div className="user-report-summary-item d-flex align-items-center justify-content-between gap-3 border rounded bg-body px-3 py-2">
                <span className="small text-body-secondary">
                  Total documents
                </span>
                <strong className="fs-5">
                  {TOTAL_DOCUMENT_COUNT.toLocaleString("en-IN")}
                </strong>
              </div>
              <div className="user-report-summary-item d-flex align-items-center gap-2 border rounded bg-body px-3 py-2">
                <span className="small text-body-secondary">Status</span>
                <CBadge color="success">Published</CBadge>
                <CBadge color="warning">Private</CBadge>
              </div>
            </div>
          </CCardBody>
        </CCard>

        <CCard className="mb-3">
          <CCardHeader>
            <strong>Report Filters</strong>
          </CCardHeader>
          <CCardBody>
            <UserReportFilters
              allUsers={allUsers}
              userName={userName}
              fromDate={fromDate}
              toDate={toDate}
              onAllUsersChange={setAllUsers}
              onUserNameChange={setUserName}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              onSearch={handleSearch}
            />
          </CCardBody>
        </CCard>

        <CCard className="mb-4">
          <CCardHeader className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-1">
            <strong>Uploaded Documents</strong>
            <span className="small text-body-secondary">
              Document details and publishing status
            </span>
          </CCardHeader>
          <CCardBody>
            <UserReportTable
              rows={currentPageData}
              rowStart={rowStart}
              rowCount={filteredData.length}
              page={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              tableSearch={tableSearch}
              sortConfig={sortConfig}
              onPageSizeChange={(value) => {
                setPageSize(value);
                setCurrentPage(1);
              }}
              onSearchChange={(value) => {
                setTableSearch(value);
                setCurrentPage(1);
              }}
              onSort={handleSort}
              onPageChange={setCurrentPage}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default UserReport;
