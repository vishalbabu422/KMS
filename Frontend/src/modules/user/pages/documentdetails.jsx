import { Link, useNavigate } from 'react-router-dom';
import PdfViewer from '../components/Pdfviewer';
import { useState, useEffect } from 'react';
import DocumentModal from '../components/elements/Modals';
import Share from './Share';

const Documentdetails = () => {

    const navigate = useNavigate();
    const pdfPath = "/Policy_Copy.pdf";

    const [isPdfAvailable, setIsPdfAvailable] = useState(false);

    /* Check PDF existence on page load */
    useEffect(() => {
        const checkPdfExists = async () => {
            try {
                const response = await fetch(pdfPath, { method: "HEAD" });
                setIsPdfAvailable(true);

            } catch (error) {
                setIsPdfAvailable(false);
            }
        };

        checkPdfExists();
    }, [pdfPath]);

    

    return (
        <>


            <div className="main-bg p-4 tab-content">
                <div className="main-nav-heading mb-2 d-flex align-items-center">
                    <nav style={{ "--bs-breadcrumb-divider": "'>'" }} aria-label="breadcrumb">
                        <ol className="breadcrumb doc-details-heading">
                            <li className="breadcrumb-item">
                                <Link to="/collection">Collection</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Document Details
                            </li>
                        </ol>
                    </nav>
                </div>

                <div className="row mt-0 gy-md-4 pb-2 mb-lg-2">
                    <div className={isPdfAvailable ? "col-lg-6" : "col-lg-12"} >
                        <div className="row g-3">

                            {/* Action Bar */}
                            <div className="col-12">
                                <div className="d-flex justify-content-end align-items-center docs-act">
                                    <a href="#">Subscribe</a>
                                    <a data-bs-toggle="modal" data-bs-target="#collection" href="#" role="button">
                                        <i
                                            className="bi bi-pencil-square"
                                            data-bs-toggle="tooltip"
                                            data-bs-title="edit"
                                            data-bs-placement="right"
                                        />
                                    </a>

                                    <div className="dropdown doc-action">
                                        <button
                                            className="btn border-0 px-2 w-auto"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            data-bs-display="static"
                                            aria-expanded="false">
                                            <i className="bi bi-three-dots" />
                                        </button>

                                        <ul className="dropdown-menu p-2 doc-details-share">
                                            {["Share", "History", "Rename", "Change State"].map(item => (
                                                <li className="dropdown-item" key={item}>
                                                    <button
                                                        type="button"
                                                        className="btn border-0 d-flex align-items-center w-100" onClick={() => navigate('/Share')}>
                                                        <span className="px-2">{item}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

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

                            {/* Accordion */}
                            <div className="col-12">
                                <div className="doc-accordion">
                                    <div className="accordion" id="accordiondocument">

                                        {/* Other Details */}
                                        <div className="accordion-item">
                                            <h2 className="accordion-header other-details-nav">
                                                <button
                                                    className="accordion-button collapsed"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#otherdetails">
                                                    Other Details
                                                </button>
                                            </h2>

                                            <div
                                                id="otherdetails"
                                                className="accordion-collapse collapse"
                                                data-bs-parent="#accordiondocument"
                                            >
                                                <div className="accordion-body">
                                                    <div className="row gy-3">

                                                        {[
                                                            "Category",
                                                            "Type",
                                                            "Audience",
                                                            "Language",
                                                            "Author",
                                                            "Organisation",
                                                            "Reference Number"
                                                        ].map(label => (
                                                            <div className="col-md-6" key={label}>
                                                                <div className="other-headings">
                                                                    <div>{label}</div>
                                                                </div>
                                                                <div className="docs-time">
                                                                    Category Category Category
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {/* Keywords */}
                                                        <div className="col-12">
                                                            <div className="other-headings">
                                                                <div>Keywords</div>
                                                            </div>
                                                            <div className="row g-2">
                                                                {[1, 2, 3, 4, 5, 6].map(i => (
                                                                    <div className="col-auto" key={i}>
                                                                        <div className="keyword-class">
                                                                            Keyword {i} <i className="bi bi-x" />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Relevant Document Details */}
                                        <div className="accordion-item">
                                            <h2 className="accordion-header other-details-nav">
                                                <button
                                                    className="accordion-button collapsed"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#relevantdocdetails"
                                                >
                                                    Relevant Document Details
                                                </button>
                                            </h2>

                                            <div
                                                id="relevantdocdetails"
                                                className="accordion-collapse collapse"
                                                data-bs-parent="#accordiondocument"
                                            >
                                                <div className="accordion-body">
                                                    <div className="docs-head">
                                                        Vorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className={isPdfAvailable ? "col-lg-6" : "d-none"}>
                        <PdfViewer file={pdfPath} />
                    </div>
                </div>
            </div>

            <DocumentModal modalId="document"></DocumentModal>
            <DocumentModal modalId="collection" />
            <DocumentModal modalId="link" />
            <DocumentModal modalId="online" />

        </>
    )
}

export default Documentdetails
