import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'react-contexify/dist/ReactContexify.css'
import './styles/user.css'

import { Routes, Route } from 'react-router-dom'
import Header from './layout/Header.jsx'
import Footer from './layout/Footer.jsx'
import Left from './layout/Left.jsx'
import Right from './layout/Right.jsx'
import CenterHeader from './layout/CenterHeader.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { PageContextMenuProvider } from './components/elements/PageContextMenuProvider.jsx'

import Home from './pages/dashboard/index.jsx'
import Collection from './pages/collection.jsx'
import ContactGroup from './pages/contactgroup.jsx'
import MyDocs from './pages/mydocs.jsx'
import DocumentDetails from './pages/documentdetails.jsx'
import Share from './pages/Share.jsx'

import Recent from './pages/documents/Recent.jsx'
import Pending from './pages/documents/Pending.jsx'
import Shared from './pages/documents/Shared.jsx'
import Subscribed from './pages/documents/Subscribed.jsx'
import Published from './pages/documents/Published.jsx'
import Submitted from './pages/documents/Submitted.jsx'
import Reviewed from './pages/documents/Reviewed.jsx'
import Bytype from './pages/browse/Bytype.jsx'
import Bycategory from './pages/browse/Bycategory.jsx'

function UserApp() {
  return (
    <ThemeProvider>
      <div className="d-flex flex-column">
          <Header />
          <div className="d-flex flex-grow-1 ps-3 center" style={{ overflowY: 'hidden' }}>
            <Left />
            <main className="flex-grow-1 overflow-auto d-flex flex-column">
              <div className="main-content">
                <div className="d-flex flex-column flex-grow-1 mx-4">
                  <div className="flex-grow-1 content-area p-xl-4 pt-xl-0 pt-0">
                    <div className="row gx-4" id="portletContainer">
                      <CenterHeader />
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/collection" element={<Collection />} />
                        <Route path="/contactgroup" element={<ContactGroup />} />
                        <Route path="/mydocs" element={<MyDocs />} />
                        <Route
                          path="/recent"
                          element={
                            <PageContextMenuProvider>
                              <Recent />
                            </PageContextMenuProvider>
                          }
                        />
                        <Route path="/pending" element={<Pending />} />
                        <Route path="/shared" element={<Shared />} />
                        <Route path="/subscribed" element={<Subscribed />} />
                        <Route path="/published" element={<Published />} />
                        <Route path="/submitted" element={<Submitted />} />
                        <Route path="/reviewed" element={<Reviewed />} />
                        <Route path="/documentdetails" element={<DocumentDetails />} />
                        <Route path="/Share" element={<Share />} />
                        <Route path="/Bytype" element={<Bytype />} />
                        <Route path="/Bycategory" element={<Bycategory />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              </div>
            </main>
            <Right />
          </div>
          <Footer />
      </div>
    </ThemeProvider>
  )
}

export default UserApp
