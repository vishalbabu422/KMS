import React, { useEffect, useRef, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
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
import { CChart } from "@coreui/react-chartjs";
import { getStyle } from "@coreui/utils";
import "./document-report.css";

const reportData = [
  {
    type: "Total Folder/Documents in Collection",
    collection: 11,
    link: 0,
    onlineDocument: 0,
    document: 5076,
  },
  {
    type: "Total Folder/Documents in My Document",
    collection: 1,
    link: 0,
    onlineDocument: 0,
    document: 4,
  },
];

const chartLabels = ["Folder", "Links", "Online Document", "Document"];
const chartColors = ["#eee3fa", "#5b83dc", "#e2e9fc", "#c5d1fa"];

const collectionTree = [
  {
    id: "test-folder-api",
    name: "test folder for api",
    counts: [0, 0, 0, 7],
  },
  {
    id: "eoffice",
    name: "eoffice",
    counts: [0, 0, 0, 0],
  },
  {
    id: "document-eoffice",
    name: "Document eOffice",
    counts: [1, 0, 0, 1],
    children: [
      {
        id: "office-docs",
        name: "Office Docs",
        counts: [0, 0, 0, 1],
        children: [
          {
            id: "office-policy",
            name: "Office Policy.pdf",
            type: "file",
            counts: [0, 0, 0, 1],
          },
          {
            id: "office-circular",
            name: "Office Circular.docx",
            type: "file",
            counts: [0, 0, 0, 1],
          },
        ],
      },
      {
        id: "eoffice-notice",
        name: "eOffice Notice.pdf",
        type: "file",
        counts: [0, 0, 0, 1],
      },
    ],
  },
  {
    id: "collabfiles",
    name: "CollabFiles",
    counts: [0, 0, 0, 0],
  },
  {
    id: "nic",
    name: "NIC",
    counts: [0, 0, 0, 1],
  },
  {
    id: "nic-cabinet",
    name: "NIC Cabinet Secretariat",
    counts: [0, 0, 0, 0],
  },
  {
    id: "admin-section",
    name: "Admin Section Cabinet Secretariat",
    counts: [0, 0, 0, 1],
  },
  {
    id: "admin",
    name: "ADMIN",
    counts: [0, 0, 0, 0],
  },
  {
    id: "download-forms",
    name: "Download Forms",
    counts: [0, 0, 0, 4],
  },
  {
    id: "efile-uploads",
    name: "eFile Uploads to KMS",
    counts: [0, 0, 0, 5055],
  },
];

const myDocumentTree = [
  {
    id: "my-document",
    name: "My Document",
    counts: [1, 0, 0, 4],
  },
];

const DocumentReports = () => {
  const [userName, setUserName] = useState("");
  const [modifiedFrom, setModifiedFrom] = useState("");
  const [modifiedTo, setModifiedTo] = useState("");
  const [activeReport, setActiveReport] = useState("collection");
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  const handleSearch = () => {
    console.log({
      userName,
      modifiedFrom,
      modifiedTo,
    });
  };

  const activeItem =
    activeReport === "collection" ? reportData[0] : reportData[1];
  const activeChartValues = [
    activeItem.collection,
    activeItem.link,
    activeItem.onlineDocument,
    activeItem.document,
  ];
  const activeTree =
    activeReport === "collection" ? collectionTree : myDocumentTree;
  const activeTabId =
    activeReport === "collection"
      ? "collection-report-tab"
      : "documents-report-tab";

  const toggleNode = (nodeId) => {
    setExpandedNodes((current) => {
      const next = new Set(current);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  return (
    <div className="document-report-page">
      <CCard className="document-report-card">
        <CCardBody>
          {/* PAGE HEADING */}
          <div className="document-report-heading">
            <h4>Document Report</h4>
          </div>

          {/* FILTER SECTION */}
          <CRow className="document-report-filters align-items-center">
            {activeReport === "collection" && (
              <CCol lg={2} md={3} sm={6}>
                <CFormInput
                  placeholder="User Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </CCol>
            )}

            <CCol lg={2} md={3} sm={6}>
              <CFormInput
                type="date"
                value={modifiedFrom}
                onChange={(e) => setModifiedFrom(e.target.value)}
                aria-label="Modified From"
              />
            </CCol>

            <CCol xs="auto" className="date-separator">
              →
            </CCol>

            <CCol lg={2} md={3} sm={6}>
              <CFormInput
                type="date"
                value={modifiedTo}
                onChange={(e) => setModifiedTo(e.target.value)}
                aria-label="Modified To"
              />
            </CCol>

            <CCol xs="auto" className="search-action-column">
              <CButton
                type="button"
                className="report-search-btn"
                onClick={handleSearch}
              >
                Search
              </CButton>
            </CCol>

            <CCol className="filter-actions">
              <CButton className="report-export-btn">Export</CButton>
            </CCol>
          </CRow>

          <div className="document-report-overview">
            <div
              className="document-report-tabs"
              role="tablist"
              aria-label="Report type"
            >
              <button
                id="collection-report-tab"
                type="button"
                role="tab"
                aria-selected={activeReport === "collection"}
                aria-controls="document-report-panel"
                className={
                  activeReport === "collection"
                    ? "document-report-tab active"
                    : "document-report-tab"
                }
                onClick={() => setActiveReport("collection")}
              >
                Documents in Collection
              </button>
              <button
                id="documents-report-tab"
                type="button"
                role="tab"
                aria-selected={activeReport === "myDocument"}
                aria-controls="document-report-panel"
                className={
                  activeReport === "myDocument"
                    ? "document-report-tab active"
                    : "document-report-tab"
                }
                onClick={() => setActiveReport("myDocument")}
              >
                Documents in My Document
              </button>
            </div>

            <div className="report-count-row">
              {[
                ["Collection", activeItem.collection],
                ["Link", activeItem.link],
                ["Online document", activeItem.onlineDocument],
                ["Document", activeItem.document],
              ].map(([label, value]) => (
                <div className="report-count-card" key={label}>
                  <span className="report-count-label">{label}</span>
                  <strong className="report-count-value">{value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div
            id="document-report-panel"
            className="document-report-panel"
            role="tabpanel"
            aria-labelledby={activeTabId}
          >
            <CRow className="report-detail-row align-items-stretch">
              <CCol lg={8} md={12}>
                <DocumentTree
                  title={
                    activeReport === "collection"
                      ? "Collection Name"
                      : "Document Name"
                  }
                  nodes={activeTree}
                  expandedNodes={expandedNodes}
                  onToggle={toggleNode}
                />
              </CCol>
              <CCol lg={4} md={12}>
                <ChartCard
                  key={activeReport}
                  title="Content breakdown"
                  values={activeChartValues}
                />
              </CCol>
            </CRow>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

const DocumentTree = ({ title, nodes, expandedNodes, onToggle }) => {
  const renderNode = (node, level = 0) => {
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isFile = node.type === "file";

    return (
      <React.Fragment key={node.id}>
        <tr>
          <td>
            <div
              className="document-tree-name"
              style={{ paddingLeft: `${level * 20}px` }}
            >
              {hasChildren ? (
                <button
                  type="button"
                  className="document-tree-toggle"
                  aria-expanded={isExpanded}
                  onClick={() => onToggle(node.id)}
                >
                  <span
                    className={
                      isExpanded
                        ? "document-tree-chevron expanded"
                        : "document-tree-chevron"
                    }
                    aria-hidden="true"
                  />
                </button>
              ) : (
                <span className="document-tree-toggle-spacer" />
              )}
              <span
                className={
                  isFile
                    ? "document-tree-file"
                    : "document-tree-folder"
                }
                aria-hidden="true"
              />
              <span>{node.name}</span>
            </div>
          </td>
          {node.counts.map((count, index) => (
            <td key={`${node.id}-${index}`}>{count}</td>
          ))}
        </tr>
        {hasChildren &&
          isExpanded &&
          node.children.map((child) => renderNode(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="document-tree-card">
      <CTable responsive className="document-tree-table">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>{title}</CTableHeaderCell>
            <CTableHeaderCell>Collection</CTableHeaderCell>
            <CTableHeaderCell>Link</CTableHeaderCell>
            <CTableHeaderCell>Online Document</CTableHeaderCell>
            <CTableHeaderCell>Document</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {nodes.map((node) => renderNode(node))}
        </CTableBody>
      </CTable>
    </div>
  );
};

const ChartCard = ({ title, values }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const handleColorSchemeChange = () => {
      const chartInstance = chartRef.current;

      if (chartInstance?.options.plugins?.legend?.labels) {
        chartInstance.options.plugins.legend.labels.color =
          getStyle("--cui-body-color");
        chartInstance.update();
      }
    };

    document.documentElement.addEventListener(
      "ColorSchemeChange",
      handleColorSchemeChange,
    );

    return () => {
      document.documentElement.removeEventListener(
        "ColorSchemeChange",
        handleColorSchemeChange,
      );
    };
  }, []);

  const data = {
    labels: chartLabels,
    datasets: [
      {
        backgroundColor: chartColors,
        data: values,
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: -90,
    circumference: 180,
    cutout: "48%",
    plugins: {
      legend: {
        display: false,
        labels: {
          color: getStyle("--cui-body-color"),
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <CCard className="report-chart-card">
      <CCardHeader>{title}</CCardHeader>
      <CCardBody>
        <div className="chart-legend">
          {chartLabels.map((label, index) => (
            <div className="chart-legend-item" key={label}>
              <span
                className="legend-dot"
                style={{ backgroundColor: chartColors[index] }}
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="coreui-chart-container">
          <CChart
            ref={chartRef}
            type="doughnut"
            data={data}
            options={options}
          />
        </div>
      </CCardBody>
    </CCard>
  );
};

export default DocumentReports;
