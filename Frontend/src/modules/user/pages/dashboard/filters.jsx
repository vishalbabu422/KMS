import InnerSearch from "../../components/InnerSearch";

const DashboardFilters = () => {
  return (
    <div className="row">
      {/* Left Filters */}
      <div className="col-xxl-7 d-flex align-items-center justify-content-xl-start justify-content-lg-center">
        <div className="browse-menu navbar-expand d-lg-flex">
          <div className="d-md-flex">
            <ul className="navbar-nav browse-menu-nav">
              <li>
                <button>All</button>
              </li>

              {/* Type Dropdown */}
              <li>
                <button className="dropdown-toggle" data-bs-toggle="dropdown">
                  Type
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item">Circular</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Documents</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Notice</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Office Order</a>
                  </li>
                </ul>
              </li>

              {/* Time Dropdown */}
              <li>
                <button className="dropdown-toggle" data-bs-toggle="dropdown">
                  Time
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item">Today</a>
                  </li>
                  <li>
                    <a className="dropdown-item">This Week</a>
                  </li>
                  <li>
                    <a className="dropdown-item">This Month</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Last Month</a>
                  </li>
                  <li>
                    <a className="dropdown-item">This Year</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Custom Date</a>
                  </li>
                </ul>
              </li>
            </ul>

            {/* Audience + Language */}
            <ul className="navbar-nav browse-menu-nav">
              <li>
                <button className="dropdown-toggle" data-bs-toggle="dropdown">
                  Audience
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item">Secretary</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Joint Secretary</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Under Secretary</a>
                  </li>
                </ul>
              </li>

              <li>
                <button className="dropdown-toggle" data-bs-toggle="dropdown">
                  Language
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item">English</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Hindi</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Urdu</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="pt-md-2 pt-lg-0">
            <ul className="navbar-nav browse-menu-nav">
              <li>
                <button className="dropdown-toggle" data-bs-toggle="dropdown">
                  Category
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item">One</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Two</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Three</a>
                  </li>
                </ul>
              </li>
              <li>
                <button>Organisation</button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Search + Dept Dropdown */}
      <InnerSearch />
    </div>
  );
};

export default DashboardFilters;
