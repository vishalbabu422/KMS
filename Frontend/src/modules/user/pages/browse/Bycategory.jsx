import React, { useState } from "react";
import "react-contexify/dist/ReactContexify.css";
import Listing from "../../components/elements/Form/listing";
import FolderTree from "../../components/elements/treeData";

const Bycategory = () => {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="main-bg p-4 tab-content">
      <div className="row">
        <div className="col-xxl-12 d-flex align-items-center">
          <div className="main-nav-heading">By Category</div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4">
          <div className="tree-data pt-5">
            <FolderTree onNodeClick={setSelectedNode} />
          </div>
        </div>

        <div className="col-lg-8">
          <div className="listing">
            {selectedNode && <Listing node={selectedNode} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bycategory;
