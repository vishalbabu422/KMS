import { useState } from "react";
import React from 'react';
import AddMemberModal from "../components/elements/add-member-modal";
import Xmark from "../assets/images/svg/Xmark.svg";
import Delete from "../assets/images/svg/Delete.svg";

const ContactGroup = () => {

  const [selectedCount, setSelectedCount] = React.useState(0);

  const handleCheckChange = (e) => {
    setSelectedCount(prev =>
      e.target.checked ? prev + 1 : prev - 1
    );
  };


  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState("contacts");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearch("");      // reset search box

  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const contacts = [
    { name: "Aakash Kumar Sharma (699)", dept: "HOD eOffice", email: "akanshabasusharma@nic.in", phone: "9876543210" },
    { name: "Aakash Kumar verma (123456)", dept: "HOD eOffice", email: "akanshabasusharma@nic.in", phone: "7894561231" },
  ];

  const groups = [
    {
      id: 1,
      groupName: "eOffice",
      members: [
        "Aakash Kumar Sharma (0058688)",
        "abc verma (0058688)",
        "Member 1"
      ]
    },
    {
      id: 2,
      groupName: "Portal",
      members: [
        "Member 1",
        "Member 2",
        "Member 3",
        "Member 4",
        "Member 5"
      ]
    },
    {
      id: 3,
      groupName: "Portal 1",
      members: [
        "Member 2",
        "Member 3",
        "Member 4",
        "Member 5"
      ]
    }
  ];


  return (
    <>
      <div className="main-bg p-4 tab-content">

        <div className="row">
          <div className="col-xxl-7 d-flex align-items-center">
            <div className="main-nav-heading">Contacts/Groups</div>
          </div>

          {/* <div className="col-xxl-5 pb-0 pb-md-0">
          <div className="row justify-content-end align-items-center">
            <div
              className="col-md-6 p-2 pe-3 d-flex justify-content-md-end justify-content-center order-md-1 order-2 search-wrapper">
              <button className="btn label-search-home-kms w-auto">
                <i className="bi bi-search" aria-hidden="true"></i>
              </button>
              <input className="search-home-kms py-md-2" id="search-kms-inbox" type="text" name="q" placeholder="Search"
                onKeyUp={(e) => filterList(e)} />
            </div>
          </div>
        </div> */}
        </div>


        <div className="row mt-0 gy-md-4 pb-2 mb-lg-2">
          <div className="col-xl-3 col-md-12 d-flex mb-3 ps-3">
            <ul className="kms-conatct-grp nav nav-tabs p-1 align-items-center" id="myTab" role="tablist">
              <li className="nav-item me-1" role="presentation">
                <button className="nav-link active" id="efile-tab" data-bs-toggle="tab" data-bs-target="#Contacts"
                  type="button" role="tab" aria-controls="efile" aria-selected="true" onClick={() => handleTabChange("contacts")}>Contacts</button>
              </li>
              <li className="nav-item me-1" role="presentation">
                <button className="nav-link" id="kms-tab" data-bs-toggle="tab" data-bs-target="#Groups"
                  type="button" role="tab" aria-controls="kms" aria-selected="false" tabIndex="-1" onClick={() => handleTabChange("groups")}>Groups</button>
              </li>
            </ul>
          </div>

          <div className="d-flex col-xl-9 col-md-12 align-items-center justify-content-md-center mt-xl-0 ps-0 pe-3 mt-0">
            <div className="row flex-grow-1">
              <div className="col-md-9 col-12 flex-grow-1 me-xl-2 d-flex justify-content-md-end justify-content-xl-end justify-content-start ps-3">
                <div className="d-flex flex-nowrap search-wrap-2">
                  <button className="btn btn-search2 w-auto">
                    <i className="bi bi-search"></i>
                  </button>
                  <input type="text" className="form-control search-box p-md-2 p-1"
                    id="search-contacts"
                    placeholder={activeTab === "contacts" ? "Search by Name, Number, Employee ID & Code" : "Search by Group Name"} onChange={handleSearch} value={search} />
                </div>
              </div>

              <div className="col-md-auto col-12 justify-content-md-start mt-xl-0 mt-md-0 mt-2">
                <div className="filters2">
                  <button type="button" className="btn send-btn d-flex align-items-center justify-content-center" data-bs-toggle="modal"
                    data-bs-target="#add-user">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className={`action-bar2 ${selectedCount > 0 ? "" : "d-none"}`}>
          <div className="row px-4 d-flex flex-grow-1 gx-4 align-items-center">

            <div className="col-auto select-items">
              <span className="d-flex align-items-center">
                <button type="button" className="btn btn-link p-0 w-auto">
                  <img src={Xmark} alt="" />
                </button>
                <span className="px-2">{selectedCount} Selected</span>
              </span>
            </div>

            <div className="col-auto select-items">
              <span className="d-flex align-items-center">
                <button type="button" className="btn btn-link p-0 my-2 w-auto">
                  <img src={Delete} alt="Delete" />
                </button>
                <span className="px-2">Delete</span>
              </span>
            </div>
          </div>
        </div>

        {/* Contacts Tab */}
        <div className="tab-pane active show row mx-1 my-3" id="Contacts" role="tabpanel" aria-labelledby="all-tab">
          <div className="col-md p-0 table-border-radius table-responsive" style={{ overflowX: "auto" }}>
            <table className="table table-task">
              <thead className="record-list">
                <tr className="tablerowalign-head">
                  <th style={{ width: "5%" }}></th>
                  <th style={{ width: "25%" }}>Name and Employee code</th>
                  <th style={{ width: "15%" }}>Designation</th>
                  <th style={{ width: "20%" }}>Department</th>
                  <th style={{ width: "25%" }}>Email ID</th>
                  <th style={{ width: "10%" }}>Contact No.</th>
                </tr>
              </thead>

              <tbody id="all-contact-list">
                {contacts
                  .filter(item =>
                    Object.values(item).join(" ").toLowerCase().includes(search)
                  )
                  .map((item, idx) => (
                    <tr className="tablerowalign" key={idx}>
                      <td>
                        <div className="form-check d-flex align-items-center justify-content-center">
                          <input className="form-check-input check-box check-box2" type="checkbox" onChange={handleCheckChange} />
                        </div>
                      </td>
                      <td>{item.name}</td>
                      <td>Scientist D</td>
                      <td>{item.dept}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                    </tr>
                  ))}

                {/* <tr className="tablerowalign">
                        <td>
                          <div className="form-check d-flex align-items-center justify-content-center">
                            <input className="form-check-input check-box check-box2" type="checkbox" onChange={handleCheckChange} />
                          </div>
                        </td>
                        <td>Aakash Kumar Sharma (123456)</td>
                        <td>Scientist D</td>
                        <td>HOD eOffice and Miety</td>
                        <td>akanshabasusharma@nic.in</td>
                        <td>9876543210</td>
                      </tr> */}
              </tbody>
            </table>
          </div>
        </div>

        {/* Groups Tab */}
        <div className="tab-pane row mx-1 my-3" id="Groups" role="tabpanel" aria-labelledby="all-tab">
          <div className="col-md p-0 table-border-radius table-responsive" id="group-table" style={{ overflowX: "auto" }}>
            <table className="table table-task">
              <thead className="record-list">
                <tr className="tablerowalign-head">
                  <th style={{ width: "5%" }}></th>
                  <th style={{ width: "30%" }}>Group Name</th>
                  <th style={{ width: "45%" }}>Members</th>
                  <th style={{ width: "15%" }}></th>
                  <th style={{ width: "5%" }}></th>
                </tr>
              </thead>


              <tbody id="all-group-list">
                {groups
                  .filter(group =>
                    JSON.stringify(group).toLowerCase().includes(search)
                  )
                  .map((group, index) => (
                    <React.Fragment key={group.id}>

                      {/* MAIN ROW */}
                      <tr className="tablerowalign accordion">
                        <td>
                          <div className="form-check d-flex align-items-center justify-content-center">
                            <input
                              className="form-check-input check-box check-box2"
                              type="checkbox"
                              onChange={handleCheckChange}
                            />
                          </div>
                        </td>

                        <td>{group.groupName}</td>
                        <td>{group.members.length} members</td>

                        <td>
                          <button
                            className="btn d-flex align-items-center"
                            data-bs-toggle="modal"
                            data-bs-target="#add-member"
                          >
                            <span><i className="bi bi-plus pe-3"></i></span>
                            Add members
                          </button>
                        </td>

                        <td>
                          <button
                            className="accordion-button accordion-btn-custom collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${group.id}`}
                          ></button>
                        </td>
                      </tr>

                      {/* COLLAPSE ROW */}
                      <tr className="accordion-row overflow-auto">
                        <td colSpan="5">
                          <div
                            id={`collapse-${group.id}`}
                            className="accordion-collapse collapse"
                            data-bs-parent="#accordionExample"
                          >
                            <table className="table table-task-sub">
                              <thead>
                                <tr className="table-task-sub-head">
                                  <th style={{ width: "5%" }}></th>
                                  <th style={{ width: "30%" }}>Members in the Group</th>
                                  <th style={{ width: "30%" }}></th>
                                  <th style={{ width: "30%" }}></th>
                                  <th style={{ width: "5%" }}></th>
                                </tr>
                              </thead>

                              <tbody className="members-list">
                                {group.members.map((m, idx) => (
                                  <tr className="tablerowalign" key={idx}>
                                    <td></td>
                                    <td><span className="ps-2">{m}</span></td>
                                    <td></td><td></td>
                                    <td>
                                      <button className="btn"> <i className="bi bi-x-lg"></i> </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>

                            </table>
                          </div>
                        </td>
                      </tr>

                    </React.Fragment>
                  ))}
              </tbody>

              {/* <tbody id="all-group-list">
              <tr className="tablerowalign accordion" id="accordionExample">
                <td>
                  <div className="form-check d-flex align-items-center justify-content-center">
                    <input className="form-check-input check-box check-box2" type="checkbox" onChange={handleCheckChange} />
                  </div>
                </td>
                <td>Aakash Kumar Sharma (0058)</td>
                <td>2 members</td>
                <td>
                  <button className="btn d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#add-member">
                    <span><i className="bi bi-plus pe-3"></i></span> Add members
                  </button>
                </td>
                <td>
                  <button
                    className="accordion-button accordion-btn-custom collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                  ></button>
                </td>
              </tr>

              <tr className="accordion-row overflow-auto">
                <td colSpan="5">
                  <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <table className="table table-task-sub">
                      <thead>
                        <tr className="table-task-sub-head">
                          <th style={{ width: "5%" }}></th>
                          <th style={{ width: "30%" }}>Members in the Group</th>
                          <th style={{ width: "30%" }}></th>
                          <th style={{ width: "30%" }}></th>
                          <th style={{ width: "5%" }}></th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr className="tablerowalign">
                          <td></td>
                          <td><span className="ps-2">Aakash Kumar Sharma (0058688)</span></td>
                          <td></td><td></td><td></td>
                        </tr>
                        <tr className="tablerowalign">
                          <td></td>
                          <td><span className="ps-2">Aakash Kumar Sharma (0058688)</span></td>
                          <td></td><td></td><td></td>
                        </tr>
                      </tbody>

                    </table>
                  </div>
                </td>
              </tr>

              <tr className="tablerowalign accordion">
                <td>
                  <div className="form-check d-flex align-items-center justify-content-center">
                    <input className="form-check-input check-box check-box2" type="checkbox" onChange={handleCheckChange} />
                  </div>
                </td>
                <td>Aakash Kumar Sharma (0058688)</td>
                <td>5 members</td>
                <td></td><td></td>
              </tr>
            </tbody> */}
            </table>
          </div>
        </div>
      </div>
      <AddMemberModal modalId="add-AddMemberModal" />
    </>
  )
}

export default ContactGroup
