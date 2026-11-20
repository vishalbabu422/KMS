import Notification from "../assets/images/svg/Right Panel/Notification.svg";
import NotificationHover from "../assets/images/svg/Right Panel/Notification-hover.svg";
import Inbox from "../assets/images/svg/Right Panel/Inbox.svg";
import InboxHover from "../assets/images/svg/Right Panel/Inbox-hover.svg";
import Themes from "../assets/images/svg/Right Panel/Themes.svg";
import ThemesHover from "../assets/images/svg/Right Panel/Themes-hover.svg";
import Browse from "../assets/images/svg/Right Panel/Browse.svg";
import BrowseHover from "../assets/images/svg/Right Panel/Browse-hover.svg";
// import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const Right = () => {

     const navigate = useNavigate();

  const inboxItems = [
    { label: "All Recent", path: "/recent" },
    { label: "Pending", path: "/pending" },
    { label: "Shared", path: "/shared" },
    { label: "Subscribed", path: "/subscribed" },
    { label: "Published", path: "/published" },
    { label: "Submitted", path: "/submitted" },
    { label: "Reviewed", path: "/reviewed" },
  ];
    const browseItems = [
    { label: "By Type", path: "/Bytype" },
    { label: "By Category", path: "/Bycategory" },
    { label: "By Organisation", path: "/shared" },
    { label: "By Audience", path: "/subscribed" },
    { label: "By Language", path: "/submitted" },
    { label: "By Time", path: "/reviewed" },
  ];


    //const [theme, setTheme] = useState("default");

    const { theme, setTheme } = useTheme();


    //  useEffect(() => {
    //     const windowWidth = window.innerWidth;

    //     document.body.classList.remove("default", "dark", "green", "brick", "olive");

    //     document.body.classList.add(theme);

    //     if (windowWidth <= 1024) {
    //         document.body.classList.add("left-side-collapsed");
    //     } else {
    //         document.body.classList.remove("left-side-collapsed");
    //     }
    // }, [theme]);

    // const handleThemeClick = (e) => {

    //     const selectedTheme = e.currentTarget.dataset.theme;
    //     setTheme(selectedTheme);
    // };

    return (
        <>
            <div className="right-panel d-flex flex-column">
                <div className="right-panel-nav">
                    <ul className="p-0" id="right-panel-nav">

                        {/* ================== Notification ================== */}
                        <li className="dropstart">
                            <button type="button" className="btn right-panel-nav-btn w-auto" id="dropdownBtn2" data-bs-toggle="dropdown" aria-expanded="false"
                                aria-label="Notification" title="Notification" data-bs-auto-close="outside">
                                <div className="right-images">
                                    <img src={Notification} alt="Notification" />
                                    <img src={NotificationHover} alt="Notification" />
                                </div>
                                <div className="text d-flex justify-content-start">
                                    <img
                                        className="pe-3"
                                        src={NotificationHover}
                                        alt="Notification"
                                    />
                                    Notification
                                </div>
                            </button>

                            <ul className="dropdown-menu menu-record notification-drp-height" id="dropdownMenu2">
                                <li>
                                    <div className="right-dropdown-heading px-2 py-0 d-flex align-items-center">
                                        <div>Notifications</div>
                                    </div>

                                    <div className="right-dropdown-content-sub-heading border-0 p-2 d-flex align-items-center">
                                        <div>
                                            You have <span>2 Notifications</span> today
                                        </div>

                                        <div className="ms-auto pe-2">
                                            <div className="notify-filter dropstart">
                                                <button
                                                    className="btn p-0"
                                                    type="button"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                    data-bs-auto-close="outside"
                                                >
                                                    <i className="bi bi-funnel"></i>
                                                </button>

                                                <ul className="dropdown-menu contact-options">
                                                    {["Today", "This Week", "This Month", "Read", "Unread"].map((label, index) => (
                                                        <li key={index}>
                                                            <span>
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="radioDefault"
                                                                        id={`radioDefault${index}`}
                                                                    />
                                                                    <label className="form-check-label" htmlFor={`radioDefault${index}`}>
                                                                        {label}
                                                                    </label>
                                                                </div>
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notification Groups */}
                                    <div className="other-ser-nav">
                                        {/* ==== Today ==== */}
                                        <div>
                                            <div className="right-dropdown-sub-heading p-2 pb-0 d-flex align-items-center">
                                                Today
                                            </div>

                                            <div className="row w-100 gx-1 gy-2">
                                                {["Now", "1h ago"].map((time, idx) => (
                                                    <div className="col-12" key={idx}>
                                                        <div className="right-dropdown-content-sub-heading py-3 d-flex align-items-start row w-100 gx-1">
                                                            <div className="col-2 d-flex justify-content-center">
                                                                <div className="notify-user-pic">
                                                                    <i className="bi bi-person-fill"></i>
                                                                </div>
                                                            </div>
                                                            <div className="col-10 right-btn-content">
                                                                <button className="btn border-0" type="button">
                                                                    <span>Vinod Sharma</span> shared an Appointment "test" on 14 May 2025
                                                                </button>
                                                                <div className="mt-1">{time}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* ==== This week ==== */}
                                        <div>
                                            <div className="right-dropdown-sub-heading p-2 pb-0 d-flex align-items-center">
                                                This week
                                            </div>

                                            <div className="row w-100 gx-1 gy-2">
                                                {["10 July 2025 11:20", "09 July 2025 14:20"].map((time, idx) => (
                                                    <div className="col-12" key={idx}>
                                                        <div className="right-dropdown-content-sub-heading py-3 d-flex align-items-start row w-100 gx-1">
                                                            <div className="col-2 d-flex justify-content-center">
                                                                <div className="notify-user-pic">
                                                                    <i className="bi bi-person-fill"></i>
                                                                </div>
                                                            </div>
                                                            <div className="col-10 right-btn-content">
                                                                <button className="btn border-0" type="button">
                                                                    <span>Vinod Sharma</span> shared an Appointment "test"
                                                                </button>
                                                                <div className="mt-1">{time}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>

                        {/* ================== Inbox ================== */}
                        <li className="dropstart">
                            <button
                                type="button"
                                className="btn right-panel-nav-btn w-auto"
                                id="dropdownBtn"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                aria-label="Menu"
                                title="Inbox"
                                // to="/Recent"

                            >
                                <div className="right-images">
                                    <img src={Inbox} alt="Menu" className="img1" />
                                    <img src={InboxHover} alt="Inbox" className="img2" />
                                </div>
                                <div className="text d-flex justify-content-start">
                                    <img className="pe-3" src={InboxHover} alt="Inbox" />
                                    Inbox
                                </div>
                            </button>

                            <div className="overlay" id="overlay"></div>

                            <ul className="dropdown-menu menu-record" id="dropdownMenu">
                                <li>
                                    <div className="right-dropdown-heading px-2 py-0 d-flex align-items-center">
                                        <div>Inbox</div>
                                    </div>

                                    <ul className="other-ser-nav p-2">
                                        <li>
                                            <div className="accordion1" id="accordionExample">
                                                <div className="accordion-item-demo">
                                                    <div id="collapseOne-demo" className="accordion-collapse-demo collapse show" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body-demo other-ser-opt">
                                                            <ul className="ps-0">
                                                                {inboxItems.map((item) => (
                                                                    <li key={item.path}>
                                                                        <button type="button" className="btn w-auto" onClick={() => navigate(item.path)}>
                                                                            {item.label}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>



                        <li className="dropstart">
                            <button
                                type="button"
                                className="btn right-panel-nav-btn w-auto"
                                id="dropdownBtn"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                aria-label="Menu"
                                title="Browse"
                                // to="/Recent"

                            >
                                <div className="right-images">
                                    <img src={Browse} alt="Browse" className="img1" />
                                    <img src={BrowseHover} alt="Browse" className="img2" />
                                </div>
                                <div className="text d-flex justify-content-start">
                                    <img className="pe-3" src={BrowseHover} alt="Browse" />
                                    Browse
                                </div>
                            </button>

                            <div className="overlay" id="overlay"></div>

                            <ul className="dropdown-menu menu-record" id="dropdownMenu">
                                <li>
                                    <div className="right-dropdown-heading px-2 py-0 d-flex align-items-center">
                                        <div>Browse</div>
                                    </div>

                                    <ul className="other-ser-nav p-2">
                                        <li>
                                            <div className="accordion1" id="accordionExample">
                                                <div className="accordion-item-demo">
                                                    <div id="collapseOne-demo" className="accordion-collapse-demo collapse show" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body-demo other-ser-opt">
                                                            <ul className="ps-0">
                                                                {browseItems.map((item) => (
                                                                    <li key={item.path}>
                                                                        <button type="button" className="btn w-auto" onClick={() => navigate(item.path)}>
                                                                            {item.label}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>

                        {/* ================== Themes ================== */}
                        {/* <li className="dropstart">
                            <button
                                type="button"
                                className="btn right-panel-nav-btn w-auto"
                                aria-label="Themes"
                                title="Themes"
                                id="dropdownBtn6"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                data-bs-auto-close="outside"
                            >
                                <div className="right-images">
                                    <img src={Themes} alt="Themes" />
                                    <img src={ThemesHover} alt="Themes" />
                                </div>
                                <div className="text d-flex justify-content-start">
                                    <img
                                        className="pe-3"
                                        src={ThemesHover}
                                        alt="Themes"
                                    />
                                    Themes
                                </div>
                            </button>

                            <ul className="dropdown-menu menu-record">
                                <li>
                                    <div className="right-dropdown-heading px-2 py-0 d-flex align-items-center">
                                        <div>Themes</div>
                                    </div>

                                    <ul className="other-ser-nav p-2 d-flex justify-content-center">
                                        <li className="w-100 d-flex justify-content-center">

                                            <div className="row w-100">
                                                <div className="col-12">
                                                    <div className="row justify-content-center theme-list">

                                                        {["default", "dark", "green", "brick", "olive"].map((theme, idx) => (
                                                            <div className="col-auto p-0 px-2" key={idx}>
                                                                <button
                                                                    aria-label={`${theme}-theme`}
                                                                    title={`${theme}-theme`}
                                                                    className={`btn theme-button ${theme}-theme`}
                                                                    className={`btn theme-button ${theme}-theme`}
                                                                    data-theme={theme}
                                                                    onClick={handleThemeClick}
                                                                ></button>
                                                            </div>
                                                        ))}

                                                    </div>
                                                </div>
                                            </div>

                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li> */}

                        <li className="dropstart">
                            <button
                                type="button"
                                className="btn right-panel-nav-btn w-auto"
                                title="Themes"
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="outside"
                            >
                                <div className="right-images">
                                    <img src={Themes} alt="Themes" />
                                    <img src={ThemesHover} alt="Themes" />
                                </div>
                                <div className="text d-flex justify-content-start">
                                    <img className="pe-3" src={ThemesHover} alt="Themes" />
                                    Themes
                                </div>
                            </button>

                            <ul className="dropdown-menu menu-record">
                                <li>
                                    <div className="right-dropdown-heading px-2 py-0">
                                        Themes
                                    </div>

                                    <ul className="other-ser-nav p-2 d-flex justify-content-center">
                                        <li className="w-100">
                                            <div className="row justify-content-center theme-list w-100">

                                                {["default", "dark", "green", "brick", "olive"].map(
                                                    (t) => (
                                                        <div className="col-auto px-2" key={t}>
                                                            <button
                                                                className={`btn theme-button ${t}-theme ${theme === t ? "active" : ""
                                                                    }`}
                                                                aria-label={`${t}-theme`}
                                                                title={`${t}-theme`}
                                                                onClick={() => setTheme(t)}
                                                            />
                                                        </div>
                                                    )
                                                )}

                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>

                    </ul>
                </div>
            </div>

        </>
    );
};
export default Right;
