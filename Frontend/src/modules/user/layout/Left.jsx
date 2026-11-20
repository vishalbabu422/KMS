import DummyImage from "../assets/images/Side-Panel/dummy_img.png";
import HomeImage from "../assets/images/KMS Icons/Home.svg";
import Collection from "../assets/images/KMS Icons/Collection.svg";
import MyDocs from "../assets/images/KMS Icons/My-Docs.svg";
import ContactGroup from "../assets/images/KMS Icons/Contact-Group.svg";
import RecentArrival from "../assets/images/KMS Icons/Recent_Arrival.svg";
import Submitted from "../assets/images/KMS Icons/Submitted.svg";
import Published from "../assets/images/KMS Icons/Published.svg";
import Pending from "../assets/images/KMS Icons/Pending.svg";
import SharedWithMe from "../assets/images/KMS Icons/Shared _with_me.svg";
import SharedByMe from "../assets/images/KMS Icons/Shared_by_me.svg";
import Profile from "../assets/images/svg/Profile/profile.svg";
import Timeline from "../assets/images/svg/Profile/timeline.svg";
import Admin from "../assets/images/svg/Profile/admin.svg";
import useBodyToggleClass from "../hooks/WindowToggle";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Left = () => {

    const [isOpen, setIsOpen] = useState(true);
    // const [isLeftSideOpen, setLeftSideOpen] = useState(false);

    const navigate = useNavigate();

    const handleToggle = (e) => {
        e.preventDefault();          // stop anchor from jumping to top
        setIsOpen((prev) => !prev);  // toggle open/close
        // setLeftSideOpen((prev) => !prev);
    };

    // const [isLeftSideOpen, setLeftSideOpen] = useState(false);

    // const handleToggleOpen = (e) => {
    //     e.preventDefault();      
    //     setLeftSideOpen((prev) => !prev);
    // };

    // const style = {
    //     display: isOpen ? "block" : "none",
    // transition: "height 0.35s ease",
    // };

    // -----------------------------------------------------

    const [isLeftOpen, setLeftOpen] = useState(false);

    const handleLeftNavToggle = () => {
        setLeftOpen((prev) => !prev);
        document.querySelector(".user-module")?.classList.toggle("left-side-collapsed");
    };

    useBodyToggleClass(isLeftOpen, setLeftOpen);

    // ------------------------------------------------------

    // const [isLeftOpen, setLeftOpen] = useState(true);

    // const handleLeftToggle = (e) => {
    //     e.preventDefault();
    //     setLeftOpen((prev) => !prev);
    // }


    return (
        <>
            <aside
                className="left-side sticky-left-side d-flex flex-column"
                id="left-navigation"
                tabIndex="-1"
            >
                <div className="left-nav-toggle-btn-wrapper flex-shrink-0 d-flex justify-content-start">
                    <button aria-expanded="false" aria-label="Left side menu toggle" title="Left side menu toggle"
                        role="region"
                        className="left-nav-toggle-btn"
                        data-id-attr="navigation-icon"
                        id="left-nav-toggle-btn"
                        type="button"
                        onClick={handleLeftNavToggle}
                    >
                        <span className="bi bi-list bars" aria-hidden="true"></span>
                    </button>

                    <div className="dropdown ms-auto profile-list" style={{ display: isLeftOpen ? "none" : "block" }}>
                        <button
                            className="btn border-0 px-2 py-0"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="bi bi-three-dots"></i>
                        </button>

                        <ul className="dropdown-menu p-2">
                            <li className="dropdown-item">
                                <button
                                    type="button"
                                    className="btn border-0 d-flex align-items-center px-0 w-100"
                                >
                                    <img src={Profile} alt="Profile" />
                                    <span className="px-2">Profile</span>
                                </button>
                            </li>

                            <li className="dropdown-item">
                                <button
                                    type="button"
                                    className="btn border-0 d-flex align-items-center px-0 w-100"
                                >
                                    <img src={Timeline} alt="Timeline" />
                                    <span className="px-2">Timeline</span>
                                </button>
                            </li>

                            <li className="dropdown-item">
                                <button
                                    type="button"
                                    className="btn border-0 d-flex align-items-center px-0 w-100"
                                    onClick={() => navigate("/admin/dashboard")}
                                >
                                    <img src={Admin} alt="Admin" />
                                    <span className="px-2">Admin</span>
                                </button>
                            </li>

                            <li className="dropdown-item">
                                <div className="form-check form-switch d-flex align-items-center">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id="statusToggle"
                                    />
                                    <label className="status-label ms-2" htmlFor="statusToggle">
                                        Available
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <nav aria-label="Primary Navigation" className="left-side-inner">
                    <ul className="nav nav-pills nav-stacked custom-nav profile-info flex-column w-100">
                        <li className={`menu-list1 has-sub-nav ${isOpen ? "" : "active"}`}>
                            <a
                                className="btn sub-nav-toggle-btn pro-det-nav justify-content-center"
                                href="#"
                                aria-label="Profile Tab"
                                aria-expanded={isOpen}
                                onClick={handleToggle}
                                style={{ height: isLeftOpen ? "auto" : "120px" }}
                            >
                                <div className="profile_details_drop">
                                    <img
                                        alt="User profile"
                                        className="user-profile-img"
                                        src={DummyImage}
                                        aria-hidden="true"
                                    />
                                    <div
                                        className="menu-list-text text-wrap pt-3"
                                    // style={{ display: isLeftOpen ? "none" : "block"}}
                                    >
                                        Sankalp Agarwal
                                    </div>
                                </div>
                            </a>

                            {/* <ul className="left-sub-nav {style}"> */}
                            {/* <ul className={`left-sub-nav ${style}`}> */}

                            <ul className={`left-sub-nav ${isOpen ? "closed" : "open"}`}>
                                <li className="sub-nav-item">
                                    <div className="sub-nav-link1">Scientist D</div>
                                </li>
                                <li className="sub-nav-item">
                                    <div className="sub-nav-link1">sankalp.agarwal@nic.in</div>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    <div className="lower-navigation">
                        <ul className="nav nav-pills nav-stacked custom-nav left-nav-info d-flex" style={{ margin: isLeftOpen ? "1px" : "5px" }}>
                            <li className="menu-list border-top-left" style={{ width: isLeftOpen ? "100%" : "50%" }}>
                                {/* <a className="btn sub-nav-toggle-btn" href="#" aria-label="Home" style={{ height: isLeftOpen ? "auto" : "92.15px" }}>
                                    <span className="nav-icon-wrap">
                                        <img
                                            alt="Home"
                                            src={HomeImage}
                                            aria-hidden="true"
                                            data-bs-toggle="tooltip"
                                            data-bs-title="Home"
                                            data-bs-placement="right"
                                        />
                                    </span>
                                    <span className="menu-list-text">Home</span>
                                </a> */}
                                <Link to="/" className="btn sub-nav-toggle-btn" aria-label="Home" style={{ height: isLeftOpen ? "auto" : "92.15px" }}>
                                    <span className="nav-icon-wrap">
                                        <img alt="Home" src={HomeImage} aria-hidden="true" data-bs-toggle="tooltip" data-bs-title="Home" data-bs-placement="right" />
                                    </span>
                                    <span className="menu-list-text">Home</span>
                                </Link>
                            </li>

                            <li className="menu-list border-top-left" style={{ width: isLeftOpen ? "100%" : "50%" }}>
                                <Link to="/Collection" className="btn sub-nav-toggle-btn" aria-label="Collection" style={{ height: isLeftOpen ? "auto" : "92.15px" }}>
                                    <span className="nav-icon-wrap">
                                        <img alt="Collection" src={Collection} aria-hidden="true" data-bs-toggle="tooltip" data-bs-title="Collection" data-bs-placement="right" />
                                    </span>
                                    <span className="menu-list-text">Collection</span>
                                </Link>

                                {/* <a className="btn sub-nav-toggle-btn" href="#" aria-label="Home" style={{ height: isLeftOpen ? "auto" : "92.15px" }}>
                                    <span className="nav-icon-wrap">
                                        <img
                                            alt="Home"
                                            src={HomeImage}
                                            aria-hidden="true"
                                            data-bs-toggle="tooltip"
                                            data-bs-title="Home"
                                            data-bs-placement="right"
                                        />
                                    </span>
                                    <span className="menu-list-text">Home</span>
                                </a> */}
                            </li>

                            {/* <li className="menu-list border-top-right" style={{ width: isLeftOpen ? "100%" : "50%" }}>
                                <a className="btn sub-nav-toggle-btn" href="#" aria-label="Collection" style={{ height: isLeftOpen ? "auto" : "92.15px" }}>
                                    <span className="nav-icon-wrap">
                                        <img
                                            alt="Collection"
                                            src={Collection}
                                            aria-hidden="true"
                                            data-bs-toggle="tooltip"
                                            data-bs-title="Collection"
                                            data-bs-placement="right"
                                        />
                                    </span>
                                    <span className="menu-list-text">Collection</span>
                                </a>
                            </li> */}

                            <li className="menu-list" style={{ width: isLeftOpen ? "100%" : "50%" }}>
                                <Link to="/MyDocs" className="btn sub-nav-toggle-btn" aria-label="My Docs" style={{ height: isLeftOpen ? "auto" : "92.15px" }}>
                                    <span className="nav-icon-wrap">
                                        <img alt="My Docs" src={MyDocs} aria-hidden="true" data-bs-toggle="tooltip" data-bs-title="My Docs" data-bs-placement="right" />
                                    </span>
                                    <span className="menu-list-text">My Docs</span>
                                </Link>

                                {/* <a className="btn sub-nav-toggle-btn" href="#" aria-label="My Docs" style={{ height: isLeftOpen ? "auto" : "92.15px" }}>
                                    <span className="nav-icon-wrap">
                                        <img
                                            alt="My Docs"
                                            src={MyDocs}
                                            aria-hidden="true"
                                            data-bs-toggle="tooltip"
                                            data-bs-title="My Docs"
                                            data-bs-placement="right"
                                        />
                                    </span>
                                    <span className="menu-list-text">My Docs</span>
                                </a> */}
                            </li>

                            <li className="menu-list" style={{ width: isLeftOpen ? "100%" : "50%" }}>
                                {/* <a className="btn sub-nav-toggle-btn" href="#" aria-label="Contact Group" style={{ height: isLeftOpen ? "auto" : "92.15px" }}>
                                    <span className="nav-icon-wrap">
                                        <img
                                            alt="Contact Group"
                                            src={ContactGroup}
                                            aria-hidden="true"
                                            data-bs-toggle="tooltip"
                                            data-bs-title="Contact Group"
                                            data-bs-placement="right"
                                        />
                                    </span>
                                    <span className="menu-list-text">Contact Group</span>
                                </a> */}

                                <Link to="/ContactGroup" className="btn sub-nav-toggle-btn" aria-label="Contactgroup" style={{ height: isLeftOpen ? "auto" : "92.15px" }}>
                                    <span className="nav-icon-wrap">
                                        <img alt="Contact Group" src={ContactGroup} aria-hidden="true" data-bs-toggle="tooltip" data-bs-title="Contact Group" data-bs-placement="right" />
                                    </span>
                                    <span className="menu-list-text">Contact Group</span>
                                </Link>
                            </li>
                        </ul>



                        <ul className="recent-data-nav px-1 mx-1">
                            {[
                                { icon: RecentArrival, label: "Recent Arrival", className: "recent-arrival", path: "/recent"},
                                { icon: Submitted, label: "Submitted", className: "submitted", path: "/submitted" },
                                { icon: Published, label: "Published", className: "published", path: "/published" },
                                { icon: Pending, label: "Pending", className: "pending", path: "/pending" },
                                { icon: SharedWithMe, label: "SharedWithMe", className: "with-me", path: "/shared" },
                                { icon: SharedByMe, label: "SharedByMe", className: "by-me" },
                            ].map((item, index) => (
                                <li className={`recent-data ${item.className}`} key={index}>
                                    <button className="btn d-flex px-1 border-0 w-100 recent-data-btn" onClick={() => navigate(item.path)} type="button" style={{ height: isLeftOpen ? "45px" : "55px" }}>
                                        <img src={item.icon} alt={item.label} />
                                        <div className="flex-column px-3 flex-grow-1 align-items-center data-nav">
                                            <div className={item.className}>{item.label}</div>
                                            <div>23,729</div>
                                        </div>
                                    </button>

                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </aside>

            
        </>
    )
};

export default Left;
