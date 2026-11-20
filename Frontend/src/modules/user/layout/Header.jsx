import React from "react";
import eoffice_Logo from "../assets/images/svg/Header_Icons/eOffice-Logo.svg";
import skipcontent from "../assets/images/svg/Header_Icons/skiptocontent.svg";
import Accessibility from "../assets/images/svg/Header_Icons/Accessibility.svg";
import Sitemap from "../assets/images/svg/Header_Icons/Sitemap.svg";
import Help from "../assets/images/svg/Header_Icons/Help.svg";
import Language from "../assets/images/svg/Header_Icons/Language.svg";
import Logout from "../assets/images/svg/Header_Icons/Logout.svg";
import text_increase from "../assets/images/svg/Accessibility/text_increase.svg";
import text_decrease from "../assets/images/svg/Accessibility/text_decrease.svg";
import text_reset from "../assets/images/svg/Accessibility/text_reset.svg";
import text_spacing from "../assets/images/svg/Accessibility/text_spacing.svg";
import line_height from "../assets/images/svg/Accessibility/line_height.svg";

const Header = () => {



// ---- Text Spacing ----

// let spacingClicks = 0;
// const maxSpacingClicks = 5;

// function increaseSpacing() {
//   const textElement = document.getElementById('text-spacing');
//   let currentSpacing = window.getComputedStyle(textElement).letterSpacing;

//   if (currentSpacing === 'normal') {
//     currentSpacing = '0px';
//   }

//   let currentValue = parseFloat(currentSpacing);

//   spacingClicks++;

//   if (spacingClicks > maxSpacingClicks) {
//     // Reset spacing and click count
//     textElement.style.letterSpacing = '0px';
//     spacingClicks = 0;
//     return;
//   }

//   let newValue = currentValue + 1;
//   textElement.style.letterSpacing = `${newValue}px`;
// }


let spacingClicks = 0;
const maxSpacingClicks = 5;

function increaseSpacing() {
  const textElement = document.getElementById("text-spacing");

  let currentSpacing = window.getComputedStyle(textElement).letterSpacing;
  let currentValue = currentSpacing === "normal" ? 0 : parseFloat(currentSpacing);

  spacingClicks++;

  if (spacingClicks > maxSpacingClicks) {
    textElement.style.letterSpacing = "0px";
    spacingClicks = 0;
    return;
  }

  let newValue = currentValue + 1;
  textElement.style.letterSpacing = `${newValue}px`;
}



// ---- Line Height ----
let currentLineHeight = 1.5;      // starting line height
const maxClicks = 5;               // max increments before reset
let clickCount = 0;

function changeLineHeight() {
  clickCount++;

  if (clickCount > maxClicks) {
    // Reset line height and click count
    currentLineHeight = 1.5;
    clickCount = 1;  // count this click as first after reset
  } else {
    // Increase line height by 0.2
    currentLineHeight += 0.2;
  }


  // Apply new line height to body
  document.body.style.lineHeight = currentLineHeight;

  console.log(`Click #${clickCount}, line height: ${currentLineHeight}`);
}

// Initialize line height on page load
document.body.style.lineHeight = currentLineHeight;




let defaultFontSize = getComputedStyle(document.documentElement).fontSize;

let fontIncDecConfig = {
  downStep: 2,
  upStep: 3,
};

function fontSizeIncrease() {
  let currentFontSize = getComputedStyle(document.documentElement).fontSize;
  let defaultFontSizeInit = parseInt(defaultFontSize, 10);
  let currentFontSizeInt = parseInt(currentFontSize, 10);

  if (currentFontSizeInt < (defaultFontSizeInit + fontIncDecConfig.upStep)) {
    document.documentElement.style.fontSize = (currentFontSizeInt + 1) + "px";
  } else {
    return true;
  }
}

function fontSizeDecrease() {
  let currentFontSize = getComputedStyle(document.documentElement).fontSize;
  let defaultFontSizeInit = parseInt(defaultFontSize, 10);
  let currentFontSizeInt = parseInt(currentFontSize, 10);

  if (currentFontSizeInt > (defaultFontSizeInit - fontIncDecConfig.downStep)) {
    document.documentElement.style.fontSize = (currentFontSizeInt - 1) + "px";
  } else {
    return true;
  }
}

function fontSizeReset() {
  document.documentElement.style.fontSize = defaultFontSize;
}

    
    return (
        <>
            <header className="app-header d-flex pt-2" id="app-header" tabIndex="-1">
                <div className="header-content-area d-md-flex flex-grow-1">

                    {/* Logo Section */}
                    <div className="d-flex align-items-center justify-content-center">
                        <a href="#" aria-label="eOffice Logo">
                            <img className="img-fluid" alt="eOffice Logo" src={eoffice_Logo} aria-hidden="true" title="eOffice Logo"/>
                        </a>
                    </div>

                    {/* Right Section */}
                    <div className="profile_details navbar py-0 ms-auto d-flex align-items-center flex-nowrap">
                        <div className="py-2 d-flex flex-md-column flex-grow-1">

                            <div className="right-head-content pe-2 text-end justify-content-end d-md-flex d-none">
                                National Informatics Center<br />
                                Government of India
                            </div>

                            {/* Quick Links */}
                            <div className="d-flex flex-grow-1 pt-md-2 justify-content-center font-nav" style={{ color: "white" }}>
                                <ul className="d-flex quick-links-nav mb-0 ps-0">

                                    {/* Skip to Content */}
                                    <li>
                                        <button
                                            type="button"
                                            className="btn w-auto"
                                            aria-label="Skip to main content"
                                            title="Skip to main content"
                                            style={{ color: "white" }}
                                        >
                                            <img
                                                src={skipcontent}
                                                alt="Skip to main content"
                                            />
                                        </button>
                                    </li>

                                    {/* Accessibility Dropdown */}
                                    <li className="dropdown">
                                        <button
                                            type="button"
                                            className="btn w-auto"
                                            aria-label="Accessibility"
                                            title="Accessibility"
                                            style={{ color: "white" }}
                                            data-bs-toggle="dropdown"
                                            data-bs-display="static"
                                            data-bs-auto-close="outside"
                                        >
                                            <img src={Accessibility} alt="Accessibility" />
                                        </button>

                                        <ul className="dropdown-menu dropdown-menu-start accessibility p-3">
                                            <li>
                                                <div className="dd-heading pb-2">Accessibility Tools</div>
                                            </li>

                                            <li>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row">

                                                            <div className="col-12">
                                                                <div className="dd-sub-heading py-2 border-bottom">Text size</div>
                                                            </div>

                                                            <div className="col-6 text-center">
                                                                <button className="btn w-auto" onClick={() => fontSizeIncrease()}>
                                                                    <img src={text_increase} alt="Text Increase" />
                                                                    <div className="dd-content">
                                                                        Text <br />Increase
                                                                    </div>
                                                                </button>
                                                            </div>

                                                            <div className="col-6 text-center">
                                                                <button className="btn w-auto" onClick={() => fontSizeDecrease()}>
                                                                    <img src={text_decrease} alt="Text Decrease" />
                                                                    <div className="dd-content">Text Decrease</div>
                                                                </button>
                                                            </div>

                                                            <div className="col-6 text-center">
                                                                <button className="btn w-auto" onClick={() => fontSizeReset()}>
                                                                    <img src={text_reset} alt="Text Reset" />
                                                                    <div className="dd-content">
                                                                        Text <br />Reset
                                                                    </div>
                                                                </button>
                                                            </div>

                                                            <div className="col-6 text-center">
                                                                <button className="btn w-auto" onClick={() => increaseSpacing()}>
                                                                    <img src={text_spacing} alt="Text Spacing" />
                                                                    <div className="dd-content">
                                                                        Text <br />Spacing
                                                                    </div>
                                                                </button>
                                                            </div>

                                                            <div className="col-6 text-center">
                                                                <button className="btn w-auto" onClick={() => changeLineHeight()}>
                                                                    <img src={line_height} alt="Line Height" />
                                                                    <div className="dd-content">Line Height</div>
                                                                </button>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>

                                    {/* Sitemap */}
                                    <li>
                                        <button type="button" className="btn w-auto" aria-label="Sitemap" title="Sitemap" style={{ color: "white" }}>
                                            <img src={Sitemap} alt="Sitemap" />
                                        </button>
                                    </li>

                                    {/* Help */}
                                    <li>
                                        <button type="button" className="btn w-auto" aria-label="Help" title="Help" style={{ color: "white" }}>
                                            <img src={Help} alt="Help" />
                                        </button>
                                    </li>

                                    {/* Language Dropdown */}
                                    <li className="dropdown lagnuage-select-nav p-0 me-2 d-flex align-items-center">
                                        <button
                                            className="btn lagnuage-select border-0"
                                            type="button"
                                            id="dropdownMenuButton1"
                                            data-bs-toggle="dropdown"
                                            aria-label="Select Language"
                                            style={{ color: "white" }}
                                        >
                                            <img src={Language} alt="Language" />
                                        </button>

                                        <ul className="dropdown-menu language-dropdown">
                                            <li className="p-2 language-hover" onClick={() => window.langChange("hi_IN")}>
                                                Hindi
                                            </li>
                                            <li className="p-2 language-hover" onClick={() => window.langChange("en_IN")}>
                                                English
                                            </li>
                                        </ul>
                                    </li>

                                    {/* Logout */}
                                    <li>
                                        <button type="button" className="btn w-auto" aria-label="Logout" title="Logout" style={{ color: "white" }}>
                                            <img src={Logout} alt="Logout" />
                                        </button>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </header>
        </>
    )
};

export default Header;
