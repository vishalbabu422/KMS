import React, { useEffect, useState } from 'react'
import {
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import './set-priority-modal.css'

const SetPriorityModal = ({ notice, orderCount, onClose, onSave }) => {
  const [displayOrder, setDisplayOrder] = useState('')
  const [lastDate, setLastDate] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const visible = Boolean(notice)
  const orderError = submitted && !displayOrder
  const dateError = submitted && !lastDate

  useEffect(() => {
    if (visible) {
      setDisplayOrder('')
      setLastDate('')
      setSubmitted(false)
    }
  }, [notice, visible])

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    if (!displayOrder || !lastDate) return

    onSave(Number(displayOrder), lastDate)
  }

  return (
    <CModal
      alignment="center"
      className="priority-set-modal"
      visible={visible}
      onClose={onClose}
    >
      <CModalHeader closeButton>
        <CModalTitle>Set Priority</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {notice && (
          <CForm
            className="priority-modal-form"
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="priority-modal-field">
              <span className="priority-modal-label">Title :</span>
              <span className="priority-modal-value">{notice.title}</span>
            </div>
            <div className="priority-modal-field">
              <span className="priority-modal-label">Creator :</span>
              <span className="priority-modal-value">{notice.creator}</span>
            </div>
            <div className="priority-modal-field">
              <span className="priority-modal-label">Modified on :</span>
              <span className="priority-modal-value">{notice.date}</span>
            </div>
            <div className="priority-modal-field priority-modal-input-field">
              <CFormLabel customClassName="priority-modal-label" htmlFor="priority-order">
                Display : <span className="priority-required">*</span>
              </CFormLabel>
              <div className="priority-modal-control">
                <CFormSelect
                  id="priority-order"
                  required
                  value={displayOrder}
                  aria-invalid={orderError}
                  aria-describedby={orderError ? 'priority-order-error' : undefined}
                  className={orderError ? 'is-invalid' : ''}
                  onChange={(event) => setDisplayOrder(event.target.value)}
                >
                  <option value="">--Select Order--</option>
                  {Array.from({ length: orderCount + 1 }, (_, index) => index + 1).map(
                    (order) => (
                      <option key={order} value={order}>
                        {order}
                      </option>
                    ),
                  )}
                </CFormSelect>
                {orderError && (
                  <span
                    id="priority-order-error"
                    className="priority-field-error"
                    role="alert"
                  >
                    Select a display order.
                  </span>
                )}
              </div>
            </div>
            <div className="priority-modal-field priority-modal-input-field">
              <CFormLabel
                customClassName="priority-modal-label"
                htmlFor="priority-last-date"
              >
                Last date : <span className="priority-required">*</span>
              </CFormLabel>
              <div className="priority-modal-control">
                <CFormInput
                  id="priority-last-date"
                  type="date"
                  required
                  value={lastDate}
                  aria-invalid={dateError}
                  aria-describedby={dateError ? 'priority-date-error' : undefined}
                  className={dateError ? 'is-invalid' : ''}
                  onChange={(event) => setLastDate(event.target.value)}
                />
                {dateError && (
                  <span
                    id="priority-date-error"
                    className="priority-field-error"
                    role="alert"
                  >
                    Select a last date.
                  </span>
                )}
              </div>
            </div>
            <CButton
              className="priority-modal-save"
              color="primary"
              type="submit"
            >
              Save
            </CButton>
          </CForm>
        )}
      </CModalBody>
    </CModal>
  )
}

export default SetPriorityModal