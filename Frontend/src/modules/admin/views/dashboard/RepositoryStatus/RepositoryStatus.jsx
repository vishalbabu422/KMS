import React from "react";
import { CCard, CCardBody } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLayers } from "@coreui/icons";
import "./RepositoryStatus.css";

const RepositoryStatus = ({ period, dateRange }) => {
  const statusData = [
    { title: "Published", percentage: 68, color: "#13a35c" },
    { title: "Pending", percentage: 19, color: "#f6a623" },
    { title: "Draft", percentage: 9, color: "#269ce9" },
    { title: "Archived", percentage: 4, color: "#873be5" },
  ];

  return (
    <CCard className="repository-card">
      <CCardBody>
        <div className="repository-heading">
          <span className="repository-icon">
            <CIcon icon={cilLayers} size="lg" />
          </span>
          <h5>Repository Status</h5>
        </div>

        <div className="repository-content">
          <div className="repository-donut">
            <div className="repository-donut-center">
              <strong>1,246</strong>
              <span>Documents</span>
            </div>
          </div>

          <div className="repository-legend">
            {statusData.map((item) => (
              <div className="repository-legend-item" key={item.title}>
                <span
                  className="repository-dot"
                  style={{ backgroundColor: item.color }}
                />
                <span className="repository-label">{item.title}</span>
                <strong>{item.percentage}%</strong>
              </div>
            ))}
          </div>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default RepositoryStatus;
