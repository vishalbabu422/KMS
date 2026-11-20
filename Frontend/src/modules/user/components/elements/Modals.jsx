import React, { useState, useEffect } from "react";
import TextInput from "./Form/text-input";
import TextArea from "./Form/text-area";
import FileInput from "./Form/file-upload";
import SelectForm from "./Form/selectInput";
import LinkInput from "./Form/link-input";

export default function DocumentModal(props) {
    const [step, setStep] = useState(1);
    const dropOptions = { '1': 'One', '2': 'Two', '3': 'three' }
    const dropLanguage = { '1': 'Hindi', '2': 'English', '3': 'Other' }

    useEffect(() => {
        const modal = document.getElementById("document");

        const resetStep = () => setStep(1);

        if (modal) {
            modal.addEventListener("hidden.bs.modal", resetStep);
        }

        return () => {
            if (modal) {
                modal.removeEventListener("hidden.bs.modal", resetStep);
            }
        };
    }, []);

    return (
        <div
            className="modal fade"
            id={props.modalId}
            data-bs-backdrop="static"
            tabIndex="-1"
        >
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content tab-content">

                    {/* HEADER */}
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Create {props.modalId?.charAt(0).toUpperCase() + props.modalId?.slice(1)}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            onClick={() => setStep(1)}
                        />
                    </div>

                    {/* ---------------- STEP 1 ---------------- */}
                    <div className={`modal-body tab-pane fade ${step === 1 ? "show active" : ""}`}>

                        {/* Progress */}
                        <div className="row d-flex">
                            <div className="col-4 d-flex justify-content-center">
                                <div className="row gy-2">
                                    <div className="col-12 d-flex justify-content-center">
                                        <div className="filled-circle-check-nav">
                                            <div className="filled-circle-check"></div>
                                        </div>
                                    </div>
                                    <div className="col-12 text-center basic-deta-bold">Basic Details</div>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="border-bottom pt-4"></div>
                            </div>

                            <div className="col-4 d-flex justify-content-center">
                                <div className="row gy-2">
                                    <div className="col-12 d-flex justify-content-center">
                                        <div className="filled-circle-grey"></div>
                                    </div>
                                    <div className="col-12 text-center basic-deta-reg">Update Status</div>
                                </div>
                            </div>
                        </div>

                        {/* FORM */}
                        <div className="row my-5 px-3 gy-4 tab-inner accordion">
                            <form className="was-validated">

                                <div className="mb-3">
                                    <div className="form-floating">
                                        <TextInput InputClass="form-control" InputId="docTitle" InputPlaceHolder="Write your title" InputRequired />
                                        <label htmlFor="docTitle">Title</label>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="form-floating">
                                        <TextArea TextareaClass="form-control" TextareaId="docDescription" rows="1" TextareaPlaceHolder="Write your description" TextareaRequired />
                                        <label htmlFor="docDescription">Description</label>
                                    </div>
                                </div>

                                {/* Link */}
                                {props.modalId === "link" && (
                                    <div className="mb-3">
                                        <div className="form-floating">
                                            <LinkInput LinkClass="form-control" LinkId="docLink" LinkPlaceHolder="Link" LinkRequired />
                                            <label htmlFor="docLink">Link</label>
                                        </div>
                                    </div>
                                )}

                                {/* File */}
                                {props.modalId !== "link" && (
                                    <div className="mb-3">
                                        <FileInput InputClass="form-control" InputType="file" InputId="docfile" InputRequired />
                                    </div>
                                )}

                                {/* ✅ FIXED UNIQUE COLLAPSE */}
                                {(props.modalId === "document" || props.modalId === "online") && (
                                    <>
                                        <a
                                            className="btn other-details px-2 py-1 accordion-button"
                                            data-bs-toggle="collapse"
                                            href={`#otherDetails-${props.modalId}`}
                                        >
                                            Other Details
                                        </a>

                                        <div className="collapse" id={`otherDetails-${props.modalId}`}>
                                            <div className="card card-body px-0 border-0">

                                                <div className="mb-3">
                                                    <div className="form-floating">
                                                        <TextInput InputClass="form-control" InputId="docCategory" InputPlaceHolder="Category" />
                                                        <label htmlFor="docCategory">Category</label>
                                                    </div>
                                                </div>

                                                <div className="row gy-3">
                                                    <div className="col-md-6">
                                                        <div className="form-floating">
                                                            <SelectForm SelectClass="form-select" SelectId="selectType" selectOption={dropOptions} />
                                                            <label htmlFor="selectType">Type</label>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-floating">
                                                            <SelectForm SelectClass="form-select" SelectId="selectAudience" selectOption={dropOptions} />
                                                            <label htmlFor="selectAudience">Audience</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row gy-3 mt-1">
                                                    <div className="col-md-6">
                                                        <div className="form-floating">
                                                            <SelectForm SelectClass="form-select" SelectId="selectLanguage" selectOption={dropLanguage} />
                                                            <label htmlFor="selectLanguage">Language</label>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-floating">
                                                            <TextInput InputClass="form-control" InputId="docAuthor" InputPlaceHolder="Author" />
                                                            <label htmlFor="docAuthor">Author</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-3 mt-3">
                                                    <div className="form-floating">
                                                        <TextInput InputId="docKeywords" InputClass="form-control" InputPlaceHolder="Keywords" />
                                                        <label htmlFor="docKeywords">Keywords</label>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <div className="form-floating">
                                                        <TextInput InputId="referenceNo" InputClass="form-control" InputPlaceHolder="Reference Number" />
                                                        <label htmlFor="referenceNo">Reference Number</label>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <div className="form-floating">
                                                        <TextInput InputId="relevantDocs" InputClass="form-control" InputPlaceHolder="Search document…" />
                                                        <label htmlFor="relevantDocs">Relevant Documents</label>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </>
                                )}

                            </form>
                        </div>

                        <div className="modal-footer border-0">
                            <button className="nav-link next send-btn p-2 px-3" onClick={() => setStep(2)}>
                                Next
                            </button>
                        </div>
                    </div>

                    {/* ---------------- STEP 2 ---------------- */}
                    <div className={`modal-body tab-pane fade ${step === 2 ? "show active" : ""}`}>

                        {/* Progress */}
                        <div className="row d-flex">
                            <div className="col-4 d-flex justify-content-center">
                                <div className="row gy-2">
                                    <div className="col-12 d-flex justify-content-center">
                                        <div className="filled-circle-check-2 d-flex align-items-center justify-content-center">
                                            <i className="bi bi-check"></i>
                                        </div>
                                    </div>
                                    <div className="col-12 text-center basic-deta-reg">Basic Details</div>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="border-bottom pt-4"></div>
                            </div>

                            <div className="col-4 d-flex justify-content-center">
                                <div className="row gy-2">
                                    <div className="col-12 d-flex justify-content-center">
                                        <div className="filled-circle-check-nav">
                                            <div className="filled-circle-check"></div>
                                        </div>
                                    </div>
                                    <div className="col-12 text-center basic-deta-bold">Update Status</div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="row my-5 px-3 gy-4 tab-inner">

                            <div className="col-12 create-col-title">Current Status</div>
                            <div className="col-12 create-col-desc mt-2">Pending state</div>

                            <div className="col-12 mt-3">
                                <div className="col-12 create-col-title">Keywords</div>

                                <div className="col-12 create-col-key">
                                    <ul className="list-group">
                                        {["No Change", "Reject", "Visible", "Publish", "Approve"].map((label, idx) => (
                                            <li key={idx} className="list-group-item">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="statusRadio" />
                                                    <label className="form-check-label">{label}</label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="col-12 mt-3">
                                <h6>Note:</h6>

                                <div className="row">
                                    <div className="col-auto">No Change</div>
                                    <div className="col-9">Document stays in the current state.</div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-auto">Submit</div>
                                    <div className="col-10">Document will be submitted to Folder Administrator.</div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-auto">Publish</div>
                                    <div className="col-10">Document will be published (Reviewer/Publisher only).</div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-auto">Visible</div>
                                    <div className="col-10">Document becomes visible but not published.</div>
                                </div>
                            </div>

                        </div>

                        <div className="modal-footer border-0">
                            <button className="btn send-btn me-2" onClick={() => setStep(1)}>
                                Previous
                            </button>
                            <button className="btn send-btn">Save</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}