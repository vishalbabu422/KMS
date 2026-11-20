import CenterHeader from "./CenterHeader";
import Home from "../pages/dashboard";

const Center = () => {

    return (
        <>
            <main className="flex-grow-1 overflow-auto d-flex flex-column">
                <div className="main-content">
                    <div className="d-flex flex-column flex-grow-1 mx-4">
                        <div className="flex-grow-1 content-area p-xl-4 pt-xl-0 pt-0">
                            <div className="row gx-4" id="portletContainer">

                                 {/* SEARCH BAR + CREATE BUTTON */ }
                                <CenterHeader></CenterHeader>

                                {/* NAVIGATION MENU */}
                                <Home></Home>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </>
    )
};

export default Center;
