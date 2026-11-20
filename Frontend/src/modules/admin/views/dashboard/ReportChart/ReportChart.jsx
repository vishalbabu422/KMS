import React, { useMemo, useState } from 'react'
import { CButton, CButtonGroup, CCard, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChart } from '@coreui/icons'
import { CChartLine } from '@coreui/react-chartjs'
import './ReportChart.css'

const periods = {
  Hourly: {
    subtitle: 'Today · 8 AM – 8 PM',
    labels: ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM'],
    created: [12, 21, 27, 32, 31, 33, 39, 48, 37, 32, 27, 24, 21],
    published: [8, 14, 19, 22, 21, 23, 26, 31, 26, 22, 19, 17, 15],
    pending: [4, 6, 8, 10, 11, 12, 14, 17, 14, 12, 10, 9, 8],
  },
  Daily: {
    subtitle: 'Last 7 days',
    labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    created: [31, 38, 29, 46, 41, 35, 49],
    published: [22, 27, 20, 33, 29, 24, 36],
    pending: [9, 11, 8, 13, 12, 10, 15],
  },
  Weekly: {
    subtitle: 'Last 8 weeks',
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
    created: [36, 42, 34, 50, 45, 39, 47, 53],
    published: [26, 31, 24, 37, 33, 28, 35, 40],
    pending: [10, 11, 10, 13, 12, 11, 12, 13],
  },
  Monthly: {
    subtitle: 'This year',
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    created: [29, 36, 25, 39, 51, 42, 48, 43, 39, 37, 32, 49],
    published: [19, 25, 17, 28, 36, 30, 34, 31, 28, 27, 23, 35],
    pending: [8, 9, 7, 10, 13, 11, 12, 10, 9, 8, 7, 11],
  },
  Yearly: {
    subtitle: 'Last 6 years',
    labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
    created: [28, 34, 39, 43, 47, 53],
    published: [18, 24, 28, 31, 35, 40],
    pending: [10, 10, 11, 12, 12, 13],
  },
}

const statusSeries = [
  { key: 'created', label: 'Created', color: '#1769d2' },
  { key: 'published', label: 'Published', color: '#13a35c' },
  { key: 'pending', label: 'Pending', color: '#f6a623' },
]

const sum = (values) => values.reduce((total, value) => total + value, 0)

const ReportChart = () => {
  const [activePeriod, setActivePeriod] = useState('Hourly')
  const report = periods[activePeriod]

  const chartData = useMemo(
    () => ({
      labels: report.labels,
      datasets: statusSeries.map((series) => ({
        label: series.label,
        data: report[series.key],
        borderColor: series.color,
        backgroundColor: `${series.color}14`,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHitRadius: 12,
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: '#fff',
        tension: 0.38,
        fill: series.key === 'created',
      })),
    }),
    [report],
  )

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#082d78',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 10,
          displayColors: true,
          callbacks: {
            label: (context) => ` ${context.dataset.label}: ${context.parsed.y}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: '#65728a',
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8,
            font: { size: 11 },
          },
        },
        y: {
          beginAtZero: true,
          max: 60,
          border: { display: false },
          grid: { color: '#e8edf5', drawTicks: false },
          ticks: {
            stepSize: 10,
            color: '#65728a',
            padding: 8,
            font: { size: 11 },
          },
        },
      },
    }),
    [],
  )

  return (
    <CCard className="report-chart-card">
      <CCardBody>
        <div className="report-chart-header">
          <div className="report-chart-heading">
            <span className="report-chart-icon">
              <CIcon icon={cilChart} size="lg" />
            </span>
            <div>
              <div className="report-chart-title-row">
                <h5>Document Activity Trend</h5>
              </div>
              <p className="report-chart-subtitle">{report.subtitle}</p>
            </div>
          </div>
        </div>

        <CButtonGroup
          className="report-chart-tabs"
          role="group"
          aria-label="Report time range"
        >
          {Object.keys(periods).map((period) => (
            <CButton
              key={period}
              type="button"
              size="sm"
              color={activePeriod === period ? 'primary' : 'light'}
              aria-pressed={activePeriod === period}
              onClick={() => setActivePeriod(period)}
            >
              {period}
            </CButton>
          ))}
        </CButtonGroup>

        <div className="report-chart-summary">
          {statusSeries.map((series) => (
            <div className="report-chart-stat" key={series.key}>
              <span className="report-chart-stat-label">
                <i style={{ backgroundColor: series.color }} />
                {series.label}
              </span>
              <strong>{sum(report[series.key]).toLocaleString()}</strong>
            </div>
          ))}
        </div>

        <div className="report-chart-plot">
          <CChartLine data={chartData} options={chartOptions} />
        </div>
      </CCardBody>
    </CCard>
  )
}

export default ReportChart
