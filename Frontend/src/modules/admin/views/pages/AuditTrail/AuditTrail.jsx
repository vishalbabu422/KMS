import { useCallback, useEffect, useState } from "react";
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
} from "@coreui/react";
import { AuditTrailAPI } from "../../../services/api";
import AuditTrailFilters from "./AuditTrailFilters";
import AuditTrailTable from "./AuditTrailTable";

const EMPTY_FILTERS = { loginId: "", startDate: "", endDate: "" };
const FIELDS = "id,login_id,activity,date_time,login_ip";
const PAGE_SIZES = [10, 20, 50, 100];

export default function AuditTrail() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortConfig, setSortConfig] = useState({
    key: "date_time",
    direction: "desc",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAuditTrails = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await AuditTrailAPI.getAuditTrails({
        ...(filters.loginId ? { filter: `login_id=${filters.loginId}` } : {}),
        ...(filters.startDate ? { startDate: filters.startDate } : {}),
        ...(filters.endDate ? { endDate: filters.endDate } : {}),
        page,
        limit: pageSize,
        sort: `${sortConfig.key} ${sortConfig.direction}`,
        fields: FIELDS,
      });
      const data = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
      const resultTotal = Number(response?.data?.total ?? data.length);

      if (page > 1 && data.length === 0 && resultTotal > 0) {
        setTotal(resultTotal);
        setPage((current) => current - 1);
        return;
      }

      setRows(
        data.map((record) => ({
          id: record.id,
          login_id: record.login_id ?? "-",
          activity: record.activity ?? "-",
          date_time: record.date_time,
          login_ip: record.login_ip ?? "-",
        })),
      );
      setTotal(resultTotal);
    } catch (requestError) {
      if (requestError.response?.status === 404) {
        setRows([]);
        setTotal(0);
      } else {
        console.error(requestError);
        setError("Failed to load audit trail records. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize, sortConfig]);

  useEffect(() => {
    fetchAuditTrails();
  }, [fetchAuditTrails]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const rowStart = total === 0 ? 0 : (safePage - 1) * pageSize;

  const handleFilterChange = (field, value) => {
    setDraftFilters((current) => ({ ...current, [field]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    if (
      draftFilters.startDate &&
      draftFilters.endDate &&
      draftFilters.startDate > draftFilters.endDate
    ) {
      setError("Start date must be on or before the end date.");
      return;
    }

    setFilters({
      loginId: draftFilters.loginId.trim(),
      startDate: draftFilters.startDate,
      endDate: draftFilters.endDate,
    });
    setPage(1);
  };

  const clearFilters = () => {
    setDraftFilters(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    setPage(1);
    setError("");
  };

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>Filters</strong>
          </CCardHeader>
          <CCardBody>
            <AuditTrailFilters
              draftFilters={draftFilters}
              pageSize={pageSize}
              pageSizes={PAGE_SIZES}
              onFilterChange={handleFilterChange}
              onPageSizeChange={(value) => {
                setPageSize(value);
                setPage(1);
              }}
              onApply={applyFilters}
              onClear={clearFilters}
            />
          </CCardBody>
        </CCard>

        <CCard className="mb-4">
          <CCardHeader>
            <strong>Audit Trail</strong>
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <CSpinner color="primary" aria-label="Loading audit trail" />
              </div>
            ) : error ? (
              <CAlert
                color="danger"
                className="d-flex align-items-center justify-content-between gap-3 mb-0"
              >
                <span>{error}</span>
                <CButton
                  color="danger"
                  variant="outline"
                  size="sm"
                  onClick={fetchAuditTrails}
                >
                  Try again
                </CButton>
              </CAlert>
            ) : (
              <AuditTrailTable
                rows={rows}
                rowStart={rowStart}
                rowCount={total}
                page={safePage}
                totalPages={totalPages}
                sortConfig={sortConfig}
                onSort={handleSort}
                onPageChange={setPage}
              />
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}
