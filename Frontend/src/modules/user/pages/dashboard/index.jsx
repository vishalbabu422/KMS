import React from "react";
import PDF from "../../assets/images/KMS Icons/PDF.svg";
import Word from "../../assets/images/KMS Icons/Word.svg";
import Excel from "../../assets/images/KMS Icons/Excel.svg";
import Zip from "../../assets/images/KMS Icons/zip.svg";
import PPT from "../../assets/images/KMS Icons/PPT.svg";
import Online from "../../assets/images/KMS Icons/Online.svg";
import Text from "../../assets/images/KMS Icons/Text.svg";
import Link from "../../assets/images/KMS Icons/Link.svg";
import DummyImage from "../../assets/images/KMS Icons/Dummy-Image.svg";
import DashboardFilters from "./filters";

const Home = () => {
  const handleSearch = (e) => {
    const filter = e.target.value.toLowerCase();
    const items = document.querySelectorAll("#listContainer .item");

    items.forEach((item) => {
      const match = item.textContent.toLowerCase().includes(filter);
      item.style.display = match ? "" : "none";
    });
  };

  return (
    <>
      {/* NAVIGATION MENU */}
      <div className="container-fluid main-bg-nav-home">
        {/* Top Navigation */}
        <DashboardFilters />
        {/* DOCUMENT LIST */}
        <div className="notice-board-nav mt-3">
          <div className="row g-2 gy-4 w-100" id="listContainer">
            {/* Static item (repeatable in map) */}
            <div className="col-12 item portlet-body-data p-2">
              <div className="row gy-3">
                <div className="col-12">
                  <div className="d-flex">
                    <div>
                      <img src={PDF} alt="PDF" />
                    </div>
                    <div className="d-flex flex-grow-1 px-2">
                      <div className="row gy-2 w-100">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-xl-10">
                              <div className="doc-title-nav">
                                <a href="" className="doc-title">
                                  Test Document Name
                                </a>
                              </div>
                              <div className="doc-nav">
                                Rorem ipsum dolor sit amet, consectetur
                                adipiscing elit.
                              </div>
                            </div>
                            <div className="col-xl-2 py-2">
                              <div className="doc-date d-flex justify-content-xl-end">
                                20 March 2024
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Type + User */}
                        <div className="col-12">
                          <div className="row g-2">
                            <div className="col-lg-8">
                              <div className="row gy-2">
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Type: Documents
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Organisation: NIC
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Category: allowances
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4">
                              <div className="doc-user-nav d-flex justify-content-lg-end">
                                <div className="doc-user px-2 d-flex align-items-center">
                                  Deepika saini
                                </div>
                                <img src={DummyImage} alt="User" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 item portlet-body-data p-2">
              <div className="row gy-3">
                <div className="col-12">
                  <div className="d-flex">
                    <div>
                      <img src={Word} alt="Word" />
                    </div>
                    <div className="d-flex flex-grow-1 px-2">
                      <div className="row gy-2 w-100">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-xl-10">
                              <div className="doc-title-nav">
                                <a href="" className="doc-title">
                                  KMS Document
                                </a>
                              </div>
                              <div className="doc-nav">
                                Rorem ipsum dolor sit amet, consectetur
                                adipiscing elit.
                              </div>
                            </div>
                            <div className="col-xl-2 py-2">
                              <div className="doc-date d-flex justify-content-xl-end">
                                20 March 2024
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Type + User */}
                        <div className="col-12">
                          <div className="row g-2">
                            <div className="col-lg-8">
                              <div className="row gy-2">
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Type: Documents
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Organisation: NIC
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Category: allowances
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4">
                              <div className="doc-user-nav d-flex justify-content-lg-end">
                                <div className="doc-user px-2 d-flex align-items-center">
                                  Ashok Bhatia
                                </div>
                                <img src={DummyImage} alt="User" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 item portlet-body-data p-2">
              <div className="row gy-3">
                <div className="col-12">
                  <div className="d-flex">
                    <div>
                      <img src={Excel} alt="Excel" />
                    </div>
                    <div className="d-flex flex-grow-1 px-2">
                      <div className="row gy-2 w-100">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-xl-10">
                              <div className="doc-title-nav">
                                <a href="" className="doc-title">
                                  KMS Document
                                </a>
                              </div>
                              <div className="doc-nav">
                                Rorem ipsum dolor sit amet, consectetur
                                adipiscing elit.
                              </div>
                            </div>
                            <div className="col-xl-2 py-2">
                              <div className="doc-date d-flex justify-content-xl-end">
                                20 March 2024
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Type + User */}
                        <div className="col-12">
                          <div className="row g-2">
                            <div className="col-lg-8">
                              <div className="row gy-2">
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Type: Documents
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Organisation: NIC
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Category: allowances
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4">
                              <div className="doc-user-nav d-flex justify-content-lg-end">
                                <div className="doc-user px-2 d-flex align-items-center">
                                  Ashok Bhatia
                                </div>
                                <img src={DummyImage} alt="User" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 item portlet-body-data p-2">
              <div className="row gy-3">
                <div className="col-12">
                  <div className="d-flex">
                    <div>
                      <img src={Zip} alt="Zip" />
                    </div>
                    <div className="d-flex flex-grow-1 px-2">
                      <div className="row gy-2 w-100">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-xl-10">
                              <div className="doc-title-nav">
                                <a href="" className="doc-title">
                                  KMS Document
                                </a>
                              </div>
                              <div className="doc-nav">
                                Rorem ipsum dolor sit amet, consectetur
                                adipiscing elit.
                              </div>
                            </div>
                            <div className="col-xl-2 py-2">
                              <div className="doc-date d-flex justify-content-xl-end">
                                20 March 2024
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Type + User */}
                        <div className="col-12">
                          <div className="row g-2">
                            <div className="col-lg-8">
                              <div className="row gy-2">
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Type: Documents
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Organisation: NIC
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Category: allowances
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4">
                              <div className="doc-user-nav d-flex justify-content-lg-end">
                                <div className="doc-user px-2 d-flex align-items-center">
                                  Ashok Bhatia
                                </div>
                                <img src={DummyImage} alt="User" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 item portlet-body-data p-2">
              <div className="row gy-3">
                <div className="col-12">
                  <div className="d-flex">
                    <div>
                      <img src={Online} alt="Online" />
                    </div>
                    <div className="d-flex flex-grow-1 px-2">
                      <div className="row gy-2 w-100">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-xl-10">
                              <div className="doc-title-nav">
                                <a href="" className="doc-title">
                                  KMS Document
                                </a>
                              </div>
                              <div className="doc-nav">
                                Rorem ipsum dolor sit amet, consectetur
                                adipiscing elit.
                              </div>
                            </div>
                            <div className="col-xl-2 py-2">
                              <div className="doc-date d-flex justify-content-xl-end">
                                20 March 2024
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Type + User */}
                        <div className="col-12">
                          <div className="row g-2">
                            <div className="col-lg-8">
                              <div className="row gy-2">
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Type: Documents
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Organisation: NIC
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Category: allowances
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4">
                              <div className="doc-user-nav d-flex justify-content-lg-end">
                                <div className="doc-user px-2 d-flex align-items-center">
                                  Ashok Bhatia
                                </div>
                                <img src={DummyImage} alt="User" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 item portlet-body-data p-2">
              <div className="row gy-3">
                <div className="col-12">
                  <div className="d-flex">
                    <div>
                      <img src={Text} alt="Text" />
                    </div>
                    <div className="d-flex flex-grow-1 px-2">
                      <div className="row gy-2 w-100">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-xl-10">
                              <div className="doc-title-nav">
                                <a href="" className="doc-title">
                                  KMS Document
                                </a>
                              </div>
                              <div className="doc-nav">
                                Rorem ipsum dolor sit amet, consectetur
                                adipiscing elit.
                              </div>
                            </div>
                            <div className="col-xl-2 py-2">
                              <div className="doc-date d-flex justify-content-xl-end">
                                20 March 2024
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Type + User */}
                        <div className="col-12">
                          <div className="row g-2">
                            <div className="col-lg-8">
                              <div className="row gy-2">
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Type: Documents
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Organisation: NIC
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Category: allowances
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4">
                              <div className="doc-user-nav d-flex justify-content-lg-end">
                                <div className="doc-user px-2 d-flex align-items-center">
                                  Ashok Bhatia
                                </div>
                                <img src={DummyImage} alt="User" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 item portlet-body-data p-2">
              <div className="row gy-3">
                <div className="col-12">
                  <div className="d-flex">
                    <div>
                      <img src={Link} alt="Link" />
                    </div>
                    <div className="d-flex flex-grow-1 px-2">
                      <div className="row gy-2 w-100">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-xl-10">
                              <div className="doc-title-nav">
                                <a href="" className="doc-title">
                                  KMS Document
                                </a>
                              </div>
                              <div className="doc-nav">
                                Rorem ipsum dolor sit amet, consectetur
                                adipiscing elit.
                              </div>
                            </div>
                            <div className="col-xl-2 py-2">
                              <div className="doc-date d-flex justify-content-xl-end">
                                20 March 2024
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Type + User */}
                        <div className="col-12">
                          <div className="row g-2">
                            <div className="col-lg-8">
                              <div className="row gy-2">
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Type: Documents
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Organisation: NIC
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Category: allowances
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4">
                              <div className="doc-user-nav d-flex justify-content-lg-end">
                                <div className="doc-user px-2 d-flex align-items-center">
                                  Ashok Bhatia
                                </div>
                                <img src={DummyImage} alt="User" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 item portlet-body-data p-2">
              <div className="row gy-3">
                <div className="col-12">
                  <div className="d-flex">
                    <div>
                      <img src={PPT} alt="PPT" />
                    </div>
                    <div className="d-flex flex-grow-1 px-2">
                      <div className="row gy-2 w-100">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-xl-10">
                              <div className="doc-title-nav">
                                <a href="" className="doc-title">
                                  KMS Document
                                </a>
                              </div>
                              <div className="doc-nav">
                                Rorem ipsum dolor sit amet, consectetur
                                adipiscing elit.
                              </div>
                            </div>
                            <div className="col-xl-2 py-2">
                              <div className="doc-date d-flex justify-content-xl-end">
                                20 March 2024
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Type + User */}
                        <div className="col-12">
                          <div className="row g-2">
                            <div className="col-lg-8">
                              <div className="row gy-2">
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Type: Documents
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Organisation: NIC
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <div className="doc-type">
                                    Category: allowances
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4">
                              <div className="doc-user-nav d-flex justify-content-lg-end">
                                <div className="doc-user px-2 d-flex align-items-center">
                                  Ashok Bhatia
                                </div>
                                <img src={DummyImage} alt="User" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
