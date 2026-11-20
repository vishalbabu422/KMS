import React, { useState } from 'react'
import KPICards from './KPICards/KPICards'
import PeriodFilter from './PeriodFilter/PeriodFilter'
import RepositoryStatus from './RepositoryStatus/RepositoryStatus'
import ReportChart from './ReportChart/ReportChart'
import Activity from './Activity/Activity'
import RecentlyCreated from './RecentlyCreated/RecentlyCreated'

import './Dashboard.css'

const Dashboard = () => {
  const [period, setPeriod] = useState('Today')
  const [dateRange, setDateRange] = useState({ fromDate: '', toDate: '' })

  return (
    <div className="kms-dashboard-container">
      <PeriodFilter
        period={period}
        setPeriod={setPeriod}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <KPICards />
      <div className="kms-dashboard-layout">
        <div className="kms-dashboard-left">
          <div className="kms-dashboard-analytics">
            <RepositoryStatus period={period} dateRange={dateRange} />
            <ReportChart period={period} dateRange={dateRange} />
          </div>
          <RecentlyCreated period={period} dateRange={dateRange} />
        </div>
        <Activity period={period} dateRange={dateRange} />
      </div>
    </div>
  )
}

export default Dashboard