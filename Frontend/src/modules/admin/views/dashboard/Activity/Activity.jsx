
import React from 'react'
import { CCard, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHistory } from '@coreui/icons'
import './Activity.css'

const activityData = [
  {
    user: 'kms1-support',
    action: "Created a document named 'Annual Report'",
    time: '1 day, 1 hour ago',
  },
  {
    user: 'A. Mehta',
    action: "Published 'Policy Update' to the repository",
    time: '1 day, 1 hour ago',
  },
  {
    user: 'R. Sharma',
    action: "Updated metadata for 'New Document'",
    time: '1 day, 1 hour ago',
  },
  {
    user: 'Neha Khan',
    action: "Submitted 'Content Guidelines' for review",
    time: '1 day, 1 hour ago',
  },
  {
    user: 'S. Patel',
    action: "Shared 'Quarterly Brief' with the team",
    time: '1 day, 1 hour ago',
  },
  {
    user: 'Admin Team',
    action: "Moved 'Training Manual' to draft",
    time: '1 day, 1 hour ago',
  },
]

const getInitials = (name) =>
  name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

const Activity = ({ period, dateRange }) => {
  return (
    <CCard className="kms-activity-card">
      <CCardBody>

        <div className="kms-activity-heading">
          <span className="kms-activity-heading-icon">
            <CIcon icon={cilHistory} size="lg" />
          </span>
          <h5>Activity</h5>
        </div>

        <div className="kms-activity-list">

          {activityData.map((item, index) => (
            <div className="kms-activity-item" key={index}>

              <div className="kms-activity-timeline">
                <span className="kms-activity-dot" />

                {index !== activityData.length - 1 && (
                  <span className="kms-activity-connector" />
                )}
              </div>

              <div className="kms-activity-user">
                {getInitials(item.user)}
              </div>

              <div className="kms-activity-description">
                <p>
                  <strong>{item.user}</strong> {item.action}
                </p>
                <span>{item.time}</span>
              </div>

            </div>
          ))}

        </div>

      </CCardBody>
    </CCard>
  )
}

export default Activity
