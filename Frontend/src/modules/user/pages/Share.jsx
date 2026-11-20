import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from "react";

export default function Share() {
    const [outerTab, setOuterTab] = useState("contacts");
    const [contactTab, setContactTab] = useState("recent");
    const [groupTab, setGroupTab] = useState("recent");

    const [contactSearch, setContactSearch] = useState("");
    const [groupSearch, setGroupSearch] = useState("");

    const [contactFilter, setContactFilter] = useState("all");
    const [groupFilter, setGroupFilter] = useState("all");

    const contacts = [
        { id: 1, name: "Ruhaanika Verma" },
        { id: 2, name: "Ruhaanika Sharma" },
        { id: 3, name: "Aakash Kumar Sharma" },
    ];

    const groups = [
        { id: 1, name: "IT Team", members: 3 },
        { id: 2, name: "Admin Group", members: 5 },
        { id: 3, name: "Finance Group", members: 4 },
    ];

    const filteredContacts = contacts
        .filter(c =>
            c.name.toLowerCase().includes(contactSearch.toLowerCase())
        )
        .filter(() => contactFilter === "all" || true);

    const filteredGroups = groups
        .filter(g =>
            g.name.toLowerCase().includes(groupSearch.toLowerCase())
        )
        .filter(() => groupFilter === "all" || true);

    const groups1 = [
        {
            id: 1,
            name: "Aakash Kumar Sharma (0058)",
            membersCount: 2,
            members: [
                "Ruhaanika Verma - O/o Member (s) (Member)",
                "Ruhaanika Sharma - O/o Member (s) (Member)",
            ],
        },
        {
            id: 2,
            name: "Aakash Kumar Sharma (0059)",
            membersCount: 2,
            members: [
                "Ruhaanika Verma - O/o Member (s) (Member)",
                "Ruhaanika Sharma - O/o Member (s) (Member)",
            ],
        },
    ];

    return (

        <div className="main-bg p-4 tab-content">
            <div className="main-nav-heading mb-2 d-flex align-items-center">
                <nav style={{ "--bs-breadcrumb-divider": "'>'" }} aria-label="breadcrumb">
                    <ol className="breadcrumb doc-details-heading">
                        <li className="breadcrumb-item">
                            <Link to="/documentdetails">Document Details</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Share
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="main-nav-heading-deta d-flex align-items-center p-2">
                Details
            </div>

            <div className="row mt-0 gy-3 gy-md-3 pb-2 mb-lg-2">

                {/* Title */}
                <div className="col-12">
                    <div className="docs-head">
                        Vorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit
                        interdum, ac aliquet odio mattis.
                    </div>
                </div>

                {/* Meta */}
                <div className="col-12">
                    <div className="d-flex docs-time">
                        <div>13 Apr 2024</div>
                        <div>•</div>
                        <div>Posted by Ruhaanika Sharma</div>
                    </div>
                </div>

                {/* Description */}
                <div className="col-12 docs-time">
                    <div>
                        Gorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum
                        est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan.
                    </div>
                </div>

                {/* Download */}
                <div className="col-12">
                    <div className="doc-download">
                        <button type="button" className="btn d-flex p-3 text-nowrap">
                            <span><i className="bi bi-file-earmark-pdf-fill" /></span>
                            <span>Document Name</span>
                            <span><i className="bi bi-download" /></span>
                        </button>
                    </div>
                </div>

                <div className="main-nav-heading-deta d-flex align-items-center p-2">
                    Share
                </div>


                {/* ================= OUTER TABS ================= */}
                <div className=" col-12 kms-conatct-grp p-1">
                    <button
                        className={`btn me-2 ${outerTab === "contacts" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setOuterTab("contacts")}
                    >
                        Contacts
                    </button>

                    <button
                        className={`btn ${outerTab === "groups" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setOuterTab("groups")}
                    >
                        Groups
                    </button>
                </div>

                {/* ================= CONTACTS ================= */}
                {outerTab === "contacts" && (
                    <>
                        {/* INNER TABS */}
                        <div className="col-12 kms-contact-subbtn">
                            <button
                                className={`btn me-2 ${contactTab === "recent" ? "btn-secondary" : "btn-outline-secondary"}`}
                                onClick={() => setContactTab("recent")}
                            >
                                Recent
                            </button>

                            <button
                                className={`btn ${contactTab === "existing" ? "btn-secondary" : "btn-outline-secondary"}`}
                                onClick={() => setContactTab("existing")}>
                                Existing
                            </button>
                        </div>

                        {/* 🔽 DROPDOWN + SEARCH + ADD (RECENT ONLY) */}
                        {contactTab === "recent" && (
                            <div class="col-12">
                                <div className="row align-items-center gy-3 gy-md-0">
                                    <div className="col-lg-2 col-md-3 col-sm-4">
                                        <div class="user-selection">
                                            <select
                                                className="form-select py-1"
                                                value={contactFilter}
                                                onChange={(e) => setContactFilter(e.target.value)}>
                                                <option value="all">All Users</option>
                                                <option value="my">My Contacts</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-lg-8 col-md-7 col-12 flex-grow-1 d-flex justify-content-md-end justify-content-xl-end justify-content-start ps-3">
                                        <div class="d-flex flex-nowrap search-wrap-2">
                                            <input
                                                type="text"
                                                className="form-control py-2 ps-3"
                                                placeholder="Search contact"
                                                value={contactSearch}
                                                onChange={(e) => setContactSearch(e.target.value)}/>
                                        </div>
                                    </div>

                                    <div className="col-md-auto col-12 justify-content-md-start mt-xl-0 mt-md-0 mt-2">
                                        <button className="btn send-btn">Add</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CONTACT TABLE */}
                        <div className='p-0 table-border-radius table-responsive'>
                            <table className="table table-bordered text-center">
                                <thead className='record-list'>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Approver</th>
                                        <th>Viewer</th>
                                        <th>KM</th>
                                        <th>SMS</th>
                                        <th>Email</th>
                                        <th>Inherit</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {(contactTab === "recent" ? filteredContacts : contacts).map((c, i) => (
                                        <tr key={c.id}>
                                            <td>{i + 1}</td>
                                            <td>{c.name}</td>
                                            <td><input type="checkbox" /></td>
                                            <td><input type="checkbox" /></td>
                                            <td><input type="checkbox" /></td>
                                            <td><input type="checkbox" /></td>
                                            <td><input type="checkbox" /></td>
                                            <td><input type="checkbox" /></td>
                                            <td>
                                                {contactTab === "recent" ? (
                                                    <button className="btn btn-sm">Share</button>
                                                ) : (
                                                    <button className="btn btn-sm">Remove</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* ================= GROUPS ================= */}
                {outerTab === "groups" && (
                    <>
                        {/* INNER TABS */}
                        <div className="mb-3 kms-contact-subbtn">
                            <button
                                className={`btn me-2 ${groupTab === "recent" ? "btn-secondary" : "btn-outline-secondary"}`}
                                onClick={() => setGroupTab("recent")}
                            >
                                Recent
                            </button>

                            <button
                                className={`btn ${groupTab === "existing" ? "btn-secondary" : "btn-outline-secondary"}`}
                                onClick={() => setGroupTab("existing")}
                            >
                                Existing
                            </button>
                        </div>

                        {/* 🔽 DROPDOWN + SEARCH + ADD (RECENT ONLY) */}
                        {groupTab === "recent" && (
                            <>
                                <div className="row align-items-center gy-3 gy-md-0">
                                    <div className="col-lg-2 col-md-3 col-sm-4">
                                        <div className='user-selection'>
                                            <select className="form-select" value={groupFilter} nChange={(e) => setGroupFilter(e.target.value)}>
                                                <option value="all">All Groups</option>
                                                <option value="my">My Groups</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-lg-8 col-md-7 col-12 flex-grow-1 d-flex justify-content-md-end justify-content-xl-end justify-content-start ps-3">
                                        <div className='d-flex flex-nowrap search-wrap-2'>
                                            <input
                                                type="text"
                                                className="form-control py-2 ps-3"
                                                placeholder="Search group"
                                                value={groupSearch}
                                                onChange={(e) => setGroupSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-auto col-12 justify-content-md-start mt-xl-0 mt-md-0 mt-2">
                                        <button className="btn send-btn">Add</button>
                                    </div>
                                </div>
                                <div className='p-0 table-border-radius table-responsive'>
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

                                        <tbody id="accordionTable">
                                            {groups1.map((group, index) => (
                                                <React.Fragment key={group.id}>
                                                    {/* MAIN ROW */}
                                                    <tr className="tablerowalign">
                                                        <td className="text-center">{index + 1}.</td>
                                                        <td>{group.name}</td>
                                                        <td>{group.membersCount} members</td>
                                                        <td>
                                                            <button type="button" className="btn">
                                                                Share
                                                            </button>
                                                        </td>
                                                        <td className="text-center">
                                                            <button
                                                                className="accordion-button collapsed accordion-btn-custom p-2"
                                                                type="button"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target={`#collapse-${group.id}`}
                                                                aria-expanded="false"
                                                                aria-controls={`collapse-${group.id}`}
                                                            >
                                                                <i className="bi bi-chevron-down"></i>
                                                            </button>
                                                        </td>
                                                    </tr>

                                                    {/* ACCORDION ROW */}
                                                    <tr className="accordion-row">
                                                        <td colSpan="5" className="p-0">
                                                            <div
                                                                id={`collapse-${group.id}`}
                                                                className="accordion-collapse collapse grps-recent-nav"
                                                                data-bs-parent="#accordionTable"
                                                            >
                                                                <table className="table table-task bg-light mb-0 grps-recent">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="text-start" style={{ width: "30%" }}>
                                                                                Name
                                                                            </th>
                                                                            {[
                                                                                "Approver",
                                                                                "Viewer",
                                                                                "Knowledge Manager",
                                                                                "SMS Alert",
                                                                                "Email Alert",
                                                                                "Inherit Permission",
                                                                            ].map((role) => (
                                                                                <th key={role} style={{ width: "10%" }}>
                                                                                    {role}
                                                                                </th>
                                                                            ))}
                                                                            <th style={{ width: "10%" }}></th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>
                                                                        {group.members.map((member, i) => (
                                                                            <tr key={i}>
                                                                                <td className="text-start">{member}</td>

                                                                                {[...Array(6)].map((_, idx) => (
                                                                                    <td key={idx}>
                                                                                        <div className="form-check d-flex justify-content-center">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="checkbox"
                                                                                            />
                                                                                        </div>
                                                                                    </td>
                                                                                ))}

                                                                                <td>
                                                                                    <button className="btn">
                                                                                        <i className="bi bi-x-lg"></i>
                                                                                    </button>
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
                                    </table>
                                </div>
                            </>
                        )}

                        {/* GROUP TABLE */}
                        {groupTab === "existing" && (
                            <div className='p-0 table-border-radius table-responsive'>
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

                                    <tbody id="accordionTable">
                                        {groups1.map((group, index) => (
                                            <React.Fragment key={group.id}>
                                                {/* MAIN ROW */}
                                                <tr className="tablerowalign">
                                                    <td className="text-center">{index + 1}.</td>
                                                    <td>{group.name}</td>
                                                    <td>{group.membersCount} members</td>
                                                    <td>
                                                        <button type="button" className="btn">
                                                            Remove
                                                        </button>
                                                    </td>
                                                    <td className="text-center">
                                                        <button
                                                            className="accordion-button collapsed accordion-btn-custom p-2"
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target={`#collapse-${group.id}`}
                                                            aria-expanded="false"
                                                            aria-controls={`collapse-${group.id}`}
                                                        >
                                                            <i className="bi bi-chevron-down"></i>
                                                        </button>
                                                    </td>
                                                </tr>

                                                {/* ACCORDION ROW */}
                                                <tr className="accordion-row">
                                                    <td colSpan="5" className="p-0">
                                                        <div
                                                            id={`collapse-${group.id}`}
                                                            className="accordion-collapse collapse grps-recent-nav"
                                                            data-bs-parent="#accordionTable"
                                                        >
                                                            <table className="table table-task bg-light mb-0 grps-recent">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="text-start" style={{ width: "30%" }}>
                                                                            Name
                                                                        </th>
                                                                        {[
                                                                            "Approver",
                                                                            "Viewer",
                                                                            "Knowledge Manager",
                                                                            "SMS Alert",
                                                                            "Email Alert",
                                                                            "Inherit Permission",
                                                                        ].map((role) => (
                                                                            <th key={role} style={{ width: "10%" }}>
                                                                                {role}
                                                                            </th>
                                                                        ))}
                                                                        <th style={{ width: "10%" }}></th>
                                                                    </tr>
                                                                </thead>

                                                                <tbody>
                                                                    {group.members.map((member, i) => (
                                                                        <tr key={i}>
                                                                            <td className="text-start">{member}</td>

                                                                            {[...Array(6)].map((_, idx) => (
                                                                                <td key={idx}>
                                                                                    <div className="form-check d-flex justify-content-center">
                                                                                        <input
                                                                                            className="form-check-input"
                                                                                            type="checkbox"
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                            ))}

                                                                            <td>
                                                                                <button className="btn">
                                                                                    <i className="bi bi-x-lg"></i>
                                                                                </button>
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
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
