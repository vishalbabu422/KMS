import React from "react";

const InnerSearch = () => {

    const handleSearch = (e) => {
        const filter = e.target.value.toLowerCase();
        const items = document.querySelectorAll("#listContainer .item");

        items.forEach(item => {
            const match = item.textContent.toLowerCase().includes(filter);
            item.style.display = match ? "" : "none";
        });
    };

    return (
        <>
            {/* Search Field */}

            <div className="col-xxl-5 py-2 pb-0 py-md-2 pb-md-0">
                <div className="row justify-content-md-end justify-content-center align-items-center">
                    <div className="col-md-6 col-11 pe-0 d-flex justify-content-md-end justify-content-center order-md-1 order-2 search-wrapper">
                        <button className="btn label-search-home-kms w-auto">
                            <i className="bi bi-search"></i>
                        </button>
                        <input className="search-home-kms py-md-2" id="searchleft2" type="text" placeholder="Search" onChange={handleSearch} />
                    </div>

                    <div className="col-md-auto ps-md-2 pb-2 py-1 dept-drop d-flex justify-content-md-end justify-content-center order-md-2 order-1">
                        <button className="dropdown-toggle btn-light3" data-bs-toggle="dropdown">
                            Department Notice Board
                        </button>
                        <ul className="dropdown-menu">
                            <li><a href="" className="dropdown-item">Notice Board</a></li>
                            <li><a href="" className="dropdown-item">Administration</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
};

export default InnerSearch;