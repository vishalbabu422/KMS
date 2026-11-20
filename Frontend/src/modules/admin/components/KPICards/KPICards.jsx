import React from "react";

import { CCard, CCardBody, CRow, CCol } from "@coreui/react";

import CIcon from "@coreui/icons-react";

import {
  cilClock,
  cilFile,
  cilFolderOpen,
  cilExternalLink,
} from '@coreui/icons'

import "./KPICards.css";

const KPICards = () => {
  // KPI card data
  const cardData = [
    {
      title: "Pending",
      count: "701523",
      duration: "Today",
      icon: cilClock,
    },
    {
      title: "Created",
      count: "701523",
      duration: "Monthly",
      icon: cilFile,
    },
    {
      title: "Collection",
      count: "701523",
      duration: "Quarterly",
      icon: cilFolderOpen,
    },
    {
      title: "Published",
      count: "701523",
      duration: "Yearly",
      icon: cilExternalLink,
    },
  ];

  return (
    <CRow className="g-4 kpi-row">
      {cardData.map((item, index) => (
        <CCol xs={12} sm={6} xl={3} key={index}>
          <CCard className="kpi-card">
            <CCardBody>
              {/* Icon */}
              <div className="kpi-icon">
                <CIcon icon={item.icon} size="lg" />
              </div>

              {/* Duration */}
              <div className="kpi-duration">{item.duration}</div>

              {/* Title and Count */}
              <div className="kpi-details">
                <span className="kpi-title">{item.title}</span>

                <span className="kpi-count">{item.count}</span>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  );
};

export default KPICards;
