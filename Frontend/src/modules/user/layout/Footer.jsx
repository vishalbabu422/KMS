import DigitalIndiaLogo from "../assets/images/svg/logo-digital-india.png";
import NICLogo from "../assets/images/svg/logo-NIC.png";

const Footer = () => {
    return (
        <>
            <footer className="app-footer footer-theme flex-shrink-0">
                <div className="footer-background d-md-flex flex-column flex-md-row">
                    <div className="footer-logo-bar d-flex flex-md-grow-1 pe-4">
                        <div className="ps-4">
                            Version 9.0
                        </div>

                        <div className="d-none d-md-flex flex-md-grow-1">
                            <p className="mb-0 flex-grow-1 text-center">
                                eOffice is Mission Mode Project under the National E-Governance Plan,
                                developed and implemented by National Informatics Centre (NIC) © 2016
                            </p>
                        </div>

                        <div className="ms-auto d-md-flex">
                            <img
                                className="footer-logo"
                                src={DigitalIndiaLogo}
                                alt="Digital India"
                            />
                            <img
                                className="footer-logo"
                                src={NICLogo}
                                alt="NIC bilingual logo"
                            />
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
};

export default Footer;
