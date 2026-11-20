import React from 'react'
import DocumentModal from "../components/elements/Modals";

const CenterHeader = () => {
    return (
        <>
            {/* SEARCH BAR + CREATE BUTTON */}
            <div className="col-xl-12 p-3">
                <div className="row align-items-center">

                    {/* SEARCH BAR */}
                    <div className="col-lg-10 col-md-10 order-2 order-md-1">
                        <div className="search-bar-kms pb-0">
                            <i className="bi bi-search"></i>

                            <div>
                                <label className="form-label visually-hidden">Email address</label>
                                <input type="email" className="form-control" />
                            </div>

                            <button type="button" className="btn icon-sliders border-0 bg-transparent" id="filterdropdownMenuButton"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-sliders2"></i>
                            </button>

                            {/* FILTER DROPDOWN */}
                            <ul className="dropdown-menu dropdown-menu-end search-bar-kms-filters">
                                <li>
                                    <ul className="overflow-auto p-3">
                                        <li className="heading">Type</li>

                                        {/* Type Filters */}
                                        <li>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <div className="form-check">
                                                        <input className="form-check-input check-box" type="checkbox" />
                                                        <label className="form-check-label">Circular</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-check">
                                                        <input className="form-check-input check-box" type="checkbox" />
                                                        <label className="form-check-label">Document</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>

                                        <li>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <div className="form-check">
                                                        <input className="form-check-input check-box" type="checkbox" />
                                                        <label className="form-check-label">Fax</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-check">
                                                        <input className="form-check-input check-box" type="checkbox" />
                                                        <label className="form-check-label">Letter</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>

                                        <li>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <div className="form-check">
                                                        <input className="form-check-input check-box" type="checkbox" />
                                                        <label className="form-check-label">Notice</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-check">
                                                        <input className="form-check-input check-box" type="checkbox" />
                                                        <label className="form-check-label">Office Order</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>

                                        <li>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <div className="form-check">
                                                        <input className="form-check-input check-box" type="checkbox" />
                                                        <label className="form-check-label">Other</label>
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-6">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" />
                                                        <label className="form-check-label">Document</label>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </li>

                                        {/* MORE FILTER SECTIONS — SAME STRUCTURE */}
                                        {/* You can keep these unchanged — structure is valid JSX */}

                                        <li className="heading">Category</li>
                                        <li>
                                            <select className="form-select form-select-sm">
                                                <option defaultValue="">Open this select menu</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </select>
                                        </li>

                                        <li className="heading">Language</li>

                                        <li>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <div className="form-check">
                                                        <input className="form-check-input check-box" type="checkbox" />
                                                        <label className="form-check-label">Hindi</label>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-check">
                                                        <input className="form-check-input check-box" type="checkbox" />
                                                        <label className="form-check-label">English</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>

                                        <li className="heading">Audience</li>

                                        <li>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <div className="form-check">
                                                        <input className="form-check-input check-box" type="checkbox" />
                                                        <label className="form-check-label">Joint Secretary</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-check">
                                                        <input className="form-check-input check-box" type="checkbox" />
                                                        <label className="form-check-label">Secretary</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>

                                        {/* DATE FILTERS */}
                                        <li className="heading">Created</li>
                                        <li className="cal-date">
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <input type="date" className="w-100" />
                                                </div>
                                                <div className="col-md-6">
                                                    <input type="date" className="w-100" />
                                                </div>
                                            </div>
                                        </li>

                                        <li className="heading">Modified</li>
                                        <li className="cal-date">
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <input type="date" className="w-100" />
                                                </div>
                                                <div className="col-md-6">
                                                    <input type="date" className="w-100" />
                                                </div>
                                            </div>
                                        </li>

                                    </ul>
                                </li>

                                {/* Footer Buttons */}
                                <li className="filter-footer pt-3">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 reset">
                                            <button type="button" className="btn">Reset</button>
                                        </div>
                                        <div>
                                            <button type="button" className="btn send-btn">Apply</button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* CREATE BUTTON */}
                    <div className="col-lg-2 col-md-2 order-1 order-md-2">
                        <div className="create-doc-btn d-flex justify-content-md-end">
                            <button className="btn send-btn" type="button" data-bs-toggle="dropdown">
                                Create
                            </button>

                            <ul className="dropdown-menu create-task-list">
                                <li><button className="border-0" data-bs-toggle="modal" data-bs-target="#collection">Collection</button></li>
                                <li><button className="border-0" data-bs-toggle="modal" data-bs-target="#document">Document</button></li>
                                <li><button className="border-0" data-bs-toggle="modal" data-bs-target="#link">Link</button></li>
                                <li><button className="border-0" data-bs-toggle="modal" data-bs-target="#online">Online</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <DocumentModal modalId="document"></DocumentModal>
            <DocumentModal modalId="collection" />
            <DocumentModal modalId="link" />
            <DocumentModal modalId="online" />
        </>
    )
};

export default CenterHeader
