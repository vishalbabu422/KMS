import React from 'react';
import { useState } from "react";
import Sort from "../../../assets/images/svg/sort.svg";
import Xmark from "../../../assets/images/svg/Xmark.svg";
import Delete from "../../../assets/images/svg/Delete.svg";
import PDFIcon from "../../../assets/images/Inbox-icons/pdf.svg";
import WordIcon from "../../../assets/images/Inbox-icons/word.svg";
import ExcelIcon from "../../../assets/images/Inbox-icons/excel.svg";
import ZipIcon from "../../../assets/images/Inbox-icons/zip.svg";
import { usePageContextMenu } from "../../elements/PageContextMenuProvider";
import "react-contexify/dist/ReactContexify.css";
import { Link } from "react-router-dom";



const MENU_ID = "example_menu";

const Listing = () => {


  const [order, setOrder] = useState("asc");

  const sortBy = (key) => {

    const sorted = [...data].sort((a, b) => {
      if (order === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });

    setOrder(order === "asc" ? "desc" : "asc");
    setData(sorted);
  };

  const [selectedCount, setSelectedCount] = React.useState(0);

  const handleCheckChange = (e) => {
    setSelectedCount(prev =>
      e.target.checked ? prev + 1 : prev - 1
    );
  };



  const tableData = [
    {
      icon: PDFIcon,
      title: "Horem ipsum dolor sit amet",
      createdBy: "Anil Kumar Sahu",
      createdOn: "12 Apr 2024",
      modifiedBy: "Anil Kumar Sahu",
      modifiedOn: "12 Apr 2024",
      status: "Private"
    },
    {
      icon: WordIcon,
      title: "Horem ipsum dolor sit amet",
      createdBy: "Amit Kumar Sharma",
      createdOn: "13 Apr 2024",
      modifiedBy: "Anil Kumar Sahu",
      modifiedOn: "12 Apr 2024",
      status: "Published"
    },
    {
      icon: ExcelIcon,
      title: "Horem ipsum dolor sit amet",
      createdBy: "Shivani rana",
      createdOn: "14 Apr 2024",
      modifiedBy: "Anil Kumar Sahu",
      modifiedOn: "12 Apr 2024",
      status: "Visible"
    },
    {
      icon: ZipIcon,
      title: "Horem ipsum dolor sit amet",
      createdBy: "Rashmika Kumari",
      createdOn: "15 Apr 2024",
      modifiedBy: "Anil Kumar Sahu",
      modifiedOn: "12 Apr 2024",
      status: "Pending"
    }
  ];

  const [data, setData] = useState(tableData);

  function getStatusClass(status) {
    return status === "Private" ? "state-pri" : "state-pub"; // : "state-vis" : "state-pen add thses two classes also for state visible and state pending"

  }

  function filterList(e) {
    const value = e.target.value.toLowerCase();

    const rows = document.querySelectorAll(
      "#kms-inbox-recent-nav tr, \
            #kms-inbox-pending-app-nav tr, \
            #kms-inbox-pending-pub-nav tr, \
            #kms-inbox-pending-assessment-nav tr, \
            #kms-inbox-shared-withme-nav tr, \
            #kms-inbox-shared-byme-nav tr, \
            #kms-inbox-subs-folder-nav tr, \
            #kms-inbox-subs-file-nav tr"
    );

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(value) ? "" : "none";
    });
  }

  const openMenu = usePageContextMenu();

  return (
    <>
      <div className="">
        <div>
          <div className="row">
            <div className="col-xxl-12 pb-lg-0 pb-md-2 pb-2">
              <div className="row justify-content-end align-items-center">
                <div className="col-md-6 p-2 pb-0 pe-3 d-flex justify-content-md-end justify-content-center order-md-1 order-2 search-wrapper">
                  <button className="btn label-search-home-kms w-auto">
                    <i className="bi bi-search" aria-hidden="true"></i>
                  </button>
                  <input className="search-home-kms py-md-2"
                    id="search-kms-inbox"
                    type="text"
                    name="q"
                    placeholder="Search"
                    onKeyUp={(e) => filterList(e)} />
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Action bar */}
        {/* <div className={`action-bar2 ${selectedCount > 0 ? "" : "d-none"}`}>
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
        </div> */}

        <div className="notice-board-nav-inbox tab-content border-0" id="pills-tabContent">
          <div className="tab-pane fade show active" id="kms-recent" role="tabpanel">
            <div className="col-md p-0 table-border-radius kms-table-height table-responsive">
              <table className="table table-task">
                <thead className="record-list">
                  <tr className="tablerowalign-head">
                    {/* <th style={{ width: "2%" }}></th> */}
                    <th style={{ width: "40%", cursor: "pointer" }} onClick={() => sortBy("title")}>
                      Title <img src={Sort} alt="Sorting" /></th>
                    <th style={{ width: "30%", cursor: "pointer" }} onClick={() => sortBy("Createdby")}>Created by <img src={Sort} alt="Sorting" /></th>
                    {/* <th style={{ width: "15%", cursor: "pointer" }} onClick={() => sortBy("Createdon")}>Created on <img src={Sort} alt="Sorting" /></th>
                    <th style={{ width: "15%" }}>Modify by</th> */}
                    <th style={{ width: "20%" }}>Last modified</th>
                    <th style={{ width: "10%", cursor: "pointer" }} onClick={() => sortBy("status")}>State <img src={Sort} alt="Sorting" /></th>
                  </tr>
                </thead>

                <tbody id="kms-inbox-recent-nav">
                  {data.map((row, index) => (
                    <tr className="kms-inbox-recent" key={index} onContextMenu={(e) => openMenu(e, row)}>
                      {/* <td>
                        <div className="form-check d-flex align-items-center justify-content-center">
                          <input className="form-check-input check-box check-box2" type="checkbox" onChange={handleCheckChange} />
                        </div>
                      </td> */}
                      <td>
                        <img src={row.icon} alt="file" className="px-1" />
                        {/* {row.title} */}
                        <Link to="/documentdetails">
                       {row.title}
                        </Link>
                      </td>

                      <td>{row.createdBy}</td>
                      {/* <td>{row.createdOn}</td>
                      <td>{row.modifiedBy}</td> */}
                      <td>{row.modifiedOn}</td>

                      <td>
                        <span className={`download-table-content1 ${getStatusClass(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-end p-2">
              <nav aria-label="Page navigation example">
                <ul className="pagination kms-inbox-page mb-0">
                  <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                  <li className="page-item"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                  <li className="page-item"><a className="page-link" href="#">Next</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Listing


