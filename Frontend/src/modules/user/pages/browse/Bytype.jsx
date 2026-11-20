import { useState } from "react";
import "react-contexify/dist/ReactContexify.css";
import Listing from "../../components/elements/Form/listing";

const MENU_ID = "example_menu";

const Bytype = () => {

  return (
    <>
      <div className="main-bg p-4 tab-content">

        <div>
          <div className="row">
            <div className="col-xxl-7 d-flex align-items-center">
              <div className="main-nav-heading">By Type</div>
            </div>

            <div className="col-xxl-5 pb-0 pb-md-0">
              <div className="row justify-content-end align-items-center">
                <div className="col-md-6 p-2 pe-3 d-flex justify-content-md-end justify-content-center order-md-1 order-2 search-wrapper">
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
        <Listing />
      </div>
    </>
  );
}

export default Bytype
