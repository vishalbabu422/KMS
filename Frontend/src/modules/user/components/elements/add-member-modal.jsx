import React from "react";
import InboxSearchHandler from "./Form/InboxSearchHandler";
import UserImage from "../../assets/images/svg/Modal-user-image.svg";


const AddMemberModal = () => {
  return (
    <>
    <div
      className="modal fade"
      id="add-member"
      tabIndex="-1"
      aria-labelledby="email-msgLabel"
      aria-hidden="true"
      style={{ zIndex: 1100 }}
    >
      <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header d-flex flex-column p-0">
            <div className="modal-top-header p-2 w-100"></div>

            <div className="d-flex align-items-center flex-grow-1 w-100 p-2 px-3">
              <h5 className="modal-title" id="email-msgLabel">
                Add Member to ‘Aakash Kumar’
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body">
            <div className="accordion task-user-nav" id="accordiontask">
              <div className="accordion-item">
                <div
                  className="accordion-header task-user-list"
                  id="headingone"
                >
                  <button
                    type="button"
                    className="accordion-button p-1"
                    data-bs-toggle="collapse"
                    data-bs-target="#nav-modal-add"
                    aria-controls="nav-modal-add"
                    aria-expanded="false"
                  >
                    <input
                      type="email"
                      className="form-control contactinput2 border-0"
                      placeholder="Search to add members in the group"
                      id="search-kms-inbox"
                    />
                  </button>
                </div>

                <div
                  id="nav-modal-add"
                  className="accordion-collapse collapse py-2"
                  aria-labelledby="headingone"
                  data-bs-parent="#accordiontask"
                >
                  <div className="row gy-3 modal-contact-list overflow-auto">
                    <ul className="contactul y-1">
                      {[
                        "Niraj Dubey",
                        "Niraj Dubey",
                        "Sooraj Dubey",
                      ].map((name, index) => (
                        <li key={index}>
                          <div className="row d-flex align-items-center">
                            <div className="col-md-1 col-2">
                              <img
                                src={UserImage}
                                alt="user"
                              />
                            </div>
                            <div className="col-md-10 col-9">
                              {name}
                            </div>
                            <div className="col-md-1 col-1">
                              <div className="form-check">
                                <input
                                  className="form-check-input check-box"
                                  type="checkbox"
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0">
            <button type="button" className="btn send-btn">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
    <InboxSearchHandler />
    </>
  );
};

export default AddMemberModal;
